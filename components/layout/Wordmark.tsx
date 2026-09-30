"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// The nav wordmark morphs from the playful "heyo whatsup 👋" into "韩鹏"
// once the hero name has scrolled completely past the sticky nav, and morphs
// back on the way up. Driven by an IntersectionObserver on the hero <h1>.
// Off the landing page there is no hero, so it just settles on the name.
export function Wordmark() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [scrolled, setScrolled] = useState(!onHome);

  useEffect(() => {
    const target = document.getElementById("hero-name");
    if (!target || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      // top inset by the 64px sticky nav: fires once the name is fully above it
      { rootMargin: "-64px 0px 0px 0px", threshold: 0 },
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  const base: React.CSSProperties = {
    gridArea: "1 / 1",
    fontFamily: "var(--display)",
    fontStyle: "var(--accent-style)",
    fontWeight: 400,
    fontSize: 22,
    letterSpacing: "-.01em",
    color: "var(--text-hi)",
    whiteSpace: "nowrap",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    transition:
      "opacity .4s ease, transform .45s cubic-bezier(.4,0,.2,1), filter .4s ease",
  };

  return (
    <a
      href={onHome ? "#top" : "/"}
      aria-label={onHome ? "韩鹏 — 回到顶部" : "韩鹏 — 返回首页"}
      style={{ textDecoration: "none", color: "var(--text-hi)" }}
    >
      <span style={{ display: "inline-grid", alignItems: "center" }}>
        <span
          aria-hidden="true"
          style={{
            ...base,
            opacity: scrolled ? 0 : 1,
            transform: scrolled ? "translateY(-8px)" : "translateY(0)",
            filter: scrolled ? "blur(4px)" : "blur(0)",
            pointerEvents: scrolled ? "none" : "auto",
          }}
        >
          你好呀{" "}
          <span style={{ fontSize: 18, lineHeight: 1 }}>👋</span>
        </span>
        <span
          aria-hidden="true"
          style={{
            ...base,
            opacity: scrolled ? 1 : 0,
            transform: scrolled ? "translateY(0)" : "translateY(8px)",
            filter: scrolled ? "blur(0)" : "blur(4px)",
            pointerEvents: scrolled ? "auto" : "none",
          }}
        >
          han peng
        </span>
      </span>
    </a>
  );
}
