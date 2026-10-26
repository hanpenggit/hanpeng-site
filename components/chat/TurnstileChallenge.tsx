"use client";

import { useEffect, useRef } from "react";

type TurnstileApi = {
  render: (element: HTMLElement, options: {
    sitekey: string;
    action: string;
    theme: "auto";
    size: "flexible";
    callback: (token: string) => void;
    "expired-callback": () => void;
    "error-callback": () => void;
  }) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window { turnstile?: TurnstileApi }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export function TurnstileChallenge({
  siteKey,
  revision,
  onToken,
  onError,
}: {
  siteKey: string;
  revision: number;
  onToken: (token: string | null) => void;
  onError: () => void;
}) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    let widgetId: string | undefined;
    let script: HTMLScriptElement | null = null;

    function renderWidget() {
      if (!mounted || !container.current || !window.turnstile || widgetId) return;
      try {
        widgetId = window.turnstile.render(container.current, {
          sitekey: siteKey,
          action: "portfolio_chat",
          theme: "auto",
          size: "flexible",
          callback: (token) => { if (mounted) onToken(token); },
          "expired-callback": () => { if (mounted) onToken(null); },
          "error-callback": () => { if (mounted) { onToken(null); onError(); } },
        });
      } catch {
        if (mounted) onError();
      }
    }

    if (window.turnstile) {
      renderWidget();
    } else {
      script = document.querySelector<HTMLScriptElement>('script[data-chat-turnstile="true"]');
      if (!script) {
        script = document.createElement("script");
        script.src = SCRIPT_SRC;
        script.async = true;
        script.dataset.chatTurnstile = "true";
        document.head.appendChild(script);
      }
      script.addEventListener("load", renderWidget);
      script.addEventListener("error", onError);
    }

    return () => {
      mounted = false;
      script?.removeEventListener("load", renderWidget);
      script?.removeEventListener("error", onError);
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [siteKey, revision, onToken, onError]);

  return <div ref={container} aria-label="Cloudflare Turnstile 人机验证" style={{ width: "100%", minHeight: 48 }} />;
}
