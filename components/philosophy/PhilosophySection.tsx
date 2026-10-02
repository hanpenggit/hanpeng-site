import { profile } from "@/lib/profile";

// Engineering Philosophy — four short beliefs distilled from identity.about.
// Deliberately text-only: the restraint IS the design here.
export function PhilosophySection() {
  const items = profile.philosophy ?? [];
  if (items.length === 0) return null;

  return (
    <section
      id="philosophy"
      style={{ padding: "64px 0 8px", scrollMarginTop: 88 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 26,
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
          Engineering Philosophy
        </h2>
        <span style={{ flex: 1, height: 1, background: "var(--line)" }} />
      </div>

      <div className="philosophy-grid" style={{ display: "grid", gap: 14 }}>
        {items.map((p) => (
          <div
            key={p.num}
            style={{
              borderTop: "1px solid var(--line)",
              paddingTop: 16,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--brand-soft)",
                letterSpacing: ".08em",
                marginBottom: 8,
              }}
            >
              {p.num}
            </div>
            <h3
              style={{
                fontFamily: "var(--display)",
                fontWeight: 400,
                fontSize: 20,
                letterSpacing: "-.01em",
                marginBottom: 6,
              }}
            >
              {p.title}
            </h3>
            <p
              style={{
                fontSize: 13.5,
                lineHeight: 1.65,
                color: "var(--text-lo)",
              }}
            >
              {p.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
