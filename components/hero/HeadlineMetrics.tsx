import type { HeadlineMetric } from "@/lib/types";

// Important data stays in server-rendered HTML: no hydration, timer, observer,
// layout shift or reduced-motion special case just to show three numbers.
export function HeadlineMetrics({ metrics }: { metrics: HeadlineMetric[] }) {
  return (
    <div className="hero-metrics">
      <div className="metrics-grid" style={{ display: "grid", gap: 0 }}>
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
                {m.value > 0 && m.value}
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
