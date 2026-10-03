import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, EnvelopeSimple, LinkedinLogo } from "@phosphor-icons/react/dist/ssr";
import {
  AUTHOR,
  articleReadingMinutes,
  formatIdeaDate,
  getIdeaPillar,
  getRelatedIdeas,
  type IdeaArticle,
} from "@/content/ideas/articles";
import { SITE_URL } from "@/lib/seo";
import { ArticleCard } from "./ArticleCard";

export function IdeaArticlePage({ article }: { article: IdeaArticle }) {
  const pillar = getIdeaPillar(article.pillar);
  const related = getRelatedIdeas(article);
  const articleUrl = new URL(`/ideas/${article.slug}`, SITE_URL).toString();
  const shareText = encodeURIComponent(article.title);
  const shareUrl = encodeURIComponent(articleUrl);
  const hasMeaningfulUpdate = article.modifiedAt !== article.publishedAt;
  const sourceNumber = (url: string) => article.references.findIndex((reference) => reference.url === url) + 1;

  return (
    <article>
      <header className="bg-ground px-gutter pb-16 pt-36 sm:pb-20 sm:pt-44">
        <div className="mx-auto max-w-frame">
          <nav aria-label="Breadcrumb" className="font-mono text-xs uppercase tracking-[0.1em] text-text-faint">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="hover:text-emerald-ink focus-visible:outline-none focus-visible:underline">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/ideas" className="hover:text-emerald-ink focus-visible:outline-none focus-visible:underline">Blog</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-text-subdued" aria-current="page">{pillar.label}</li>
            </ol>
          </nav>

          <div className="mt-12 max-w-5xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-emerald-ink">{pillar.label}</p>
            <h1 className="mt-5 max-w-5xl text-balance font-display text-5xl font-semibold text-text sm:text-6xl lg:text-7xl">{article.title}</h1>
            <p className="mt-7 max-w-3xl text-xl leading-relaxed text-text-subdued sm:text-2xl">{article.dek}</p>

            <div className="mt-10 flex flex-col gap-5 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Link href={AUTHOR.url} className="group inline-flex items-center gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-4">
                <span className="relative h-12 w-12 overflow-hidden rounded-full border border-line bg-surface-sunken">
                  <Image src={AUTHOR.image} alt="" fill sizes="48px" className="object-cover object-top" />
                </span>
                <span>
                  <span className="block font-mono text-xs uppercase tracking-[0.1em] text-text-faint">Written by</span>
                  <span className="mt-1 block text-lg text-text group-hover:text-emerald-ink">{AUTHOR.name}</span>
                </span>
              </Link>

              <div className="flex flex-wrap gap-x-3 gap-y-2 font-mono text-xs uppercase tracking-[0.08em] text-text-faint">
                <span>Published <time dateTime={article.publishedAt}>{formatIdeaDate(article.publishedAt)}</time></span>
                {hasMeaningfulUpdate ? <span>Updated <time dateTime={article.modifiedAt}>{formatIdeaDate(article.modifiedAt)}</time></span> : null}
                <span>{articleReadingMinutes(article)} min read</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <figure className="bg-surface-sunken px-gutter py-8 sm:py-12">
        <div className="mx-auto max-w-frame">
          <div className="relative aspect-[16/9] overflow-hidden rounded-frame bg-line-whisper">
            <Image
              src={article.hero.src}
              alt={article.hero.alt}
              fill
              priority
              sizes="(min-width: 1440px) 1400px, 100vw"
              className="object-cover"
              style={{ objectPosition: article.hero.objectPosition }}
            />
          </div>
          <figcaption className="mt-3 max-w-prose-gallery text-sm italic text-text-faint">{article.hero.caption}</figcaption>
        </div>
      </figure>

      <div className="bg-ground px-gutter py-20 sm:py-28">
        <div className="mx-auto grid max-w-frame gap-12 xl:grid-cols-[7rem_minmax(0,44rem)_14rem] xl:justify-center xl:gap-14">
          <aside aria-label="Share this article" className="hidden xl:block">
            <div className="sticky top-28 border-t border-line pt-4">
              <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-text-faint">Share</p>
              <div className="mt-4 flex flex-col gap-2">
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Share on LinkedIn"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-text-subdued hover:border-emerald hover:text-emerald-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
                >
                  <LinkedinLogo aria-hidden="true" size={18} weight="light" />
                </a>
                <a
                  href={`mailto:?subject=${shareText}&body=${shareUrl}`}
                  aria-label="Share by email"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-text-subdued hover:border-emerald hover:text-emerald-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
                >
                  <EnvelopeSimple aria-hidden="true" size={18} weight="light" />
                </a>
              </div>
            </div>
          </aside>

          <div className="min-w-0">
            <div className="border-l-2 border-emerald bg-emerald-tint px-6 py-7 sm:px-8">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-emerald-ink">The central idea</p>
              <p className="mt-3 font-display text-2xl leading-snug text-text sm:text-3xl">{article.keyIdea}</p>
            </div>

            <div className="idea-prose mt-12">
              {article.introduction.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}

              {article.inspiredBy ? (
                <aside className="my-10 border-y border-gold/40 bg-gold-tint/40 px-6 py-7" aria-label={`Inspired by ${article.inspiredBy.title}`}>
                  <p className="!m-0 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">In conversation with the book</p>
                  <h2 className="!mb-0 !mt-3 !text-3xl">{article.inspiredBy.title}</h2>
                  <p className="!mb-0 !mt-3">{article.inspiredBy.description}</p>
                  <Link
                    href={article.inspiredBy.href}
                    className="mt-5 inline-flex min-h-11 items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-emerald-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-4"
                  >
                    Explore the book <ArrowRight aria-hidden="true" size={16} weight="light" />
                  </Link>
                </aside>
              ) : null}

              <nav aria-label="On this page" className="idea-mobile-toc">
                <p>On this page</p>
                <ol>
                  {article.sections.map((section) => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}
                  {article.references.length ? <li><a href="#sources-and-reading">Sources and further reading</a></li> : null}
                </ol>
              </nav>

              {article.sections.map((section) => (
                <section key={section.id} aria-labelledby={section.id}>
                  <h2 id={section.id}>{section.title}</h2>
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {section.image ? (
                    <figure className="my-10">
                      <div className="overflow-hidden rounded-frame bg-surface-sunken">
                        <Image
                          src={section.image.src}
                          alt={section.image.alt}
                          width={section.image.width}
                          height={section.image.height}
                          sizes="(min-width: 1280px) 704px, 92vw"
                          className="h-auto w-full"
                        />
                      </div>
                      <figcaption className="mt-3 font-body text-sm italic leading-relaxed text-text-faint">{section.image.caption}</figcaption>
                    </figure>
                  ) : null}
                  {section.list ? <ul>{section.list.map((item) => <li key={item}>{item}</li>)}</ul> : null}
                  {section.quote ? <blockquote><p>{section.quote}</p></blockquote> : null}
                  {section.sourceUrls?.length ? (
                    <p className="!mt-6 border-t border-line-whisper pt-3 font-mono !text-xs uppercase tracking-[0.08em] text-text-faint">
                      Evidence and further reading:{" "}
                      {section.sourceUrls.map((url, index) => {
                        const reference = article.references.find((candidate) => candidate.url === url);
                        return (
                          <span key={url}>
                            {index ? ", " : ""}
                            <a href={url} target="_blank" rel="noreferrer" aria-label={`Source ${sourceNumber(url)}: ${reference?.title ?? url}`}>
                              [{sourceNumber(url)}]
                            </a>
                          </span>
                        );
                      })}
                    </p>
                  ) : null}
                </section>
              ))}

              <h2 id="a-final-thought">A final thought</h2>
              <p>{article.conclusion}</p>

              {article.internalLinks?.length ? (
                <section aria-labelledby="continue-exploring">
                  <h2 id="continue-exploring">Continue exploring</h2>
                  <div className="mt-6 grid gap-4">
                    {article.internalLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="group block rounded-frame border border-line px-5 py-5 no-underline transition-colors hover:border-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-4"
                      >
                        <span className="flex items-center justify-between gap-4 font-display text-xl font-semibold text-text">
                          {item.title}
                          <ArrowRight aria-hidden="true" size={18} weight="light" className="shrink-0 text-emerald-ink transition-transform group-hover:translate-x-1" />
                        </span>
                        <span className="mt-2 block text-base leading-relaxed text-text-subdued">{item.description}</span>
                      </Link>
                    ))}
                  </div>
                </section>
              ) : null}

              {article.references.length ? (
                <section aria-labelledby="sources-and-reading">
                  <h2 id="sources-and-reading">Sources and further reading</h2>
                  <ol className="mt-6 space-y-5 pl-5 text-base leading-relaxed text-text-subdued">
                    {article.references.map((reference) => (
                      <li key={reference.url}>
                        <a href={reference.url} target="_blank" rel="noreferrer" className="font-semibold text-text">
                          {reference.title}
                        </a>
                        <span className="block text-sm text-text-faint">
                          {reference.authors}. {reference.publication}, {reference.year}.
                        </span>
                      </li>
                    ))}
                  </ol>
                </section>
              ) : null}
            </div>

            <div className="mt-14 flex items-center justify-between gap-6 border-y border-line py-5 xl:hidden">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-text-faint">Share this idea</span>
              <div className="flex gap-2">
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noreferrer" aria-label="Share on LinkedIn" className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-text-subdued focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"><LinkedinLogo aria-hidden="true" size={18} /></a>
                <a href={`mailto:?subject=${shareText}&body=${shareUrl}`} aria-label="Share by email" className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-text-subdued focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"><EnvelopeSimple aria-hidden="true" size={18} /></a>
              </div>
            </div>
          </div>

          <aside aria-label="On this page" className="hidden xl:block">
            <div className="sticky top-28 border-t border-line pt-4">
              <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-text-faint">On this page</p>
              <ol className="mt-4 flex flex-col gap-3 text-sm text-text-subdued">
                {article.sections.map((section, index) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className="group flex gap-3 hover:text-emerald-ink focus-visible:outline-none focus-visible:underline">
                      <span className="font-mono text-[0.65rem] text-gold-ink">{String(index + 1).padStart(2, "0")}</span>
                      <span>{section.title}</span>
                    </a>
                  </li>
                ))}
                {article.references.length ? (
                  <li>
                    <a href="#sources-and-reading" className="group flex gap-3 hover:text-emerald-ink focus-visible:outline-none focus-visible:underline">
                      <span className="font-mono text-[0.65rem] text-gold-ink">{String(article.sections.length + 1).padStart(2, "0")}</span>
                      <span>Sources and further reading</span>
                    </a>
                  </li>
                ) : null}
              </ol>
            </div>
          </aside>
        </div>
      </div>

      <section className="bg-surface-sunken px-gutter py-20" aria-labelledby="about-author-title">
        <div className="mx-auto grid max-w-frame gap-8 border-y border-line py-10 md:grid-cols-[10rem_minmax(0,42rem)] md:items-center md:justify-center">
          <div className="relative aspect-square w-36 overflow-hidden rounded-full border border-line bg-surface md:w-40">
            <Image src={AUTHOR.image} alt={`Portrait of ${AUTHOR.name}`} fill sizes="160px" className="object-cover object-top" />
          </div>
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-gold-ink">About the author</p>
            <h2 id="about-author-title" className="mt-2 font-display text-3xl font-semibold text-text">{AUTHOR.name}</h2>
            <p className="mt-2 text-sm uppercase tracking-[0.04em] text-text-faint">{AUTHOR.role}</p>
            <p className="mt-4 text-lg text-text-subdued">{AUTHOR.bio}</p>
            <Link href={AUTHOR.url} className="mt-5 inline-flex min-h-11 items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-emerald-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-4">
              Read her full profile <ArrowRight aria-hidden="true" size={16} weight="light" />
            </Link>
          </div>
        </div>
      </section>

      {related.length ? (
        <section className="bg-ground px-gutter py-room" aria-labelledby="related-ideas-title">
          <div className="mx-auto max-w-frame">
            <div className="flex items-end justify-between gap-8 border-b border-line pb-6">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-gold-ink">Continue through the blog</p>
                <h2 id="related-ideas-title" className="mt-3 font-display text-4xl font-semibold text-text sm:text-5xl">Related ideas</h2>
              </div>
              <Link href="/ideas" className="hidden min-h-11 items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-emerald-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald sm:inline-flex">
                All ideas <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
            <div className="mt-10 grid gap-12 lg:grid-cols-3">
              {related.map((candidate) => <ArticleCard key={candidate.slug} article={candidate} variant="compact" headingLevel="h3" />)}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-hero-ground px-gutter py-24 text-center text-text-on-dark" aria-labelledby="article-cta-title">
        <div className="mx-auto max-w-2xl">
          <h2 id="article-cta-title" className="text-balance font-display text-4xl font-semibold sm:text-5xl">Continue the conversation.</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-text-on-dark/75">For a speaking invitation, advisory conversation, publishing enquiry, or considered note.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/contact" className="inline-flex min-h-12 items-center rounded-control bg-emerald px-7 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-text-on-dark hover:bg-emerald-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-hero-ground">Visit The Reception</Link>
            <Link href="/ideas" className="inline-flex min-h-12 items-center gap-2 rounded-control border border-text-on-dark/30 px-7 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-text-on-dark hover:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-hero-ground"><ArrowLeft aria-hidden="true" size={16} /> Back to the blog</Link>
          </div>
        </div>
      </section>
    </article>
  );
}
