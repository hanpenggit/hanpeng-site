import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/lib/profile";
import { ChatProvider } from "@/components/chat/ChatProvider";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { ProjectGrid } from "@/components/projects/ProjectGrid";

const { identity, projects } = profile;

export const metadata: Metadata = {
  title: "项目案例",
  description: `${identity.name} 的完整项目作品集，涵盖独立产品、AI 工程实验与个人基础设施。`,
  alternates: { canonical: "/projects" },
  openGraph: {
    title: `Projects · ${identity.name}`,
    description: `从独立产品到 AI 工程实践，查看 ${projects.length} 个项目与技术探索。`,
    url: "/projects",
    type: "website",
  },
};

export default function ProjectsPage() {
  return (
    <ChatProvider chatbot={profile.chatbot}>
      <Nav />
      <main
        id="main-content"
        className="main-pad"
        style={{ maxWidth: 1120, margin: "0 auto", padding: "0 clamp(20px, 5vw, 32px)" }}
      >
        <span id="top" className="anchor-top" aria-hidden="true" />
        <section style={{ padding: "48px 0 24px" }}>
          <Link
            href="/#projects"
            className="h-toggle"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              color: "var(--text-lo)",
              fontFamily: "var(--font-mono)",
              fontSize: 11.5,
              textDecoration: "none",
              transition: "color .15s",
            }}
          >
            <span aria-hidden="true">←</span> 返回首页
          </Link>

          <div
            className="section-head"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              margin: "20px 0 14px",
            }}
          >
            <h1
              style={{
                fontFamily: "var(--display)",
                fontWeight: 400,
                fontSize: 34,
                letterSpacing: "-.01em",
              }}
            >
              所有项目
            </h1>
            <span
              className="section-rule"
              style={{ flex: 1, height: 1, background: "var(--line)" }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11.5,
                color: "var(--text-lo)",
                whiteSpace: "nowrap",
              }}
            >
              共 {projects.length} 项
            </span>
          </div>

          <p
            style={{
              maxWidth: 620,
              fontSize: 14,
              lineHeight: 1.65,
              color: "var(--text-lo)",
            }}
          >
            这里收录独立产品、AI 工作流研发、模型实验和基础设施实践。每个项目区分问题、设计取舍与当前状态；“研发中”不等于已生产发布。点击项目卡片中的「详情」查看实践摘要。
          </p>

          <ProjectGrid projects={projects} />
        </section>
      </main>
      <Footer />
    </ChatProvider>
  );
}
