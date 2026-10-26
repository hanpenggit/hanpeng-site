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
    <section className="hero-section" style={{ scrollMarginTop: 88 }}>
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="hero-kicker-row">
            <span className="hero-kicker-rule" aria-hidden="true" />
            <span className="hero-title-kicker">{identity.title}</span>
          </div>
          {identity.roleLine && (
            <div className="hero-role-line">{identity.roleLine}</div>
          )}

          <h1 id="hero-name" className="hero-name">
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

          <p className="hero-tagline">
            {identity.taglineLead}
            <br />
            <span
              style={{
                color: "var(--pass)",
                fontStyle: "var(--accent-style)",
                overflowWrap: "anywhere",
              }}
            >
              {identity.taglineAccent}
            </span>
          </p>

          <p className="hero-summary">{identity.heroSummary}</p>

          <div className="hero-availability">
            <span className="hero-availability-dot" aria-hidden="true" />
            <span>{identity.availability}</span>
          </div>

          <HeroActions links={identity.links} />
        </div>

        <div className="hero-portrait-frame">
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
            quality={75}
            // The requested width matches the CSS display box, not the source
            // image dimensions. Next/Image can still serve high-DPI variants.
            sizes="(max-width: 640px) 188px, (max-width: 780px) 204px, 204px"
            className="hero-portrait-image"
          />
          <div className="hero-portrait-caption">
            <span>{identity.locationShort}</span>
            <span className="hero-portrait-online">
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
