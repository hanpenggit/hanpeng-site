"use client";

import Link from "next/link";
import { logEvent } from "@/lib/analytics";

// Sits opposite the "featured projects" headline and routes to the full list.
// next/link (not TrackedLink) so the navigation stays client-side.
export function ViewAllProjectsLink({ count }: { count: number }) {
  return (
    <Link
      href="/projects"
      onClick={() => logEvent("all_projects_clicked")}
      className="h-pillbtn"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        height: 34,
        padding: "0 14px",
        border: "1px solid var(--line)",
        borderRadius: 999,
        background: "var(--surface)",
        color: "var(--text-lo)",
        fontFamily: "var(--font-mono)",
        fontSize: 11.5,
        whiteSpace: "nowrap",
        textDecoration: "none",
        transition: "border-color .15s, color .15s",
      }}
    >
      查看全部 {count} 个
      <span aria-hidden="true">→</span>
    </Link>
  );
}
