import { profile } from "@/lib/profile";

// identity.about and identity.openTo were written into profile.json but never
// surfaced anywhere on the page — only the chatbot could see them. This section
// puts the long-form bio and the "what I'm open to" list on screen.
export function AboutSection() {
  const { about, summary, openTo } = profile.identity;
  const body = about || summary;

  return (
    <section id="about" style={{ padding: "56px 0 8px", scrollMarginTop: 88 }}>
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
          关于
        </h2>
        <span style={{ flex: 1, height: 1, background: "var(--line)" }} />
      </div>

      <div
        className="about-grid"
        style={{ display: "flex", gap: 48, flexWrap: "wrap", alignItems: "flex-start" }}
      >
        {body && (
          <p
            style={{
              flex: "1 1 460px",
              minWidth: 280,
              fontSize: 15,
              lineHeight: 1.75,
              color: "var(--text-lo)",
              maxWidth: "62ch",
            }}
          >
            {body}
          </p>
        )}

        {openTo.length > 0 && (
          <div style={{ flex: "0 0 auto", minWidth: 240 }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11.5,
                letterSpacing: ".14em",
                textTransform: "uppercase",
                color: "var(--text-lo)",
                marginBottom: 14,
              }}
            >
              开放的机会
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {openTo.map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "baseline",
                    fontSize: 13.5,
                    color: "var(--text-hi)",
                  }}
                >
                  <span style={{ color: "var(--pass)", fontFamily: "var(--font-mono)" }}>
                    →
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
