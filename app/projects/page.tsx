import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/lib/profile";
import { ChatProvider } from "@/components/chat/ChatProvider";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { ProjectGrid } from "@/components/projects/ProjectGrid";

const { identity, projects } = profile;

export const metadata: Metadata = {
  title: "Projects",
  description: `Every project ${identity.name} has shipped — product, analytics, blockchain, and QA automation work with the outcomes attached.`,
  alternates: { canonical: "/projects" },
  openGraph: {
    title: `Projects · ${identity.name}`,
    description: `The full project list — ${projects.length} builds with the outcomes attached.`,
    url: "/projects",
    type: "website",
  },
};

export default function ProjectsPage() {
  return (
    <ChatProvider chatbot={profile.chatbot}>
      <Nav />
      <main
        id="top"
        className="main-pad"
        style={{ maxWidth: 1120, margin: "0 auto", padding: "0 clamp(20px, 5vw, 32px)" }}
      >
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
            <span aria-hidden="true">←</span> back home
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
              all projects
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
              {projects.length} total
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
            Everything I&rsquo;ve shipped, with the outcome attached. Hit
            &ldquo;details&rdquo; on any card for the longer story.
          </p>

          <ProjectGrid projects={projects} />
        </section>
      </main>
      <Footer />
    </ChatProvider>
  );
}
