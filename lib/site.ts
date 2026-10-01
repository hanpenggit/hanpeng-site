import { profile } from "./profile";

// The canonical URL of THIS site. Kept separate from
// identity.links.website (which points at the product, e.g. 族记) — conflating
// the two made canonical URLs, sitemap.xml, robots.txt, Open Graph and the
// Person JSON-LD all advertise the wrong host.
//
// Precedence: NEXT_PUBLIC_SITE_URL (per-environment) → meta.siteUrl → website link.
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ??
    profile.meta.siteUrl ??
    profile.identity.links.website;
  return raw.replace(/\/+$/, "");
}
