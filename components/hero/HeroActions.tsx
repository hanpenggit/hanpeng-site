"use client";

import type { Links } from "@/lib/types";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { EmailButton } from "@/components/ui/EmailButton";
import { LinkedInIcon, GitHubIcon, YouTubeIcon } from "@/components/ui/icons";

const circle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 53,
  height: 53,
  borderRadius: "50%",
  border: "1px solid var(--line)",
  color: "var(--text-lo)",
  textDecoration: "none",
  transition: "color .15s, border-color .15s",
};

export function HeroActions({ links }: { links: Links }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        alignItems: "center",
      }}
    >
      <TrackedLink
        href={links.website}
        event="project_link_clicked"
        newTab
        className="h-primary"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 9,
          height: 53,
          padding: "0 24px",
          borderRadius: 999,
          background: "var(--brand)",
          color: "#fff",
          fontSize: 14,
          fontWeight: 500,
          textDecoration: "none",
          transition: "background .15s, transform .15s",
        }}
      >
        查看族记 ↗
      </TrackedLink>

      {/* AI stays a bottom-corner easter egg (chat launcher) — the Hero CTA
          pair is product + GitHub, so the two entries never compete. */}
      {links.github && (
        <TrackedLink
          href={links.github}
          event="github_clicked"
          newTab
          className="h-ghost"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 9,
            height: 53,
            padding: "0 22px",
            borderRadius: 999,
            background: "var(--surface)",
            border: "1px solid var(--line)",
            color: "var(--text-hi)",
            fontSize: 14,
            fontWeight: 500,
            textDecoration: "none",
            transition: "border-color .15s",
          }}
        >
          <GitHubIcon />
          GitHub
        </TrackedLink>
      )}

      <div style={{ display: "flex", gap: 9, marginLeft: 2 }}>
        {links.linkedin && (
          <TrackedLink
            href={links.linkedin}
            event="linkedin_clicked"
            newTab
            ariaLabel="LinkedIn"
            className="h-social"
            style={circle}
          >
            <LinkedInIcon />
          </TrackedLink>
        )}
        {/* GitHub lives in the prominent ghost button above — a second circle
            icon here just duplicates the entry. */}
        {links.youtube && (
          <TrackedLink
            href={links.youtube}
            event="youtube_clicked"
            newTab
            ariaLabel="YouTube"
            className="h-social"
            style={circle}
          >
            <YouTubeIcon />
          </TrackedLink>
        )}
        <EmailButton email={links.email} className="h-social" style={circle} />
      </div>
    </div>
  );
}
