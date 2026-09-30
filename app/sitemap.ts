import type { MetadataRoute } from "next";
import { profile } from "@/lib/profile";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? profile.identity.links.website;
  const lastModified = new Date(profile.meta.lastUpdated);
  return [
    {
      url: base,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${base}/projects`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
