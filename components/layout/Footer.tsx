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
        <span>独立构建 · 让想法落地</span>
        <a className="footer-back" href="#top" aria-label="返回页面顶部">返回顶部 ↑</a>
      </div>
    </footer>
  );
}
