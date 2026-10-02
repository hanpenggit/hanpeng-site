import { profile } from "@/lib/profile";
import { ContactActions } from "./ContactActions";

export function ContactSection() {
  const { links } = profile.identity;
  // Same semantics as ChatProvider (enabled !== false): a missing field means
  // enabled, so the two can never disagree about whether the bot exists.
  const botEnabled = profile.chatbot.enabled !== false;
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

      <div className="contact-card">
        {/* flex basis lives in CSS: inline `flex: 1 1 360px` would become a
            360px HEIGHT once .contact-card turns into a column on mobile */}
        <div className="contact-pitch-wrap">
          <p className="contact-pitch">
            想快速了解？{" "}
            <span style={{ color: "var(--pass)", fontStyle: "var(--accent-style)", whiteSpace: "nowrap" }}>
              问问 AI 分身。
            </span>
            <br />
            想直接聊？{" "}
            <span style={{ color: "var(--brand-soft)", fontStyle: "var(--accent-style)", whiteSpace: "nowrap" }}>
              发邮件。
            </span>
          </p>
          {botEnabled && (
            <p
              className="contact-hint"
              style={{
                fontSize: 13,
                lineHeight: 1.6,
                color: "var(--text-lo)",
                margin: "12px 0 0",
              }}
            >
              AI 分身由大模型与我的真实项目资料驱动，欢迎抛硬核技术问题。
            </p>
          )}
        </div>
        <ContactActions links={links} />
      </div>
    </section>
  );
}
