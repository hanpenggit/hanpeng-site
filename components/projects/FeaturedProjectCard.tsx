"use client";

import type { Project } from "@/lib/types";
import { logEvent } from "@/lib/analytics";

// Featured project — the hero card. One full-width, visually weighted card for
// the main product (族记), so the landing page has a clear protagonist instead
// of three equal-weight cards. Highlights are shown directly: a featured card
// has nothing to hide behind an expand toggle.
export function FeaturedProjectCard({ project }: { project: Project }) {
  const link = project.links?.[0];
  return (
    <div
      className="featured-card"
      style={{
        border: "1px solid var(--line)",
        borderTop: "2px solid var(--brand)",
        borderRadius: 10,
        background:
          "color-mix(in srgb, var(--brand) 4%, var(--surface))",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: ".14em",
            textTransform: "uppercase",
            color: "var(--brand-soft)",
          }}
        >
          {project.role} · Featured
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--text-lo)",
            whiteSpace: "nowrap",
          }}
        >
          {project.year}
        </span>
      </div>

      <h3
        style={{
          fontFamily: "var(--display)",
          fontWeight: 400,
          fontSize: "clamp(30px, 4vw, 42px)",
          lineHeight: 1.05,
          letterSpacing: "-.02em",
          marginBottom: 6,
        }}
      >
        {project.name}
      </h3>
      {project.subtitle && (
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12.5,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            color: "var(--brand-soft)",
            marginBottom: 16,
          }}
        >
          {project.subtitle}
        </div>
      )}

      <p
        style={{
          fontSize: 15.5,
          lineHeight: 1.7,
          color: "var(--text-hi)",
          maxWidth: "62ch",
          marginBottom: 18,
        }}
      >
        {project.blurb}
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 7,
          marginBottom: 24,
        }}
      >
        {project.tags.map((t) => (
          <span
            key={t}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--text-lo)",
              padding: "3px 10px",
              border: "1px solid var(--line)",
              borderRadius: 999,
              background: "var(--surface)",
            }}
          >
            {t}
          </span>
        ))}
      </div>

      {project.highlights && project.highlights.length > 0 && (
        <div
          className="featured-highlights"
          style={{
            display: "grid",
            gap: 16,
            paddingTop: 20,
            borderTop: "1px solid var(--line)",
          }}
        >
          {project.highlights.map((h) => (
            <div key={h.title}>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 8,
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: "var(--text-hi)",
                  marginBottom: 4,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    color: "var(--pass)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                  }}
                >
                  ▸
                </span>
                {h.title}
              </div>
              <div
                style={{
                  fontSize: 12.5,
                  lineHeight: 1.65,
                  color: "var(--text-lo)",
                }}
              >
                {h.detail}
              </div>
            </div>
          ))}
        </div>
      )}

      {link && (
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            logEvent("project_link_clicked", {
              project: project.name,
              link: link.label,
            })
          }
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginTop: 24,
            alignSelf: "flex-end",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            fontWeight: 600,
            color: "var(--brand-soft)",
            textDecoration: "none",
            transition: "color .15s",
          }}
        >
          查看项目 {link.label} ↗
        </a>
      )}
    </div>
  );
}
