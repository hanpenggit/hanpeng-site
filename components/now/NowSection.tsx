import { profile } from "@/lib/profile";

// Now — what hanpeng is building / exploring / running right now. The point of
// this section is freshness: update profile.json → now and the page follows.
const STATUS_COLOR: Record<string, string> = {
  BUILDING: "var(--pass)",
  EXPLORING: "var(--brand-soft)",
  RUNNING: "var(--text-lo)",
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// "2026-10" → "October 2026" — a light timestamp that ages visibly.
function formatUpdated(updated: string): string {
  const [y, m] = updated.split("-");
  const idx = Number(m) - 1;
  return idx >= 0 && idx < 12 ? `${MONTHS[idx]} ${y}` : updated;
}

export function NowSection() {
  const now = profile.now;
  if (!now || now.items.length === 0) return null;

  return (
    <section id="now" style={{ padding: "64px 0 8px", scrollMarginTop: 88 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 22,
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
          近况
        </h2>
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
          Now
        </span>
        <span style={{ flex: 1, height: 1, background: "var(--line)" }} />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11.5,
            color: "var(--text-lo)",
            whiteSpace: "nowrap",
          }}
        >
          {formatUpdated(now.updated)}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {now.items.map((item, i) => (
          <div
            key={item.title}
            style={{
              display: "flex",
              gap: 18,
              alignItems: "baseline",
              padding: "16px 0",
              borderTop: i === 0 ? "1px solid var(--line)" : "none",
              borderBottom: "1px solid var(--line)",
              flexWrap: "wrap",
            }}
          >
            <span
              className="now-status"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: ".1em",
                color: STATUS_COLOR[item.status] ?? "var(--text-lo)",
                minWidth: 130,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: STATUS_COLOR[item.status] ?? "var(--text-lo)",
                }}
              />
              {item.status}
            </span>
            <div style={{ flex: "1 1 300px", minWidth: 0 }}>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: "var(--text-hi)",
                  marginBottom: 4,
                }}
              >
                {item.title}
              </div>
              <div
                style={{
                  fontSize: 13.5,
                  lineHeight: 1.6,
                  color: "var(--text-lo)",
                }}
              >
                {item.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
