import { profile } from "@/lib/profile";

// "What I Build" — three lanes (Products / AI Systems / Infrastructure) that
// answer "what do you build" instead of "what tools do you know". Replaces the
// resume-flavoured 核心能力 section; hidden when profile.json has no build data.
export function BuildSection() {
  const build = profile.build;
  if (!build || build.groups.length === 0) return null;

  return (
    <section id="build" style={{ padding: "56px 0 8px", scrollMarginTop: 88 }}>
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
          {build.title}
        </h2>
        {build.titleEn && (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11.5,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "var(--text-lo)",
              whiteSpace: "nowrap",
            }}
          >
            {build.titleEn}
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
          marginBottom: 26,
        }}
      >
        {build.description}
      </p>

      <div className="capability-grid" style={{ display: "grid", gap: 16 }}>
        {build.groups.map((g) => (
          <div
            key={g.num}
            className="h-card"
            style={{
              border: "1px solid var(--line)",
              borderRadius: 8,
              background: "var(--surface)",
              padding: "20px 22px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  color: "var(--brand-soft)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  letterSpacing: ".08em",
                }}
              >
                {g.num}
              </span>
              <h3
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: ".06em",
                  textTransform: "uppercase",
                }}
              >
                {g.title}
              </h3>
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: "var(--text-hi)",
                marginBottom: 8,
              }}
            >
              {g.headline}
            </div>
            <p
              style={{
                fontSize: 13.5,
                lineHeight: 1.65,
                color: "var(--text-lo)",
              }}
            >
              {g.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
