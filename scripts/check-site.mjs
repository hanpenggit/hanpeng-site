// Dependency-free content / deployment preflight for Cloudflare Workers.
// Run via `npm run check:content` before building and in CI.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const load = (file) => JSON.parse(readFileSync(join(root, file), "utf8"));
const data = load("content/profile.json");
const workerText = readFileSync(join(root, "wrangler.jsonc"), "utf8");

function absoluteUrl(value, label) {
  assert.equal(typeof value, "string", `${label}: must be a string`);
  const url = new URL(value);
  assert.equal(url.protocol, "https:", `${label}: use HTTPS`);
  assert.ok(url.hostname && !url.username && !url.password, `${label}: invalid host`);
}

absoluteUrl(data.meta.siteUrl, "meta.siteUrl");
absoluteUrl(data.identity.links.website, "identity.links.website");
assert.ok(data.meta.siteUrl !== data.identity.links.website, "Portfolio and product domains must differ");
assert.match(data.meta.lastUpdated, /^\d{4}-\d{2}-\d{2}$/);
assert.ok(!Number.isNaN(Date.parse(data.meta.lastUpdated)), "Invalid lastUpdated date");
assert.match(data.identity.links.email, /^[^@\s]+@[^@\s]+\.[^@\s]+$/);
assert.ok(data.identity.name && data.identity.heroSummary);
assert.ok(Array.isArray(data.projects) && data.projects.length > 0);
assert.equal(new Set(data.projects.map((p) => p.name)).size, data.projects.length, "Duplicate project names");
for (const [i, project] of data.projects.entries()) {
  assert.ok(project.name && project.blurb && project.detail, `projects[${i}]: missing title/detail`);
  for (const link of project.links ?? []) absoluteUrl(link.href, `projects[${i}].links`);
  assert.ok(project.stage?.trim(), `projects[${i}]: must have an explicit stage`);
  assert.ok(project.caseStudy, `projects[${i}]: missing case study`);
  for (const field of ["challenge", "approach", "progress"]) {
    assert.ok(project.caseStudy[field]?.trim()?.length >= 10, `projects[${i}].caseStudy.${field}: missing or too short`);
  }
}
assert.ok(data.projects.some((p) => p.name === "AI Workflow OS" && p.stage === "研发中"), "AI Workflow OS must be transparently marked as in development");
assert.equal(data.headlineMetrics.some((m) => m.value === 0), false, "Do not display confusing zero metrics");
assert.ok(Array.isArray(data.aiLab.experiments));
assert.ok(Array.isArray(data.build.groups));
assert.ok(Array.isArray(data.experience));
assert.ok(Array.isArray(data.headlineMetrics));
assert.match(workerText, /"CHAT_RATE_LIMIT"/, "Workers must configure native chat rate limiting");
assert.match(workerText, /"nodejs_compat"/, "Workers must enable nodejs_compat for OpenNext");
assert.match(workerText, /\.open-next\/worker\.js/, "Workers should target OpenNext build artifact");
const events = new Set(data.analytics.events);
assert.equal(events.size, data.analytics.events.length, "Duplicate analytics events");
const apiEvents = readFileSync(join(root, "app/api/event/route.ts"), "utf8");
for (const name of events) assert.ok(apiEvents.includes(`"${name}"`), `Analytics event missing in API: ${name}`);


const chatbot = readFileSync(join(root, "app/api/chat/route.ts"), "utf8");
assert.ok(chatbot.includes("verifyTurnstile"), "Chat API must verify Turnstile on server");
assert.ok(chatbot.includes("limitEdge") && chatbot.includes("limitGlobal"), "Chat API must enforce rate limits");
assert.ok(!chatbot.includes("retrieveContext"), "Public chat must not load private vector knowledge");
assert.ok(!workerText.includes("OPENROUTER_API_KEY"), "API key should never be configured in wrangler.jsonc");

console.log(`PASS: profile, URLs, ${data.projects.length} projects, analytics events, Workers security config`);
