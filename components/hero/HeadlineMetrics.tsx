"use client";

import { useEffect, useRef, useState } from "react";
import type { HeadlineMetric } from "@/lib/types";

export function HeadlineMetrics({ metrics }: { metrics: HeadlineMetric[] }) {
  const [counts, setCounts] = useState<number[]>(() => metrics.map(() => 0));
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const targets = metrics.map((m) => m.value);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      setCounts(targets);
      return;
    }

    let raf = 0;
    const run = () => {
      if (started.current) return;
      started.current = true;
      const dur = 1100;
      const t0 = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - t0) / dur);
        const e = 1 - Math.pow(1 - t, 3);
        setCounts(targets.map((v) => v * e));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      run();
      return () => cancelAnimationFrame(raf);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((en) => en.isIntersecting)) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [metrics]);

  return (
    <div style={{ marginTop: 54, borderTop: "1px solid var(--line)" }}>
      <div ref={ref} className="metrics-grid" style={{ display: "grid", gap: 0 }}>
        {metrics.map((m, i) => {
          const color = m.tone === "pass" ? "var(--pass)" : "var(--brand-soft)";
          const showDivider = (i + 1) % 3 !== 0;
          return (
            <div
              key={m.label}
              style={{
                padding: "24px 22px",
                borderBottom: "1px solid var(--line)",
                position: "relative",
              }}
            >
              {showDivider && (
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "20%",
                    bottom: "20%",
                    width: 1,
                    background: "var(--line)",
                  }}
                />
              )}
              <div
                style={{
                  fontFamily: "var(--font-grotesk)",
                  fontWeight: 600,
                  fontSize: 38,
                  letterSpacing: "-.02em",
                  lineHeight: 1,
                  color,
                  marginBottom: 9,
                }}
              >
                {m.lead}
                {Math.round(counts[i] ?? 0)}
                {m.suffix}
              </div>
              <div
                style={{ fontSize: 13, color: "var(--text-hi)", marginBottom: 3 }}
              >
                {m.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--text-lo)",
                }}
              >
                {m.detail}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
