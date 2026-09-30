"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "@/components/ui/icons";
import { logEvent } from "@/lib/analytics";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = !mounted || resolvedTheme !== "light";
  const next = isDark ? "light" : "dark";
  const label = isDark ? "day" : "night";

  function toggle(e: React.MouseEvent<HTMLButtonElement>) {
    logEvent("theme_toggled", { to: next });

    const flip = () => setTheme(next);
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce || !(document as Document).startViewTransition) {
      flip();
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const r = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );
    const transition = document.startViewTransition(flip);
    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${r}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 560,
          easing: "cubic-bezier(.4,0,.2,1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  }

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      className="h-pillbtn"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        height: 34,
        padding: "0 12px",
        border: "1px solid var(--line)",
        borderRadius: 999,
        background: "var(--surface)",
        color: "var(--text-lo)",
        fontFamily: "var(--font-mono)",
        fontSize: 11.5,
        transition: "border-color .15s, color .15s",
      }}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
      {label}
    </button>
  );
}
