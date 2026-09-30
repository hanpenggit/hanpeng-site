import type { MetadataRoute } from "next";
import { profile } from "@/lib/profile";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? profile.identity.links.website;
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
