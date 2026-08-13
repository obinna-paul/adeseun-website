import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Open to all crawlers, with the sitemap advertised. `/interactions` is a
 * dev-only component gallery, not part of the public site, so it's kept
 * out of the index.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/interactions",
    },
    sitemap: new URL("/sitemap.xml", SITE_URL).toString(),
    host: SITE_URL,
  };
}
