import { buildSystemPrompt } from "@/lib/system-prompt";
import { profile } from "@/lib/profile";
import { hasChatLimiter, limitEdge, limitGlobal } from "@/lib/ratelimit";
import { getSiteUrl } from "@/lib/site";
import { readTextWithLimit } from "@/lib/request";
import { isAllowedOrigin, MAX_REQUEST_BYTES, validateMessages, validateTurnstileToken } from "@/lib/chat-validation";
import { verifyTurnstile } from "@/lib/turnstile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const encoder = new TextEncoder();

function text(message: string, status = 200): Response {
  return new Response(message, {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
    },
  });
}

export async function POST(req: Request): Promise<Response> {
  if (!profile.chatbot.enabled) return text("Not found.", 404);

  const siteUrl = getSiteUrl();
  if (!isAllowedOrigin(req.headers.get("origin"), siteUrl)) return text("Forbidden.", 403);
  if (!(req.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json")) {
    return text("Unsupported Media Type.", 415);
  }
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  const challengeSecret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!apiKey || !challengeSecret || !hasChatLimiter()) {
    return text("AI 助手正在维护中，请稍后再试。", 503);
  }

  const declaredLength = Number(req.headers.get("content-length") ?? 0);
  if (!Number.isFinite(declaredLength) || declaredLength > MAX_REQUEST_BYTES) return text("Request too large.", 413);

  let messages;
  let token;
  try {
    const raw = await readTextWithLimit(req, MAX_REQUEST_BYTES);
    if (raw === null) return text("Request too large.", 413);
    const parsed: unknown = JSON.parse(raw);
    const body = parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed as Record<string, unknown> : null;
    messages = validateMessages(body?.messages);
    token = validateTurnstileToken(body?.turnstileToken);
  } catch {
    return text("Invalid request.", 400);
  }
  if (!messages || !token) return text("Invalid request.", 400);

  // Never accept x-forwarded-for or a caller-selected rate key.
  const remoteIp = req.headers.get("cf-connecting-ip");
  const identifier = remoteIp || "unknown";
  if (!(await limitEdge(identifier))) return text("访问频率过高，请稍后再试。", 429);

  const hostname = new URL(siteUrl).hostname;
  if (!(await verifyTurnstile(token, challengeSecret, hostname, remoteIp))) {
    return text("人机验证未通过，请重新验证后再试。", 403);
  }

  if (!(await limitGlobal(identifier))) return text("访问频率过高，请稍后再试。", 429);

  // Private RAG files are intentionally not retrieved into this public model prompt.
  // Only facts already visible on the public portfolio are sent upstream.
  let upstream: Response;
  try {
    upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      signal: AbortSignal.timeout(25_000),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": siteUrl,
        "X-Title": "Hanpeng Portfolio AI Assistant",
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL?.trim() || "openai/gpt-4.1-mini",
        stream: true,
        temperature: 0.4,
        max_tokens: 400,
        messages: [{ role: "system", content: buildSystemPrompt() }, ...messages],
      }),
    });
  } catch {
    console.error("[chat] model unavailable");
    return text("AI 服务暂时不可用，请稍后再试。", 502);
  }

  if (!upstream.ok || !upstream.body) {
    console.error("[chat] upstream failure status:", upstream.status);
    await upstream.body?.cancel().catch(() => {});
    return text("AI 服务暂时不可用，请稍后再试。", 502);
  }

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let emittedChars = 0;
  const MAX_STREAM_CHARS = 6_000;
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        let doneMarker = false;
        while (!doneMarker) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          // Avoid accumulating unbounded upstream data or leaking provider errors.
          if (buffer.length > 64_000) break;
          const frames = buffer.split("\n");
          buffer = frames.pop() ?? "";
          for (const frame of frames) {
            const line = frame.trim();
            if (!line.startsWith("data:")) continue;
            const data = line.slice(5).trim();
            if (data === "[DONE]") { doneMarker = true; break; }
            try {
              const parsed: unknown = JSON.parse(data);
              const delta = (parsed as { choices?: { delta?: { content?: unknown } }[] })?.choices?.[0]?.delta?.content;
              if (typeof delta === "string") {
                const bounded = delta.slice(0, MAX_STREAM_CHARS - emittedChars);
                if (bounded) controller.enqueue(encoder.encode(bounded));
                emittedChars += bounded.length;
                if (emittedChars >= MAX_STREAM_CHARS) { doneMarker = true; break; }
              }
            } catch { /* Ignore malformed SSE and keep-alives. */ }
          }
        }
      } catch {
        console.error("[chat] stream interrupted");
      } finally {
        await reader.cancel().catch(() => {});
        try { controller.close(); } catch { /* Client disconnected. */ }
      }
    },
    cancel() { void reader.cancel().catch(() => {}); },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
    },
  });
}
