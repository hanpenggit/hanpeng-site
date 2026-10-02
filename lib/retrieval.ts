import { Index } from "@upstash/vector";

// Semantic retrieval over hanpeng's private writing (ingested into Upstash Vector
// with the built-in text-embedding-3-small). If the env vars are absent the
// chatbot still works — it just answers from profile.json without the extra
// context. Edge-compatible (fetch-based), like the other Upstash clients.
const hasVector =
  !!process.env.UPSTASH_VECTOR_REST_URL &&
  !!process.env.UPSTASH_VECTOR_REST_TOKEN;

const index = hasVector
  ? new Index({
      url: process.env.UPSTASH_VECTOR_REST_URL!,
      token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
    })
  : null;

export async function retrieveContext(
  query: string,
  topK = 6,
): Promise<string> {
  if (!index || !query.trim()) return "";
  try {
    const results = await index.query({ data: query, topK, includeData: true });
    const passages = results
      .map((r) => (typeof r.data === "string" ? r.data.trim() : ""))
      .filter((p) => p.length > 0);
    if (!passages.length) return "";
    return passages.map((p, i) => `(${i + 1}) ${p}`).join("\n\n");
  } catch (err) {
    console.error("[chat] vector retrieval failed:", err);
    return "";
  }
}
