import { profile } from "@/lib/profile";
import { ContactActions } from "./ContactActions";

export function ContactSection() {
  const { links } = profile.identity;
  return (
    <section id="contact" style={{ padding: "64px 0 80px", scrollMarginTop: 88 }}>
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
          联系方式
        </h2>
        <span style={{ flex: 1, height: 1, background: "var(--line)" }} />
      </div>

      <div
        style={{
          border: "1px solid var(--line)",
          borderRadius: 10,
          background: "var(--surface)",
          padding: "44px 40px",
          display: "flex",
          gap: 40,
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ flex: "1 1 360px" }}>
          <p
            style={{
              fontFamily: "var(--display)",
              fontWeight: 400,
              fontSize: "clamp(26px, 3.4vw, 36px)",
              lineHeight: 1.16,
              letterSpacing: "-.01em",
              maxWidth: "20ch",
            }}
          >
            想快速了解？{" "}
            <span style={{ color: "var(--pass)", fontStyle: "var(--accent-style)" }}>
              问问 AI 分身。
            </span>
            <br />
            想直接聊？{" "}
            <span style={{ color: "var(--brand-soft)", fontStyle: "var(--accent-style)" }}>
              发邮件。
            </span>
          </p>
        </div>
        <ContactActions links={links} />
      </div>
    </section>
  );
}
