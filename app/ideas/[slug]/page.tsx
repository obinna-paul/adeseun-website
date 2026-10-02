import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IdeaArticlePage } from "@/components/sections/ideas";
import {
  IDEA_ARTICLES,
  articleWordCount,
  getIdeaArticle,
  getIdeaPillar,
} from "@/content/ideas/articles";
import { articleJsonLd, articleMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return IDEA_ARTICLES.map((article) => ({ slug: article.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getIdeaArticle(slug);
  if (!article) notFound();

  return articleMetadata({
    title: article.title,
    description: article.seoDescription,
    slug: article.slug,
    publishedAt: article.publishedAt,
    modifiedAt: article.modifiedAt,
    image: article.hero.src,
    topics: article.topics,
  });
}

export default async function IdeaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getIdeaArticle(slug);
  if (!article) notFound();

  const pillar = getIdeaPillar(article.pillar);
  const jsonLd = articleJsonLd({
    title: article.title,
    description: article.seoDescription,
    dek: article.dek,
    slug: article.slug,
    publishedAt: article.publishedAt,
    modifiedAt: article.modifiedAt,
    image: article.hero.src,
    topics: article.topics,
    pillar: pillar.label,
    wordCount: articleWordCount(article),
    citations: article.references.map((reference) => reference.url),
  });

  return (
    <main id="main-content" tabIndex={-1}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <IdeaArticlePage article={article} />
    </main>
  );
}
