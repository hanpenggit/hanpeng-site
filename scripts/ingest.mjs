// Ingest the private writing in /sources into Upstash Vector for the chatbot's RAG.
// Run locally (never in CI/Vercel):
//   node --env-file=.env.local scripts/ingest.mjs
//
// It extracts text from PDF/DOCX/MD, strips contact/PII boilerplate, chunks the
// text, drops near-duplicate chunks (you have many similar cover letters), and
// upserts the chunks into the Upstash Vector index (which embeds them with the
// built-in text-embedding-3-small). Re-running fully refreshes the index.

import fs from "node:fs";
import path from "node:path";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import { Index } from "@upstash/vector";

const SOURCES_DIR = path.resolve("sources");
const CHUNK_CHARS = 1600; // ~400 tokens
const OVERLAP_CHARS = 220;
const DEDUP_THRESHOLD = 0.8; // trigram Jaccard above this => near-duplicate, skip
const BATCH = 24;

const { UPSTASH_VECTOR_REST_URL, UPSTASH_VECTOR_REST_TOKEN } = process.env;
if (!UPSTASH_VECTOR_REST_URL || !UPSTASH_VECTOR_REST_TOKEN) {
  console.error("Missing UPSTASH_VECTOR_REST_URL / UPSTASH_VECTOR_REST_TOKEN (load .env.local with: node --env-file=.env.local …)");
  process.exit(1);
}
const index = new Index({ url: UPSTASH_VECTOR_REST_URL, token: UPSTASH_VECTOR_REST_TOKEN });

// ── helpers ──────────────────────────────────────────────────────────────────
function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (entry.name !== "README.md") out.push(p);
  }
  return out;
}

function categorize(name) {
  const n = name.toLowerCase();
  if (/cover[\s_-]?letter/.test(n)) return "cover letter";
  if (/resume/.test(n)) return "resume";
  if (/^post\s*\d|published/.test(n)) return "linkedin post";
  if (/spechawk/.test(n)) return "spechawk document";
  if (/case/.test(n)) return "case study";
  return "document";
}

async function extractText(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext === ".md" || ext === ".txt") return fs.readFileSync(file, "utf8");
  if (ext === ".docx") {
    const { value } = await mammoth.extractRawText({ path: file });
    return value;
  }
  if (ext === ".pdf") {
    const parser = new PDFParse({ data: new Uint8Array(fs.readFileSync(file)) });
    try {
      const res = await parser.getText();
      return res.text;
    } finally {
      await parser.destroy();
    }
  }
  return "";
}

// Strip contact info / boilerplate so nothing private becomes publicly askable.
function sanitize(text) {
  let t = text.replace(/\r/g, "");
  t = t.replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, ""); // emails
  t = t.replace(/(\+?\d[\d\s().-]{8,}\d)/g, (m) => (/\d{3}.*\d{3}.*\d{4}/.test(m) ? "" : m)); // phone numbers
  const drop =
    /^(dear\b.*|sincerely\b.*|best regards\b.*|warm regards\b.*|thank you for your.*|yours truly\b.*|kind regards\b.*|to whom it may concern.*|\d{1,2}\/\d{1,2}\/\d{2,4}|[a-z]+ \d{1,2},? \d{4}|sahil sapra|charlotte,? nc.*|.*\b\d{5}(-\d{4})?\b.*(street|st\.?|ave\.?|avenue|road|rd\.?|drive|dr\.?|blvd).*)$/i;
  t = t
    .split("\n")
    .filter((line) => !drop.test(line.trim()))
    .join("\n");
  return t.replace(/\n{3,}/g, "\n\n").replace(/[ \t]{2,}/g, " ").trim();
}

function chunk(text) {
  const paras = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const chunks = [];
  let buf = "";
  const flush = () => {
    if (buf.trim().length > 60) chunks.push(buf.trim());
    buf = buf.length > OVERLAP_CHARS ? buf.slice(-OVERLAP_CHARS) : "";
  };
  for (const para of paras) {
    if ((buf + "\n\n" + para).length > CHUNK_CHARS && buf) flush();
    buf += (buf ? "\n\n" : "") + para;
    while (buf.length > CHUNK_CHARS * 1.4) {
      chunks.push(buf.slice(0, CHUNK_CHARS).trim());
      buf = buf.slice(CHUNK_CHARS - OVERLAP_CHARS);
    }
  }
  if (buf.trim().length > 60) chunks.push(buf.trim());
  return chunks;
}

function trigrams(s) {
  const words = s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  const set = new Set();
  for (let i = 0; i < words.length - 2; i++) set.add(words[i] + " " + words[i + 1] + " " + words[i + 2]);
  return set;
}
function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

// ── run ──────────────────────────────────────────────────────────────────────
const files = walk(SOURCES_DIR);
console.log(`Found ${files.length} source files. Resetting index…`);
await index.reset();

const kept = []; // { id, data, metadata }
const keptGrams = [];
let rawChunks = 0;
let dupes = 0;

for (const file of files) {
  const name = path.basename(file);
  const category = categorize(name);
  let text;
  try {
    text = sanitize(await extractText(file));
  } catch (e) {
    console.warn(`  ⚠ skipped (extract failed): ${name} — ${e.message}`);
    continue;
  }
  const parts = chunk(text);
  rawChunks += parts.length;
  let keptForFile = 0;
  parts.forEach((data, i) => {
    const g = trigrams(data);
    if (keptGrams.some((kg) => jaccard(g, kg) > DEDUP_THRESHOLD)) {
      dupes++;
      return;
    }
    keptGrams.push(g);
    const id = `${name.replace(/[^a-zA-Z0-9]+/g, "-").slice(0, 80)}#${i}`;
    kept.push({ id, data, metadata: { source: name, category } });
    keptForFile++;
  });
  console.log(`  • ${name}  [${category}]  ${parts.length} chunks → ${keptForFile} kept`);
}

console.log(`\nChunks: ${rawChunks} total, ${dupes} near-duplicates dropped, ${kept.length} to upsert.`);

for (let i = 0; i < kept.length; i += BATCH) {
  const batch = kept.slice(i, i + BATCH);
  await index.upsert(batch);
  process.stdout.write(`  upserted ${Math.min(i + BATCH, kept.length)}/${kept.length}\r`);
}

// give Upstash a moment to finish embedding, then report
await new Promise((r) => setTimeout(r, 1500));
const info = await index.info();
console.log(`\n✓ Done. Index now reports ${info.vectorCount} vectors (pending: ${info.pendingVectorCount}).`);
