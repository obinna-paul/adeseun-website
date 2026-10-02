import type { MetadataRoute } from "next";
import { IDEA_ARTICLES } from "@/content/ideas/articles";
import { SITE_URL } from "@/lib/seo";

/**
 * Only the pages that actually exist and are meant to be crawled. The
 * page list in lib/navigation.ts (SITE_PAGES) also lists pages not built
 * yet (Work, Ideas, Press, Gallery) — deliberately kept out here, since
 * listing routes that 404 is worse for SEO than omitting them. Add each
 * page to this list as it ships.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: Array<{ path: string; lastModified: string }> = [
    { path: "/", lastModified: "2026-09-30" },
    { path: "/about", lastModified: "2026-09-30" },
    { path: "/executive-profile", lastModified: "2026-08-25" },
    { path: "/businesses", lastModified: "2026-08-25" },
    { path: "/books", lastModified: "2026-09-30" },
    { path: "/media", lastModified: "2026-08-25" },
    { path: "/speaking", lastModified: "2026-08-25" },
    { path: "/awards", lastModified: "2026-08-25" },
    { path: "/impact", lastModified: "2026-08-25" },
    { path: "/contact", lastModified: "2026-09-30" },
    { path: "/ideas", lastModified: IDEA_ARTICLES[0]!.modifiedAt },
    { path: "/editorial-policy", lastModified: "2026-10-02" },
  ];

  const staticPages: MetadataRoute.Sitemap = routes.map(({ path, lastModified }) => ({
    url: new URL(path, SITE_URL).toString(),
    lastModified: new Date(lastModified),
  }));

  const ideaPages: MetadataRoute.Sitemap = IDEA_ARTICLES.map((article) => ({
    url: new URL(`/ideas/${article.slug}`, SITE_URL).toString(),
    lastModified: new Date(article.modifiedAt),
  }));

  return [...staticPages, ...ideaPages];
}
