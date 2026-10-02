import { profile } from "@/lib/profile";

// AI Lab — a light experiment list, not another wall of cards: one row per
// direction (name → description → tech), separated by hairlines. Answers
// "我正在研究什么？" while Selected Work answers "我做了什么？".
export function AiLabSection() {
  const lab = profile.aiLab;
  if (!lab || lab.experiments.length === 0) return null;

  return (
    <section id="ai-lab" style={{ padding: "64px 0 8px", scrollMarginTop: 88 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 10,
        }}
      >
        <h2
          style={{
            fontFamily: "var(--display)",
            fontWeight: 400,
            fontSize: 34,
            letterSpacing: "-.01em",
          }}
        >
          {lab.title}
        </h2>
        {lab.tagline && (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: ".08em",
              color: "var(--brand-soft)",
              whiteSpace: "nowrap",
            }}
          >
            {lab.tagline}
          </span>
        )}
        <span style={{ flex: 1, height: 1, background: "var(--line)" }} />
      </div>
      <p
        style={{
          fontSize: 14,
          lineHeight: 1.7,
          color: "var(--text-lo)",
          maxWidth: "56ch",
          marginBottom: 22,
        }}
      >
        {lab.description}
      </p>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {lab.experiments.map((exp, i) => (
          <div
            key={exp.title}
            className="ai-row"
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 24,
              padding: "17px 0",
              borderTop: i === 0 ? "1px solid var(--line)" : "none",
              borderBottom: "1px solid var(--line)",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13.5,
                fontWeight: 600,
                letterSpacing: ".05em",
                color: "var(--text-hi)",
                minWidth: 150,
              }}
            >
              {exp.title}
            </div>
            <p
              style={{
                flex: "1 1 300px",
                minWidth: 0,
                fontSize: 13,
                lineHeight: 1.65,
                color: "var(--text-lo)",
                margin: 0,
              }}
            >
              {exp.description}
            </p>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--brand-soft)",
                whiteSpace: "nowrap",
              }}
            >
              {exp.tags.join(" · ")}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
