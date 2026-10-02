import { getIdeaArticle, getIdeaPillar } from "@/content/ideas/articles";
import { renderArticleOgImage, OG_ALT, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = OG_ALT;

export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getIdeaArticle(slug);

  if (!article) {
    return renderArticleOgImage({ title: "The Study", pillar: "Ideas & Essays" });
  }

  return renderArticleOgImage({ title: article.title, pillar: getIdeaPillar(article.pillar).label });
}
