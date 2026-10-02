import { profile, skillGroups } from "@/lib/profile";

const sectionLabel: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11.5,
  letterSpacing: ".14em",
  textTransform: "uppercase",
  color: "var(--text-lo)",
  marginBottom: 18,
};

export function StackSection() {
  return (
    <section id="stack" style={{ padding: "64px 0 24px", scrollMarginTop: 88 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 34,
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
          技术栈
        </h2>
        <span style={{ flex: 1, height: 1, background: "var(--line)" }} />
      </div>

      <div>
        {skillGroups.map((g) => (
          <div
            key={g.name}
            className="skill-row"
            style={{
              display: "grid",
              gap: 24,
              padding: "18px 0",
              borderTop: "1px solid var(--line)",
              alignItems: "start",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "var(--text-lo)",
                letterSpacing: ".04em",
                paddingTop: 3,
              }}
            >
              {g.name}
            </div>
            {/* chips + 注脚 share one grid cell, so the note sits under the
                tags instead of leaking into the label column */}
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {g.items.map((s) => (
                  <span
                    key={s}
                    className="h-chip"
                    style={{
                      fontSize: 13,
                      color: "var(--text-hi)",
                      padding: "5px 12px",
                      border: "1px solid var(--line)",
                      borderRadius: 6,
                      background: "var(--surface)",
                      transition: "border-color .15s",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
              {/* 实战注脚 — turns the tag row into "what I solved with these". */}
              {profile.skillNotes?.[g.name] && (
                <p
                  className="skill-note"
                  style={{
                    fontSize: 12.5,
                    lineHeight: 1.6,
                    color: "var(--text-lo)",
                    margin: "10px 0 0",
                    maxWidth: "70ch",
                  }}
                >
                  {profile.skillNotes[g.name]}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div
        className="stack-bottom"
        style={{
          display: "grid",
          gap: 40,
          marginTop: 46,
          alignItems: "start",
        }}
      >
        <div>
          <div style={sectionLabel}>擅长领域</div>
          <div
            className="areas-grid"
            style={{ display: "grid", gap: "11px 18px" }}
          >
            {profile.areasOfExpertise.map((a) => (
              <div
                key={a}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "baseline",
                  fontSize: 13.5,
                  color: "var(--text-hi)",
                }}
              >
                <span
                  style={{
                    color: "var(--brand-soft)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                  }}
                >
                  ▸
                </span>
                {a}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={sectionLabel}>证书资质</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {profile.certifications.length === 0 && (
              <div style={{ fontSize: 13, color: "var(--text-lo)" }}>暂无</div>
            )}
            {profile.certifications.map((c) => (
              <div
                key={c}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "baseline",
                  fontSize: 13.5,
                  color: "var(--text-hi)",
                }}
              >
                <span
                  style={{ color: "var(--pass)", fontFamily: "var(--font-mono)" }}
                >
                  ✓
                </span>
                {c}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
