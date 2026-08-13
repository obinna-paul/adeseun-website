import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Only the pages that actually exist and are meant to be crawled. The
 * sitemap in lib/navigation.ts (SITE_ROOMS) also lists rooms not built
 * yet (The Screening Room, The Boardroom) — deliberately kept out here,
 * since listing routes that 404 is worse for SEO than omitting them.
 * Add each room to this list as its page ships.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
    { path: "/", priority: 1, changeFrequency: "monthly" },
    { path: "/library", priority: 0.9, changeFrequency: "monthly" },
    { path: "/study", priority: 0.7, changeFrequency: "yearly" },
    { path: "/invitation", priority: 0.6, changeFrequency: "yearly" },
  ];

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: new URL(path, SITE_URL).toString(),
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
