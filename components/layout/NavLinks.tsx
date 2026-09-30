"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sectionHref } from "@/lib/nav";

type NavLink = { label: string; href: string };

const linkStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 12.5,
  letterSpacing: ".04em",
  color: "var(--text-lo)",
  textDecoration: "none",
  padding: "8px 12px",
  borderRadius: 7,
  transition: "color .15s, background .15s",
};

// On the landing page these stay bare hashes on a plain anchor, so the browser
// does its own smooth scroll. Off it they become "/#section" and go through the
// Next router, which lands on the anchor after the route commits. Routing the
// bare-hash case through <Link> instead would swallow the scroll entirely.
export function NavLinks({ links }: { links: NavLink[] }) {
  const pathname = usePathname();
  return (
    <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {links.map((l) => {
        const href = sectionHref(pathname, l.href);
        return href.startsWith("#") ? (
          <a key={l.href} href={href} className="h-navlink" style={linkStyle}>
            {l.label}
          </a>
        ) : (
          <Link key={l.href} href={href} className="h-navlink" style={linkStyle}>
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
