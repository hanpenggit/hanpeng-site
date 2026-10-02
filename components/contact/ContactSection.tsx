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
          Contact
        </span>
        <span style={{ flex: 1, height: 1, background: "var(--line)" }} />
      </div>

      <div className="contact-card">
        {/* flex basis lives in CSS: inline `flex: 1 1 360px` would become a
            360px HEIGHT once .contact-card turns into a column on mobile */}
        <div className="contact-pitch-wrap">
          <p className="contact-pitch">
            想合作或聊聊项目？{" "}
            <span style={{ color: "var(--brand-soft)", fontStyle: "var(--accent-style)", whiteSpace: "nowrap" }}>
              发邮件。
            </span>
            <br />
            一般会在一天内回复。
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
              想快速了解？也可以问问右下角的 AI 分身——由大模型与我的真实项目资料驱动。
            </p>
          )}
        </div>
        <ContactActions links={links} />
      </div>
    </section>
  );
}
