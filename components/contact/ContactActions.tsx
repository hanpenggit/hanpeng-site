"use client";

import type { Links } from "@/lib/types";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { EmailButton } from "@/components/ui/EmailButton";
import {
  LinkedInIcon,
  GitHubIcon,
  YouTubeIcon,
} from "@/components/ui/icons";

const square: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 46,
  height: 46,
  borderRadius: 8,
  border: "1px solid var(--line)",
  color: "var(--text-hi)",
  textDecoration: "none",
  transition: "border-color .15s, color .15s",
};

export function ContactActions({ links }: { links: Links }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        flex: "0 0 auto",
        minWidth: 220,
      }}
    >
      <TrackedLink
        href={links.website}
        event="project_link_clicked"
        newTab
        className="h-primaryflat"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          height: 46,
          padding: "0 20px",
          borderRadius: 8,
          background: "var(--brand)",
          color: "#fff",
          fontSize: 14,
          fontWeight: 500,
          textDecoration: "none",
          transition: "background .15s",
        }}
      >
        访问族记 <span aria-hidden="true">↗</span>
      </TrackedLink>

      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        {links.linkedin && (
          <TrackedLink
            href={links.linkedin}
            event="linkedin_clicked"
            newTab
            ariaLabel="LinkedIn"
            className="h-contact-social"
            style={square}
          >
            <LinkedInIcon size={18} />
          </TrackedLink>
        )}
        {links.github && (
          <TrackedLink
            href={links.github}
            event="github_clicked"
            newTab
            ariaLabel="GitHub"
            className="h-contact-social"
            style={square}
          >
            <GitHubIcon size={18} />
          </TrackedLink>
        )}
        {links.youtube && (
          <TrackedLink
            href={links.youtube}
            event="youtube_clicked"
            newTab
            ariaLabel="YouTube"
            className="h-contact-social"
            style={square}
          >
            <YouTubeIcon size={18} />
          </TrackedLink>
        )}
        <EmailButton
          email={links.email}
          className="h-contact-social"
          style={square}
          iconSize={18}
        />
      </div>
    </div>
  );
}
