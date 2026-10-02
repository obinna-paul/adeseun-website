import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import {
  articleReadingMinutes,
  formatIdeaDate,
  getIdeaPillar,
  type IdeaArticle,
} from "@/content/ideas/articles";
import { cn } from "@/lib/utils";

type ArticleCardProps = {
  article: IdeaArticle;
  variant?: "default" | "compact";
  headingLevel?: "h2" | "h3";
};

export function ArticleCard({ article, variant = "default", headingLevel = "h3" }: ArticleCardProps) {
  const pillar = getIdeaPillar(article.pillar);
  const Heading = headingLevel;

  return (
    <article
      className={cn(
        "group border-t border-line pt-5",
        variant === "default" && "grid gap-6 sm:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] sm:items-start",
      )}
    >
      {variant === "default" ? (
        <Link
          href={`/ideas/${article.slug}`}
          aria-label={`Read ${article.title}`}
          className="relative block aspect-[4/3] overflow-hidden rounded-frame bg-surface-sunken focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-4 focus-visible:ring-offset-ground"
        >
          <Image
            src={article.hero.src}
            alt=""
            fill
            sizes="(min-width: 1280px) 28vw, (min-width: 640px) 42vw, 92vw"
            className="object-cover transition-transform duration-500 ease-gallery-out motion-safe:group-hover:scale-[1.025]"
            style={{ objectPosition: article.hero.objectPosition }}
          />
        </Link>
      ) : null}

      <div className="flex min-w-0 flex-col items-start">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-emerald-ink">{pillar.label}</p>
        <Heading className={cn("mt-3 text-balance font-display font-semibold text-text", variant === "compact" ? "text-2xl" : "text-3xl")}>
          <Link
            href={`/ideas/${article.slug}`}
            className="decoration-gold/60 underline-offset-[0.16em] hover:underline focus-visible:outline-none focus-visible:underline"
          >
            {article.title}
          </Link>
        </Heading>
        <p className={cn("mt-3 text-text-subdued", variant === "compact" ? "text-base" : "text-lg")}>{article.dek}</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.08em] text-text-faint">
          <time dateTime={article.publishedAt}>{formatIdeaDate(article.publishedAt)}</time>
          <span aria-hidden="true">·</span>
          <span>{articleReadingMinutes(article)} min read</span>
        </div>
        <Link
          href={`/ideas/${article.slug}`}
          className="mt-6 inline-flex min-h-11 items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-emerald-ink decoration-gold underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-4"
        >
          {article.title}
          <ArrowUpRight aria-hidden="true" size={16} weight="light" />
        </Link>
      </div>
    </article>
  );
}
