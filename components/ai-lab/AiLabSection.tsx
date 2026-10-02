import { profile } from "@/lib/profile";

// AI Lab — shows the AI direction as concrete experiments instead of a pile of
// tool names. Hidden entirely when profile.json has no aiLab data.
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
        <span style={{ flex: 1, height: 1, background: "var(--line)" }} />
      </div>
      <p
        style={{
          fontSize: 14,
          lineHeight: 1.7,
          color: "var(--text-lo)",
          maxWidth: "56ch",
          marginBottom: 26,
        }}
      >
        {lab.description}
      </p>

      <div className="ai-grid" style={{ display: "grid", gap: 14 }}>
        {lab.experiments.map((exp) => (
          <div
            key={exp.title}
            className="h-card"
            style={{
              border: "1px solid var(--line)",
              borderRadius: 8,
              background: "var(--surface)",
              padding: "18px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13.5,
                fontWeight: 600,
                letterSpacing: ".05em",
                color: "var(--text-hi)",
              }}
            >
              {exp.title}
            </h3>
            <p
              style={{
                fontSize: 13,
                lineHeight: 1.65,
                color: "var(--text-lo)",
              }}
            >
              {exp.description}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: "auto" }}>
              {exp.tags.map((t) => (
                <span
                  key={t}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10.5,
                    color: "var(--text-lo)",
                    padding: "3px 8px",
                    border: "1px solid var(--line)",
                    borderRadius: 5,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
