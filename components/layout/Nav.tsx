import { profile } from "@/lib/profile";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Wordmark } from "@/components/layout/Wordmark";
import { NavLinks } from "@/components/layout/NavLinks";
import { MobileNav } from "@/components/layout/MobileNav";

const NAV_LINKS = [
  { label: "项目", href: "#projects" },
  { label: "AI Lab", href: "#ai-lab" },
  { label: "工作经历", href: "#work" },
  { label: "近况", href: "#now" },
  { label: "技术栈", href: "#stack" },
  { label: "联系", href: "#contact" },
];

export function Nav() {
  const { links } = profile.identity;
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "color-mix(in srgb, var(--bg) 82%, transparent)",
        backdropFilter: "blur(14px) saturate(120%)",
        WebkitBackdropFilter: "blur(14px) saturate(120%)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div
        className="nav-pad"
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "0 32px",
          height: 64,
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}
      >
        <Wordmark />

        {/* desktop: inline links + actions */}
        <div className="nav-desktop">
          <NavLinks links={NAV_LINKS} />
          <ThemeToggle />
        </div>

        {/* mobile: hamburger + full-screen menu */}
        <MobileNav navLinks={NAV_LINKS} links={links} />
      </div>
    </header>
  );
}
