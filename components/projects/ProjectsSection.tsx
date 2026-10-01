import { profile } from "@/lib/profile";
import { ProjectGrid } from "./ProjectGrid";
import { ViewAllProjectsLink } from "./ViewAllProjectsLink";

// The landing page shows a curated slice; /projects has the rest.
const FEATURED_COUNT = 6;

export function ProjectsSection() {
  const featured = profile.projects.slice(0, FEATURED_COUNT);
  // With only a couple of projects the landing grid already shows everything —
  // a "查看全部 2 个" link that lands on the same cards is just noise.
  const hasMore = profile.projects.length > FEATURED_COUNT;
  return (
    <section id="projects" style={{ padding: "64px 0 24px", scrollMarginTop: 88 }}>
      <div
        className="section-head"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 14,
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
          精选项目
        </h2>
        <span
          className="section-rule"
          style={{ flex: 1, height: 1, background: "var(--line)" }}
        />
        {hasMore && <ViewAllProjectsLink count={profile.projects.length} />}
      </div>
      <ProjectGrid projects={featured} />
    </section>
  );
}
