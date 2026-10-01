import Link from "next/link";
import { profile } from "@/lib/profile";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        maxWidth: 1120,
        margin: "0 auto",
        padding: "0 32px",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          letterSpacing: ".16em",
          textTransform: "uppercase",
          color: "var(--pass)",
          marginBottom: 14,
        }}
      >
        404
      </div>
      <h1
        style={{
          fontFamily: "var(--display)",
          fontWeight: 400,
          fontSize: "clamp(38px, 6vw, 60px)",
          letterSpacing: "-.02em",
          marginBottom: 16,
        }}
      >
        这个页面不存在
      </h1>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text-lo)", maxWidth: "46ch" }}>
        链接可能已经失效。回到 {profile.identity.name} 的主页继续浏览，或者直接发邮件：
        <a href={profile.identity.links.emailHref} style={{ color: "var(--brand-soft)" }}>
          {profile.identity.links.email}
        </a>
      </p>
      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          marginTop: 26,
          alignSelf: "flex-start",
          height: 46,
          padding: "0 22px",
          borderRadius: 999,
          background: "var(--brand)",
          color: "#fff",
          fontSize: 14,
          textDecoration: "none",
        }}
      >
        <span aria-hidden="true">←</span> 回首页
      </Link>
    </main>
  );
}
