import { profile } from "@/lib/profile";

// 核心能力 — three cards that answer "how do you solve hard problems"
// instead of listing tools. Rendered right after the hero; hidden entirely
// when profile.json has no capabilities array.
export function CapabilitiesSection() {
  const capabilities = profile.capabilities ?? [];
  if (capabilities.length === 0) return null;

  return (
    <section
      id="capabilities"
      style={{ padding: "56px 0 8px", scrollMarginTop: 88 }}
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
          核心能力
        </h2>
        <span style={{ flex: 1, height: 1, background: "var(--line)" }} />
      </div>

      <div
        className="capability-grid"
        style={{ display: "grid", gap: 16 }}
      >
        {capabilities.map((c) => (
          <div
            key={c.title}
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
                gap: 9,
                marginBottom: 9,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  color: "var(--brand-soft)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                }}
              >
                ▸
              </span>
              <h3
                style={{
                  fontSize: 15.5,
                  fontWeight: 600,
                  lineHeight: 1.3,
                }}
              >
                {c.title}
              </h3>
            </div>
            <p
              style={{
                fontSize: 13.5,
                lineHeight: 1.65,
                color: "var(--text-lo)",
              }}
            >
              {c.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
