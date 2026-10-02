import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import {
  IDEA_ARTICLES,
  IDEA_PILLARS,
  articleReadingMinutes,
  formatIdeaDate,
  getIdeaPillar,
} from "@/content/ideas/articles";
import { ArticleCard } from "./ArticleCard";

const PAPER_TEXTURE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.45'/%3E%3C/svg%3E\")";

export function IdeasIndex() {
  // The content registry is deliberately newest-first and requires the lead
  // story at index 0; the non-null assertion is safe while the registry has
  // at least one published article (enforced by this module's source data).
  const featured = IDEA_ARTICLES.find((article) => article.featured) ?? IDEA_ARTICLES[0]!;
  const latest = IDEA_ARTICLES.filter((article) => article.slug !== featured.slug).slice(0, 4);
  const notebook = IDEA_ARTICLES.filter((article) => article.slug !== featured.slug).slice(4);
  const featuredPillar = getIdeaPillar(featured.pillar);
  const activePillars = IDEA_PILLARS.filter((pillar) =>
    IDEA_ARTICLES.some((article) => article.pillar === pillar.slug),
  );

  return (
    <>
      <section
        className="relative overflow-hidden bg-ground px-gutter pb-20 pt-40 sm:pb-24 sm:pt-44"
        aria-labelledby="ideas-title"
        style={{ backgroundImage: PAPER_TEXTURE, backgroundBlendMode: "soft-light" }}
      >
        <div className="mx-auto max-w-frame">
          <div className="grid gap-10 border-b border-line pb-12 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.58fr)] lg:items-end">
            <div className="max-w-4xl">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-gold-ink">The Study</p>
              <h1 id="ideas-title" className="mt-5 max-w-4xl text-balance font-display text-5xl font-semibold text-text sm:text-6xl lg:text-7xl">
                Ideas for building what matters.
              </h1>
            </div>
            <p className="max-w-xl text-lg text-text-subdued sm:text-xl">
              Essays on leadership, African media, architecture, purpose, and the patient work of turning ideas into something other people can trust.
            </p>
          </div>

          <nav aria-label="Explore ideas by subject" className="mt-8 flex gap-3 overflow-x-auto pb-2">
            {activePillars.map((pillar) => (
              <a
                key={pillar.slug}
                href={`#${pillar.slug}`}
                className="inline-flex min-h-11 shrink-0 items-center rounded-control border border-line bg-surface/70 px-5 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-text-subdued transition-colors hover:border-emerald hover:text-emerald-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2"
              >
                {pillar.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <section className="bg-surface-sunken px-gutter py-20 sm:py-28" aria-labelledby="featured-idea-title">
        <div className="mx-auto grid max-w-frame gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(22rem,0.75fr)] lg:items-center lg:gap-16">
          <Link
            href={`/ideas/${featured.slug}`}
            aria-label={`Read ${featured.title}`}
            className="relative block aspect-[16/10] overflow-hidden rounded-frame bg-line-whisper shadow-elevation-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-4 focus-visible:ring-offset-surface-sunken"
          >
            <Image
              src={featured.hero.src}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 62vw, 92vw"
              className="object-cover"
              style={{ objectPosition: featured.hero.objectPosition }}
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-hero-ground/25 to-transparent" />
          </Link>

          <article>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-gold-ink">Sample article</p>
            <p className="mt-5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-emerald-ink">{featuredPillar.label}</p>
            <h2 id="featured-idea-title" className="mt-3 text-balance font-display text-4xl font-semibold text-text sm:text-5xl">
              <Link href={`/ideas/${featured.slug}`} className="decoration-gold/60 underline-offset-[0.14em] hover:underline focus-visible:outline-none focus-visible:underline">
                {featured.title}
              </Link>
            </h2>
            <p className="mt-5 text-xl text-text-subdued">{featured.dek}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.08em] text-text-faint">
              <span>Adeseun Oyeneye</span>
              <span aria-hidden="true">·</span>
              <time dateTime={featured.publishedAt}>{formatIdeaDate(featured.publishedAt)}</time>
              <span aria-hidden="true">·</span>
              <span>{articleReadingMinutes(featured)} min read</span>
            </div>
            <Link
              href={`/ideas/${featured.slug}`}
              className="mt-8 inline-flex min-h-11 items-center gap-3 rounded-control bg-emerald-fill px-6 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-text-on-dark transition-colors hover:bg-emerald-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-4"
            >
              View the article layout
              <ArrowRight aria-hidden="true" size={17} weight="light" />
            </Link>
          </article>
        </div>
      </section>

      {latest.length || notebook.length ? (
        <section className="bg-ground px-gutter py-room" aria-labelledby="latest-ideas-title">
          <div className="mx-auto max-w-frame">
            <div className="flex items-end justify-between gap-8 border-b border-line pb-6">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-gold-ink">Recently in The Study</p>
                <h2 id="latest-ideas-title" className="mt-3 font-display text-4xl font-semibold text-text sm:text-5xl">Latest ideas</h2>
              </div>
              <span className="hidden font-mono text-xs uppercase tracking-[0.1em] text-text-faint sm:block">{IDEA_ARTICLES.length} essays</span>
            </div>

            <div className="mt-10 grid gap-x-10 gap-y-16 xl:grid-cols-2">
              {latest.map((article) => (
                <ArticleCard key={article.slug} article={article} headingLevel="h3" />
              ))}
            </div>

            {notebook.length ? (
              <div className="mt-20 border-t border-line pt-8">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-gold-ink">From the notebook</p>
                <div className="mt-8 grid gap-10 md:grid-cols-2">
                  {notebook.map((article) => (
                    <ArticleCard key={article.slug} article={article} variant="compact" headingLevel="h3" />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="bg-surface-sunken px-gutter py-room" aria-labelledby="explore-ideas-title">
        <div className="mx-auto max-w-frame">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-gold-ink">A growing body of thought</p>
            <h2 id="explore-ideas-title" className="mt-3 font-display text-4xl font-semibold text-text sm:text-5xl">Explore by idea</h2>
          </div>

          <div className="mt-12 grid gap-x-12 gap-y-16 lg:grid-cols-2">
            {activePillars.map((pillar) => {
              const articles = IDEA_ARTICLES.filter((article) => article.pillar === pillar.slug);
              return (
                <section key={pillar.slug} id={pillar.slug} className="scroll-mt-32 border-t border-line pt-6" aria-labelledby={`${pillar.slug}-title`}>
                  <h3 id={`${pillar.slug}-title`} className="font-display text-3xl font-semibold text-text">{pillar.label}</h3>
                  <p className="mt-3 max-w-xl text-lg text-text-subdued">{pillar.description}</p>
                  <ul className="mt-8 divide-y divide-line-whisper">
                    {articles.map((article) => (
                      <li key={article.slug}>
                        <Link
                          href={`/ideas/${article.slug}`}
                          className="flex min-h-16 items-center justify-between gap-5 py-4 text-lg text-text transition-colors hover:text-emerald-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2"
                        >
                          <span>{article.title}</span>
                          <ArrowRight aria-hidden="true" className="shrink-0 text-gold-ink" size={18} weight="light" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-hero-ground px-gutter py-24 text-center text-text-on-dark" aria-labelledby="study-letter-title">
        <div className="mx-auto max-w-2xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-gold">A considered note</p>
          <h2 id="study-letter-title" className="mt-4 text-balance font-display text-4xl font-semibold sm:text-5xl">When there is something worth sending.</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-text-on-dark/75">
            Join the conversation through The Reception and choose writing and publishing as your area of interest.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex min-h-12 items-center rounded-control border border-gold px-7 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-text-on-dark transition-colors hover:bg-gold-tint hover:text-gold-fill focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-hero-ground"
          >
            Receive the next note
          </Link>
        </div>
      </section>
    </>
  );
}
