"use client";

import { Avatar } from "./Avatar";

export function ChatLauncher({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="h-launcher"
      aria-label="打开 问问 韩鹏 聊天"
      style={{
        position: "fixed",
        right: 24,
        bottom: 24,
        zIndex: 70,
        display: "inline-flex",
        alignItems: "center",
        gap: 11,
        padding: "12px 16px 12px 13px",
        borderRadius: 14,
        background: "var(--surface)",
        border: "1px solid var(--line)",
        boxShadow: "0 14px 40px rgba(0,0,0,.4)",
        transition: "transform .15s, border-color .15s",
      }}
    >
      <Avatar size={38} />
      <span style={{ textAlign: "left" }}>
        <span
          style={{
            display: "block",
            fontSize: 13,
            fontWeight: 600,
            color: "var(--text-hi)",
          }}
        >
          问问 韩鹏
        </span>
        <span
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
            }}
          />
          在线 · AI 分身
        </span>
      </span>
    </button>
  );
}
