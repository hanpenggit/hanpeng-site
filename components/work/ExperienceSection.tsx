"use client";

import { useEffect, useRef, useState } from "react";
import type { Company, Education, Tone } from "@/lib/types";

function MetricPill({ metric, tone }: { metric: string; tone: Tone }) {
  const color = tone === "pass" ? "var(--pass)" : "var(--brand-soft)";
  const bg =
    tone === "pass"
      ? "color-mix(in srgb, var(--pass) 14%, transparent)"
      : "color-mix(in srgb, var(--brand) 18%, transparent)";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        marginLeft: 8,
        padding: "2px 10px",
        borderRadius: 999,
        background: bg,
        color,
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        fontWeight: 500,
        whiteSpace: "nowrap",
        verticalAlign: "middle",
      }}
    >
      {metric}
    </span>
  );
}

const toggleBtn = (active: boolean): React.CSSProperties => ({
  height: 32,
  padding: "0 18px",
  border: "none",
  borderRadius: 999,
  fontFamily: "var(--font-mono)",
  fontSize: 12,
  background: active ? "var(--brand)" : "transparent",
  color: active ? "#fff" : "var(--text-lo)",
  transition: "all .15s",
});

function CompanyList({ companies }: { companies: Company[] }) {
  return (
    <>
      {companies.map((co) => (
        <div
          key={co.company}
          className="work-row"
          style={{
            borderTop: "1px solid var(--line)",
            padding: "30px 0",
            display: "grid",
            gap: 28,
          }}
        >
          <div style={{ paddingTop: 2 }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11.5,
                color: "var(--text-lo)",
                marginBottom: 8,
              }}
            >
              {co.dates}
            </div>
            <a
              href={co.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-company"
              style={{
                fontFamily: "var(--font-grotesk)",
                fontWeight: 600,
                fontSize: 16,
                color: "var(--text-hi)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                transition: "color .15s",
              }}
            >
              {co.company}{" "}
              <span style={{ fontSize: 11, color: "var(--text-lo)" }}>↗</span>
            </a>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--text-lo)",
                marginTop: 6,
              }}
            >
              {co.location}
            </div>
            {co.current && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 10,
                  fontFamily: "var(--font-mono)",
                  fontSize: 10.5,
                  color: "var(--pass)",
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "var(--pass)",
                    animation: "ssPulse 2.4s ease-in-out infinite",
                  }}
                />
                目前在职
              </div>
            )}
          </div>

          <div
            className="work-body"
            style={{ borderLeft: "1px solid var(--line)", paddingLeft: 28 }}
          >
            {co.roles.map((role) => (
              <div key={role.title} style={{ marginBottom: 22 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                    flexWrap: "wrap",
                    alignItems: "baseline",
                    marginBottom: 8,
                  }}
                >
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      color: "var(--text-hi)",
                    }}
                  >
                    {role.title}
                  </h3>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "var(--text-lo)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {role.dates}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: "var(--text-lo)",
                    marginBottom: 14,
                    maxWidth: "62ch",
                  }}
                >
                  {role.summary}
                </p>
                {role.bullets.map((b, bi) => (
                  <div
                    key={bi}
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                      marginBottom: 11,
                    }}
                  >
                    <span
                      style={{
                        color: "var(--brand-soft)",
                        fontFamily: "var(--font-mono)",
                        fontSize: 13,
                        lineHeight: 1.55,
                        flex: "0 0 auto",
                      }}
                    >
                      ▸
                    </span>
                    <div style={{ flex: 1 }}>
                      <span
                        style={{
                          fontSize: 14,
                          lineHeight: 1.55,
                          color: "var(--text-hi)",
                        }}
                      >
                        {b.text}
                      </span>
                      {b.metric && <MetricPill metric={b.metric} tone={b.tone} />}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

function EducationList({ education }: { education: Education[] }) {
  return (
    <>
      {education.map((ed) => (
        <div
          key={ed.degree}
          className="work-row"
          style={{
            borderTop: "1px solid var(--line)",
            padding: "30px 0",
            display: "grid",
            gap: 28,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11.5,
                color: "var(--text-lo)",
                marginBottom: 8,
              }}
            >
              {ed.dates}
            </div>
            {ed.inProgress && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "var(--font-mono)",
                  fontSize: 10.5,
                  color: "var(--pass)",
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "var(--pass)",
                    animation: "ssPulse 2.4s ease-in-out infinite",
                  }}
                />
                进行中
              </div>
            )}
          </div>
          <div
            className="work-body"
            style={{ borderLeft: "1px solid var(--line)", paddingLeft: 28 }}
          >
            <h3
              style={{
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 6,
                maxWidth: "58ch",
              }}
            >
              {ed.degree}
            </h3>
            <div
              style={{
                fontFamily: "var(--font-grotesk)",
                fontWeight: 500,
                fontSize: 14,
                color: "var(--brand-soft)",
                marginBottom: 4,
              }}
            >
              {ed.institution}
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--text-lo)",
                marginBottom: 14,
              }}
            >
              {ed.location}
              {ed.honors.length ? " · " + ed.honors.join(", ") : ""}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {ed.coursework.map((c) => (
                <span
                  key={c}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--text-lo)",
                    padding: "3px 9px",
                    border: "1px solid var(--line)",
                    borderRadius: 5,
                    background: "var(--surface)",
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export function ExperienceSection({
  companies,
  education,
}: {
  companies: Company[];
  education: Education[];
}) {
  const [tab, setTab] = useState<"work" | "education">("work");
  const workRef = useRef<HTMLDivElement>(null);
  const eduRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);

  // profile.json has no education entries yet — showing the toggle would offer
  // a tab that renders a blank panel, so the whole switcher disappears and the
  // section stays a plain work timeline. Fill in education and it comes back.
  const hasEducation = education.length > 0;
  const active = hasEducation ? tab : "work";

  // Keep the sliding viewport's height matched to the active panel so the
  // two differently-sized panels transition smoothly.
  useEffect(() => {
    const measure = () => {
      const el = active === "work" ? workRef.current : eduRef.current;
      if (el) setHeight(el.offsetHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (workRef.current) ro.observe(workRef.current);
    if (eduRef.current) ro.observe(eduRef.current);
      window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [active]);

  function switchTo(next: "work" | "education") {
    if (next === active) return;
    // Set the target height synchronously so height + slide start together.
    const target = next === "work" ? workRef.current : eduRef.current;
    if (target) setHeight(target.offsetHeight);
    setTab(next);
  }

  return (
    <section id="work" style={{ padding: "64px 0 24px", scrollMarginTop: 88 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 40,
          flexWrap: "wrap",
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
          工作经历
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
          Experience
        </span>
        <span
          style={{ flex: 1, height: 1, background: "var(--line)", minWidth: 40 }}
        />
        {hasEducation && (
          <div
            role="tablist"
            aria-label="工作经历或教育背景"
            style={{
              display: "inline-flex",
              padding: 4,
              border: "1px solid var(--line)",
              borderRadius: 999,
              background: "var(--surface)",
            }}
          >
            <button
              role="tab"
              aria-selected={active === "work"}
              onClick={() => switchTo("work")}
              style={toggleBtn(active === "work")}
            >
              工作
            </button>
            <button
              role="tab"
              aria-selected={active === "education"}
              onClick={() => switchTo("education")}
              style={toggleBtn(active === "education")}
            >
              教育背景
            </button>
          </div>
        )}
      </div>

      <div
        style={{
          position: "relative",
          overflow: "hidden",
          height,
          transition: "height .45s cubic-bezier(.4, 0, .2, 1)",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "200%",
            alignItems: "flex-start",
            transform: active === "work" ? "translateX(0)" : "translateX(-50%)",
            transition: "transform .45s cubic-bezier(.4, 0, .2, 1)",
            willChange: "transform",
          }}
        >
          <div
            ref={workRef}
            inert={active !== "work" || undefined}
            aria-hidden={active !== "work"}
            style={{ flex: "0 0 50%", width: "50%", minWidth: 0 }}
          >
            <CompanyList companies={companies} />
          </div>
          <div
            ref={eduRef}
            inert={active !== "education" || undefined}
            aria-hidden={active !== "education"}
            style={{ flex: "0 0 50%", width: "50%", minWidth: 0 }}
          >
            <EducationList education={education} />
          </div>
        </div>
      </div>
    </section>
  );
}
