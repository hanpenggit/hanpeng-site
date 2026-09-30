"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { MailIcon } from "@/components/ui/icons";
import { logEvent } from "@/lib/analytics";

// Copies the email to clipboard and shows a brief "copied" toast.
// Used in both the hero and contact sections; the toast is self-contained.
export function EmailButton({
  email,
  className,
  style,
  iconSize,
}: {
  email: string;
  className?: string;
  style?: CSSProperties;
  iconSize?: number;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function copy() {
    logEvent("email_clicked");
    navigator.clipboard?.writeText(email).catch(() => {});
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2200);
  }

  return (
    <>
      <button
        onClick={copy}
        aria-label="复制邮箱地址"
        className={className}
        style={{ background: "transparent", ...style }}
      >
        <MailIcon size={iconSize} />
      </button>
      {copied && (
        <div
          role="status"
          style={{
            position: "fixed",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 80,
            display: "inline-flex",
            alignItems: "center",
            gap: 9,
            padding: "10px 20px",
            borderRadius: 999,
            background: "var(--surface)",
            border: "1px solid var(--line)",
            boxShadow: "0 8px 32px rgba(0,0,0,.4)",
            fontFamily: "var(--font-mono)",
            fontSize: 12.5,
            color: "var(--text-hi)",
            animation: "ssRise .2s ease both",
          }}
        >
          <span style={{ color: "var(--pass)" }}>✓</span> 邮箱已复制到剪贴板
        </div>
      )}
    </>
  );
}
