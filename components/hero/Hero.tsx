import Image from "next/image";
import { profile } from "@/lib/profile";
import { HeroActions } from "./HeroActions";
import { HeadlineMetrics } from "./HeadlineMetrics";
import { NavigationIcon } from "@/components/ui/icons";

const bracket: React.CSSProperties = {
  position: "absolute",
  width: 22,
  height: 22,
};

export function Hero() {
  const { identity } = profile;
  return (
    <section style={{ padding: "60px 0 30px", scrollMarginTop: 88 }}>
      <div
        className="hero-grid"
        style={{
          display: "flex",
          gap: 56,
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {/* minWidth: 0 — a 300px floor here overflowed 320px screens (the old
            `minWidth: 300` + page padding = 332px > 320px viewport). */}
        <div style={{ flex: "1 1 480px", minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 22,
            }}
          >
            <span style={{ width: 26, height: 1, background: "var(--pass)" }} />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                letterSpacing: ".16em",
                textTransform: "uppercase",
                color: "var(--pass)",
              }}
            >
              {identity.title}
            </span>
          </div>
          {identity.roleLine && (
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                letterSpacing: ".12em",
                textTransform: "uppercase",
                color: "var(--text-lo)",
                marginBottom: 18,
                marginTop: -12,
                paddingLeft: 40,
              }}
            >
              {identity.roleLine}
            </div>
          )}

          <h1
            id="hero-name"
            style={{
              fontFamily: "var(--display)",
              fontWeight: 400,
              fontSize: "clamp(56px, 8vw, 88px)",
              lineHeight: 0.98,
              letterSpacing: "-.02em",
              marginBottom: 18,
            }}
          >
            {identity.name}
            <span
              aria-hidden="true"
              style={{
                color: "var(--pass)",
                animation: "ssBlink 1.1s steps(1) infinite",
              }}
            >
              ▍
            </span>
          </h1>

          <p
            style={{
              fontFamily: "var(--display)",
              fontWeight: 400,
              fontSize: "clamp(28px, 3.6vw, 38px)",
              lineHeight: 1.18,
              letterSpacing: "-.01em",
              marginBottom: 14,
              maxWidth: "18ch",
            }}
          >
            {identity.taglineLead}
            <br />
            <span
              style={{
                color: "var(--pass)",
                fontStyle: "var(--accent-style)",
                whiteSpace: "nowrap",
              }}
            >
              {identity.taglineAccent}
            </span>
          </p>

          <p
            style={{
              fontSize: 16,
              lineHeight: 1.6,
              color: "var(--text-lo)",
              maxWidth: "50ch",
              marginBottom: 26,
            }}
          >
            {identity.heroSummary}
          </p>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              padding: "7px 14px",
              border: "1px solid color-mix(in srgb, var(--pass) 35%, var(--line))",
              borderRadius: 999,
              background: "color-mix(in srgb, var(--pass) 9%, transparent)",
              marginBottom: 30,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--pass)",
                animation: "ssPulse 2.4s ease-in-out infinite",
              }}
            />
            <span style={{ fontSize: 13.5, color: "var(--text-hi)" }}>
              {identity.availability}
            </span>
          </div>

          <HeroActions links={identity.links} />
        </div>

        <div style={{ flex: "0 0 auto", position: "relative", padding: 14 }}>
          <span style={{ ...bracket, top: 0, left: 0, borderTop: "1.5px solid var(--brand)", borderLeft: "1.5px solid var(--brand)" }} />
          <span style={{ ...bracket, top: 0, right: 0, borderTop: "1.5px solid var(--brand)", borderRight: "1.5px solid var(--brand)" }} />
          <span style={{ ...bracket, bottom: 0, left: 0, borderBottom: "1.5px solid var(--brand)", borderLeft: "1.5px solid var(--brand)" }} />
          <span style={{ ...bracket, bottom: 0, right: 0, borderBottom: "1.5px solid var(--brand)", borderRight: "1.5px solid var(--brand)" }} />
          <Image
            src="/hanpeng.jpg"
            alt={`${identity.name}, ${identity.title}`}
            width={600}
            height={744}
            priority
            quality={92}
            // Display box is 232px, but request a much larger source so the photo
            // stays razor-sharp on hi-DPI/retina screens.
            sizes="600px"
            style={{
              display: "block",
              width: 232,
              height: 288,
              objectFit: "cover",
              borderRadius: 6,
              border: "1px solid var(--line)",
              filter: "grayscale(.15)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 14,
              right: 14,
              bottom: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "7px 11px",
              background: "color-mix(in srgb, var(--bg) 78%, transparent)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              borderTop: "1px solid var(--line)",
              fontFamily: "var(--font-mono)",
              fontSize: 10.5,
              color: "var(--text-lo)",
            }}
          >
            <span>{identity.locationShort}</span>
            <span
              style={{
                color: "var(--pass)",
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <NavigationIcon />
              在线
            </span>
          </div>
        </div>
      </div>

      <HeadlineMetrics metrics={profile.headlineMetrics} />
    </section>
  );
}
