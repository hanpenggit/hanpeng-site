import { profile } from "@/lib/profile";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      style={{ borderTop: "1px solid var(--line)", background: "var(--rail)" }}
    >
      <div
        className="nav-pad"
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "26px 32px",
          display: "flex",
          justifyContent: "space-between",
          gap: 20,
          flexWrap: "wrap",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--text-lo)",
        }}
      >
        <span>
          © {year} {profile.identity.name}
        </span>
        <span>用 ❤ 和 next.js 构建</span>
      </div>
    </footer>
  );
}
