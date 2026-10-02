import { IDEA_ARTICLES } from "@/content/ideas/articles";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function GET() {
  const items = IDEA_ARTICLES.map((article) => {
    const url = `${SITE_URL}/ideas/${article.slug}`;
    return `
      <item>
        <title>${escapeXml(article.title)}</title>
        <link>${url}</link>
        <guid isPermaLink="true">${url}</guid>
        <description>${escapeXml(article.dek)}</description>
        <dc:creator>Adeseun Oyeneye</dc:creator>
        <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      </item>`;
  }).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
      <channel>
        <title>${escapeXml(`${SITE_NAME} — Blog`)}</title>
        <link>${SITE_URL}/ideas</link>
        <description>Ideas for building what matters.</description>
        <language>en-NG</language>
        <lastBuildDate>${new Date(IDEA_ARTICLES[0]!.modifiedAt).toUTCString()}</lastBuildDate>
        <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
        ${items}
      </channel>
    </rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
