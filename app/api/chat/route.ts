import { buildSystemPrompt } from "@/lib/system-prompt";
import { retrieveContext } from "@/lib/retrieval";
import { profile } from "@/lib/profile";
import { limit } from "@/lib/ratelimit";

// Edge runtime streams token-by-token reliably (unlike the Node serverless
// runtime, which buffered the stream and timed out).
export const runtime = "edge";
export const maxDuration = 30;

const MAX_CHARS = 1000; // per user message
const MAX_MESSAGES = 20; // per conversation
// .trim() guards against keys/slugs pasted with a stray space or newline.
const MODEL = (process.env.OPENROUTER_MODEL ?? "anthropic/claude-3.5-haiku").trim();

type ClientMessage = { role: "user" | "assistant"; content: string };

const encoder = new TextEncoder();

function text(message: string, status = 200): Response {
  return new Response(message, {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(req: Request) {
  // 1) rate limit by IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "anon";
  const { success } = await limit(ip);
  if (!success) {
    return text(
      "You've hit the message limit for now — reach 韩鹏 on LinkedIn or book a call.",
      429,
    );
  }

  // 2) parse + validate
  let messages: ClientMessage[];
  try {
    const body = await req.json();
    messages = body?.messages;
  } catch {
    return text("Invalid request.", 400);
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return text("Invalid request.", 400);
  }
  const trimmed = messages.slice(-MAX_MESSAGES).filter(
    (m): m is ClientMessage =>
      !!m &&
      (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string",
  );
  const lastMsg = trimmed.at(-1);
  if (!lastMsg || lastMsg.role !== "user") {
    return text("Invalid request.", 400);
  }
  if (lastMsg.content.length > MAX_CHARS) {
    return text("Message too long.", 400);
  }

  // 3) no key configured → graceful escalation (keeps local dev + previews alive)
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) {
    return text(
      `The live assistant isn't configured in this environment yet. ${profile.chatbot.escalationNote}`,
    );
  }

  // 4) retrieve relevant passages from 韩鹏's writing (no-op if unconfigured)
  const context = await retrieveContext(lastMsg.content);

  // 5) stream from OpenRouter (OpenAI-compatible)
  let upstream: Response;
  try {
    upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": profile.identity.links.website,
        // Header values must be Latin-1 (ASCII) — a non-ASCII char (e.g. an
        // em-dash) makes fetch throw before the request is even sent.
        "X-Title": "问问 韩鹏 - hanpeng.xyz",
      },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        temperature: 0.6,
        max_tokens: 500,
        messages: [
          { role: "system", content: buildSystemPrompt(context) },
          ...trimmed.map((m) => ({ role: m.role, content: m.content })),
        ],
      }),
    });
  } catch (err) {
    console.error("[chat] OpenRouter request threw:", err);
    return text(
      `Sorry — the assistant is unreachable right now. ${profile.chatbot.escalationNote}`,
    );
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    console.error(
      `[chat] OpenRouter responded ${upstream.status} for model "${MODEL}":`,
      detail.slice(0, 500),
    );
    return text(
      `Sorry — the assistant hit an error. ${profile.chatbot.escalationNote}`,
    );
  }

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            const t = line.trim();
            if (!t.startsWith("data:")) continue;
            const data = t.slice(5).trim();
            if (data === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const json = JSON.parse(data);
              const delta = json?.choices?.[0]?.delta?.content;
              if (typeof delta === "string" && delta.length) {
                controller.enqueue(encoder.encode(delta));
              }
            } catch {
              // ignore keep-alive / partial frames
            }
          }
        }
      } catch (err) {
        console.error("[chat] stream error:", err);
      } finally {
        controller.close();
      }
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
