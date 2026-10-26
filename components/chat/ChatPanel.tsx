"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { Chatbot } from "@/lib/types";
import { logEvent } from "@/lib/analytics";
import { Avatar } from "./Avatar";
import { TurnstileChallenge } from "./TurnstileChallenge";

type Msg = { role: "user" | "assistant"; text: string; done: boolean };

const MAX_INPUT = 280;
// Public identifier only; secret verification stays in the Cloudflare Worker.
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";

// Render message text with any URLs turned into clickable links. The Google
// Calendar booking link and LinkedIn get friendly labels instead of raw URLs.
function renderRich(text: string): ReactNode[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const out: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;
  while ((match = urlRegex.exec(text)) !== null) {
    if (match.index > lastIndex) out.push(text.slice(lastIndex, match.index));
    let url = match[0];
    let trailing = "";
    const punct = url.match(/[.,;:!?)\]]+$/);
    if (punct) {
      trailing = punct[0];
      url = url.slice(0, -trailing.length);
    }
    const label = url.includes("calendar.app.google")
      ? "谷歌日历预约"
      : url.includes("linkedin.com")
        ? "LinkedIn"
        : url.replace(/^https?:\/\//, "");
    out.push(
      <a
        key={`lnk-${key++}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "var(--brand-soft)",
          textDecoration: "underline",
          wordBreak: "break-word",
        }}
      >
        {label}
      </a>,
    );
    if (trailing) out.push(trailing);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) out.push(text.slice(lastIndex));
  return out;
}

export function ChatPanel({
  chatbot,
  onClose,
}: {
  chatbot: Chatbot;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", text: chatbot.greeting, done: true },
  ]);
  const [draft, setDraft] = useState("");
  const [asked, setAsked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [challengeToken, setChallengeToken] = useState<string | null>(null);
  const [challengeRevision, setChallengeRevision] = useState(0);
  const [challengeError, setChallengeError] = useState(false);
  const handleChallenge = useCallback((token: string | null) => {
    setChallengeToken(token);
    if (token) setChallengeError(false);
  }, []);
  const handleChallengeError = useCallback(() => setChallengeError(true), []);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function send(raw?: string) {
    const q = (raw ?? draft).trim();
    if (!q || busy || !challengeToken) return;
    const onceToken = challengeToken;
    setChallengeToken(null);
    setChallengeRevision((n) => n + 1);
    logEvent("chat_message_sent");

    const history = messages.concat([{ role: "user", text: q, done: true }]);
    setMessages(history.concat([{ role: "assistant", text: "", done: false }]));
    setDraft("");
    setAsked(true);
    setBusy(true);

    const appendToLast = (chunk: string) =>
      setMessages((prev) => {
        const next = prev.slice();
        const last = { ...next[next.length - 1] };
        last.text += chunk;
        next[next.length - 1] = last;
        return next;
      });
    const finishLast = (replaceWith?: string) =>
      setMessages((prev) => {
        const next = prev.slice();
        const last = { ...next[next.length - 1] };
        if (replaceWith !== undefined) last.text = replaceWith;
        last.done = true;
        next[next.length - 1] = last;
        return next;
      });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          // Keep both the turn count and total text under server-side limits.
          messages: history.slice(-6).map((m) => ({ role: m.role, content: m.text.slice(-480) })),
          turnstileToken: onceToken,
        }),
      });

      if (res.status === 429) {
        finishLast(
          "暂时达到消息上限了——可以直接给hanpeng发邮件：hanpeng.jack@qq.com",
        );
        return;
      }
      if (res.status === 403) {
        finishLast("人机验证未通过，请完成新的验证后再试。");
        return;
      }
      if (!res.ok || !res.body) {
        finishLast(chatbot.escalationNote);
        return;
      }

      // Stream tokens in as they arrive (Workers supports streamed responses).
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let got = false;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (chunk) {
          got = true;
          appendToLast(chunk);
        }
      }
      finishLast(got ? undefined : chatbot.escalationNote);
    } catch {
      finishLast(chatbot.escalationNote);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-label={chatbot.displayName}
      style={{
        position: "fixed",
        right: 24,
        bottom: 24,
        zIndex: 71,
        width: "min(390px, calc(100vw - 32px))",
        height: "min(580px, calc(100vh - 48px))",
        display: "flex",
        flexDirection: "column",
        border: "1px solid var(--line)",
        borderRadius: 16,
        background: "var(--bg)",
        boxShadow: "0 24px 70px rgba(0,0,0,.55)",
        overflow: "hidden",
        animation: "ssChat .22s ease both",
      }}
    >
      {/* header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 11,
          padding: "14px 16px",
          borderBottom: "1px solid var(--line)",
          background: "var(--surface)",
        }}
      >
        <Avatar size={36} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-hi)" }}>
            {chatbot.displayName}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "var(--font-mono)",
              fontSize: 10.5,
              color: "var(--text-lo)",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--pass)",
                animation: "ssPulse 2.4s ease-in-out infinite",
              }}
            />
            {chatbot.subtitle}
          </div>
        </div>
        <button
          onClick={onClose}
          className="h-close"
          aria-label="关闭聊天"
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            border: "1px solid var(--line)",
            background: "var(--bg)",
            color: "var(--text-lo)",
            fontSize: 15,
            transition: "color .15s",
          }}
        >
          ✕
        </button>
      </div>

      {/* messages */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "18px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {messages.map((m, i) =>
          m.role === "assistant" ? (
            <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
              <Avatar size={28} done={m.done} />
              <div
                style={{
                  maxWidth: "80%",
                  padding: "11px 13px",
                  borderRadius: "4px 13px 13px 13px",
                  background: "var(--surface)",
                  border: "1px solid var(--line)",
                  fontSize: 13.5,
                  lineHeight: 1.55,
                  color: "var(--text-hi)",
                  whiteSpace: "pre-wrap",
                }}
              >
                {renderRich(m.text)}
                {!m.done && (
                  <span
                    style={{
                      display: "inline-block",
                      width: 6,
                      height: 13,
                      background: "var(--brand-soft)",
                      marginLeft: 2,
                      verticalAlign: "middle",
                      animation: "ssBlink 1s step-end infinite",
                    }}
                  />
                )}
              </div>
            </div>
          ) : (
            <div
              key={i}
              style={{
                alignSelf: "flex-end",
                maxWidth: "82%",
                padding: "11px 13px",
                borderRadius: "13px 13px 4px 13px",
                background: "var(--brand)",
                color: "#fff",
                fontSize: 13.5,
                lineHeight: 1.5,
                whiteSpace: "pre-wrap",
              }}
            >
              {m.text}
            </div>
          ),
        )}
      </div>

      {/* suggestions */}
      {!asked && (
        <div
          style={{
            padding: "0 16px 12px",
            display: "flex",
            flexWrap: "wrap",
            gap: 7,
          }}
        >
          {chatbot.suggestedQuestions.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              disabled={busy || !challengeToken}
              className="h-suggestion"
              style={{
                padding: "7px 12px",
                borderRadius: 999,
                border: "1px solid var(--line)",
                background: "var(--surface)",
                color: "var(--text-hi)",
                fontSize: 12,
                textAlign: "left",
                transition: "border-color .15s, background .15s",
              }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Verify every request; tokens expire in five minutes and are single-use. */}
      <div style={{ padding: "8px 14px", borderTop: "1px solid var(--line)", fontSize: 11.5, color: "var(--text-lo)" }}>
        {TURNSTILE_SITE_KEY ? (
          <>
            <TurnstileChallenge
              siteKey={TURNSTILE_SITE_KEY}
              revision={challengeRevision}
              onToken={handleChallenge}
              onError={handleChallengeError}
            />
            <span role="status">
              {challengeError ? "验证组件加载失败，请刷新页面后再试。" : challengeToken ? "安全验证已通过，可以发送消息。" : "正在进行 Cloudflare 安全验证…"}
            </span>
          </>
        ) : (
          <span role="status">AI 助手尚未配置安全验证，请通过邮箱联系。</span>
        )}
      </div>

      {/* input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        style={{
          display: "flex",
          gap: 9,
          padding: "13px 14px",
          borderTop: "1px solid var(--line)",
          background: "var(--surface)",
        }}
      >
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="问问 hanpeng 的工作…"
          disabled={busy || !challengeToken}
          maxLength={MAX_INPUT}
          aria-label="问问关于 hanpeng 的工作"
          className="chat-input"
          style={{
            flex: 1,
            height: 40,
            padding: "0 14px",
            borderRadius: 999,
            border: "1px solid var(--line)",
            background: "var(--bg)",
            color: "var(--text-hi)",
            fontSize: 13.5,
            fontFamily: "var(--font-sans)",
            outline: "none",
          }}
        />
        <button
          type="submit"
          aria-label="发送"
          disabled={busy || !challengeToken}
          className="h-send"
          style={{
            flex: "0 0 auto",
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "none",
            background: "var(--brand)",
            color: "#fff",
            fontSize: 15,
            cursor: busy || !challengeToken ? "default" : "pointer",
            opacity: busy || !challengeToken ? 0.5 : 1,
            transition: "background .15s",
          }}
        >
          ↑
        </button>
      </form>
    </div>
  );
}
