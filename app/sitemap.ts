import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Only the pages that actually exist and are meant to be crawled. The
 * page list in lib/navigation.ts (SITE_PAGES) also lists pages not built
 * yet (Work, Ideas, Press, Gallery) — deliberately kept out here, since
 * listing routes that 404 is worse for SEO than omitting them. Add each
 * page to this list as it ships.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
    { path: "/", priority: 1, changeFrequency: "monthly" },
    { path: "/about", priority: 0.9, changeFrequency: "yearly" },
    { path: "/executive-profile", priority: 0.8, changeFrequency: "yearly" },
    { path: "/businesses", priority: 0.8, changeFrequency: "monthly" },
    { path: "/books", priority: 0.8, changeFrequency: "monthly" },
    { path: "/media", priority: 0.7, changeFrequency: "monthly" },
    { path: "/speaking", priority: 0.7, changeFrequency: "yearly" },
    { path: "/awards", priority: 0.6, changeFrequency: "yearly" },
    { path: "/impact", priority: 0.6, changeFrequency: "yearly" },
    { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
  ];

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: new URL(path, SITE_URL).toString(),
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
