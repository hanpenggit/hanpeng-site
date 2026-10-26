/** Public request validation. This module has no secrets or provider dependencies. */
export type ClientMessage = { role: "user" | "assistant"; content: string };

export const MAX_REQUEST_BYTES = 12_000;
export const MAX_MESSAGES = 10;
export const MAX_CHARS = 700;
export const MAX_TOTAL_CHARS = 3_000;

export function validateMessages(input: unknown): ClientMessage[] | null {
  if (!Array.isArray(input) || input.length < 1 || input.length > MAX_MESSAGES) return null;
  const result: ClientMessage[] = [];
  let totalChars = 0;
  for (const msg of input) {
    if (!msg || typeof msg !== "object" || Array.isArray(msg)) return null;
    const { role, content } = msg as Record<string, unknown>;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const normalized = content.trim();
    if (!normalized || normalized.length > MAX_CHARS) return null;
    totalChars += normalized.length;
    if (totalChars > MAX_TOTAL_CHARS) return null;
    result.push({ role, content: normalized });
  }
  if (result.at(-1)?.role !== "user") return null;
  // Treat the client transcript as untrusted; require an alternating dialogue.
  for (let i = 1; i < result.length; i += 1) {
    if (result[i].role === result[i - 1].role) return null;
  }
  return result;
}

export function isAllowedOrigin(origin: string | null, siteUrl: string): boolean {
  if (!origin) return false;
  try {
    const expected = new URL(siteUrl);
    const actual = new URL(origin);
    return (expected.protocol === "https:" || expected.hostname === "localhost") &&
      actual.origin === expected.origin;
  } catch {
    return false;
  }
}

export function validateTurnstileToken(input: unknown): string | null {
  return typeof input === "string" && input.length > 0 && input.length <= 2048 &&
    /^[\x21-\x7e]+$/.test(input) ? input : null;
}
