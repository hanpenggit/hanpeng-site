import type { ProjectCaseStudy as ProjectCaseStudyData } from "@/lib/types";

/** Compact, evidence-minded context shared by featured and regular projects. */
export function ProjectCaseStudy({ data }: { data: ProjectCaseStudyData }) {
  const items = [
    { label: "要解决的问题", value: data.challenge },
    { label: "设计与取舍", value: data.approach },
    { label: "进展与边界", value: data.progress },
  ];

  return (
    <div className="case-study-grid" aria-label="项目实践摘要">
      {items.map((item) => (
        <div key={item.label} className="case-study-item">
          <h4 className="case-study-label">{item.label}</h4>
          <p className="case-study-text">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
