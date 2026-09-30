import type { Project } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";

// Two independent columns so expanding a card only pushes cards in its own
// column down — the other column stays put. Shared by the landing-page
// section and the full /projects page.
export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div
      className="projects-cols"
      style={{
        display: "flex",
        gap: 18,
        marginTop: 30,
        alignItems: "flex-start",
      }}
    >
      <div className="projects-col">
        {projects
          .filter((_, i) => i % 2 === 0)
          .map((p) => (
            <ProjectCard key={p.name} project={p} />
          ))}
      </div>
      <div className="projects-col">
        {projects
          .filter((_, i) => i % 2 === 1)
          .map((p) => (
            <ProjectCard key={p.name} project={p} />
          ))}
      </div>
    </div>
  );
}
