"use client";

import { ResumeIcon } from "@/components/ui/icons";
import { logEvent } from "@/lib/analytics";

// Opens the résumé in a new tab (the viewer's PDF viewer) AND saves a copy to
// their machine. The anchor's target=_blank handles the open; the click handler
// triggers a programmatic download of the same file.
export function ResumeButton({ href }: { href: string }) {
  function handleClick() {
    logEvent("resume_viewed");
    const a = document.createElement("a");
    a.href = href;
    a.download = "hanpeng_resume.pdf";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-label="打开并下载简历（PDF）"
      className="h-pillbtn"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        height: 34,
        padding: "0 12px",
        border: "1px solid var(--line)",
        borderRadius: 999,
        background: "var(--surface)",
        color: "var(--text-lo)",
        fontFamily: "var(--font-mono)",
        fontSize: 11.5,
        textDecoration: "none",
        transition: "border-color .15s, color .15s",
      }}
    >
      <ResumeIcon />
      简历
    </a>
  );
}
