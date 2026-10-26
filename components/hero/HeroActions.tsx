"use client";

import type { Links } from "@/lib/types";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { EmailButton } from "@/components/ui/EmailButton";
import { LinkedInIcon, GitHubIcon, YouTubeIcon } from "@/components/ui/icons";

export function HeroActions({ links }: { links: Links }) {
  return (
    <div className="hero-actions">
      <TrackedLink
        href={links.website}
        event="project_link_clicked"
        newTab
        className="h-primary hero-action-primary"
      >
        查看族记 ↗
      </TrackedLink>

      {/* The primary actions highlight the product and GitHub; the chat widget
          remains separate and doesn't compete with the contact links. */}
      {links.github && (
        <TrackedLink
          href={links.github}
          event="github_clicked"
          newTab
          className="h-ghost hero-action-secondary"
        >
          <GitHubIcon />
          GitHub
        </TrackedLink>
      )}

      <div className="hero-social-actions">
        {links.linkedin && (
          <TrackedLink
            href={links.linkedin}
            event="linkedin_clicked"
            newTab
            ariaLabel="LinkedIn"
            className="h-social hero-action-icon"
          >
            <LinkedInIcon />
          </TrackedLink>
        )}
        {links.youtube && (
          <TrackedLink
            href={links.youtube}
            event="youtube_clicked"
            newTab
            ariaLabel="YouTube"
            className="h-social hero-action-icon"
          >
            <YouTubeIcon />
          </TrackedLink>
        )}
        <EmailButton email={links.email} className="h-social hero-action-icon" />
      </div>
    </div>
  );
}
