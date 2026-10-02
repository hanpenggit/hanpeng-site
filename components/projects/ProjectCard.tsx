"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/lib/types";
import { logEvent } from "@/lib/analytics";

export function ProjectCard({ project }: { project: Project }) {
  // Two ways a card opens. Hovering is a peek: it closes itself the moment the
  // pointer leaves. Clicking pins it, and a pinned card ignores the pointer
  // entirely. `suppressed` stops a click-to-close from being undone instantly
  // by the pointer that is still sitting on the card.
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [suppressed, setSuppressed] = useState(false);
  const [canHover, setCanHover] = useState(false);

  // Touch devices fire mouseenter on tap and never fire the matching leave,
  // which would strand cards open. Peeking is desktop-pointer only.
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setCanHover(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setCanHover(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const peeking = canHover && hovered && !suppressed;
  const expanded = pinned || peeking;

  function toggle() {
    if (pinned) {
      setPinned(false);
      setSuppressed(true);
      return;
    }
    logEvent("project_expanded", { project: project.name });
    setPinned(true);
    setSuppressed(false);
  }

  return (
    <div
      className="h-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setSuppressed(false);
      }}
      style={{
        border: "1px solid var(--line)",
        borderRadius: 8,
        background: "var(--surface)",
        padding: 22,
        display: "flex",
        flexDirection: "column",
        transition: "border-color .15s, transform .15s",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
          marginBottom: 14,
        }}
      >
        {project.metric && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 12px",
              borderRadius: 999,
              background: "color-mix(in srgb, var(--pass) 14%, transparent)",
              color: "var(--pass)",
              fontFamily: "var(--font-mono)",
              fontSize: 11.5,
              fontWeight: 500,
            }}
          >
            ✓ {project.metric}
          </span>
        )}
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--text-lo)",
            whiteSpace: "nowrap",
            marginLeft: "auto",
          }}
        >
          {project.year}
        </span>
      </div>

      <h3
        style={{
          fontSize: 17,
          fontWeight: 600,
          lineHeight: 1.25,
          marginBottom: 5,
        }}
      >
        {project.name}
      </h3>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--brand-soft)",
          marginBottom: 12,
        }}
      >
        {project.role}
      </div>
      <p
        style={{
          fontSize: 13.5,
          lineHeight: 1.6,
          color: "var(--text-lo)",
          marginBottom: 14,
        }}
      >
        {project.blurb}
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          marginBottom: 16,
          marginTop: "auto",
        }}
      >
        {project.tags.map((t) => (
          <span
            key={t}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10.5,
              color: "var(--text-lo)",
              padding: "3px 8px",
              border: "1px solid var(--line)",
              borderRadius: 5,
            }}
          >
            {t}
          </span>
        ))}
      </div>

      <button
        onClick={toggle}
        aria-expanded={expanded}
        className="h-toggle"
        style={{
          alignSelf: "flex-start",
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          background: "none",
          border: "none",
          color: "var(--text-lo)",
          fontFamily: "var(--font-mono)",
          fontSize: 11.5,
          transition: "color .15s",
        }}
      >
        <span
          style={{
            color: "var(--brand-soft)",
            display: "inline-block",
            transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform .3s cubic-bezier(.4, 0, .2, 1)",
          }}
        >
          ▸
        </span>
        {pinned ? "收起" : peeking ? "保持展开" : "详情"}
      </button>

      {/* Below the toggle on purpose. Opening it above would insert ~200px
          between the blurb and the button, and since cards also open on hover,
          that slides the button out from under a pointer that never moved: the
          cursor silently flips from a hand to an I-beam while you hold still.
          Growing downward keeps everything above it anchored. */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: expanded ? "1fr" : "0fr",
          transition: "grid-template-rows .38s cubic-bezier(.4, 0, .2, 1)",
        }}
      >
        <div style={{ overflow: "hidden", minHeight: 0 }}>
          <div
            style={{
              margin: "14px 0 0",
              padding: "12px 14px",
              borderLeft: "2px solid var(--brand)",
              background: "var(--surface-2)",
              borderRadius: "0 6px 6px 0",
              opacity: expanded ? 1 : 0,
              transition: "opacity .3s ease",
            }}
          >
            <p
              style={{
                fontSize: 13.5,
                lineHeight: 1.6,
                color: "var(--text-hi)",
                margin: 0,
              }}
            >
              {project.detail}
            </p>
            {/* 架构亮点 — the "challenge → how I solved it" bullets. */}
            {project.highlights && project.highlights.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 9,
                  marginTop: 12,
                }}
              >
                {project.highlights.map((h) => (
                  <div key={h.title}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 8,
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--text-hi)",
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
                        lineHeight: 1.6,
                        color: "var(--text-lo)",
                        marginTop: 3,
                      }}
                    >
                      {h.detail}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {project.links && project.links.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 14,
                  marginTop: 12,
                }}
              >
                {project.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    // collapsed panel is still in the DOM; keep it out of the
                    // tab order until it's actually visible
                    tabIndex={expanded ? 0 : -1}
                    onClick={() =>
                      logEvent("project_link_clicked", {
                        project: project.name,
                        link: l.label,
                      })
                    }
                    className="h-projectlink"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11.5,
                      color: "var(--brand-soft)",
                      textDecoration: "none",
                      transition: "color .15s",
                    }}
                  >
                    {l.label} ↗
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
