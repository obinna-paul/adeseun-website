# The Study: Blog UX, Content, and Advanced SEO Plan

**Site:** Adeseun Oyeneye

**Recommended section name:** The Study

**Recommended route:** `/ideas`

**Planning date:** 2 October 2026

**Primary market:** Nigeria, with a global English-speaking audience

**Scope:** Blog information architecture, listing page, article template, author system, content model, structured data, crawl/indexation, sitemaps, performance, accessibility, editorial governance, measurement, and delivery roadmap.

## 1. Executive recommendation

Build the blog as **The Study**, described in navigation as **Ideas & Essays**, at `/ideas`. It should feel like the editorial wing of Adeseun Oyeneye's existing personal headquarters: quiet, authoritative, warm, and spacious rather than like a generic magazine or news feed.

The experience should have two primary templates:

1. A curated editorial landing page that leads with one significant article, then presents recent and evergreen writing in a clear hierarchy.
2. A distraction-light article page with strong typography, a visible byline and dates, an optional table of contents, source notes, an author biography, related reading, and a single relevant conversion path.

The technical model should extend the existing Next.js App Router, self-hosted font system, Metadata API, JSON-LD helpers, robots route, and programmatic sitemap. The repository already anticipates `content/journal/*.mdx` with MDX and Velite; that is the appropriate first publishing system. Sanity should only replace or supplement it if a non-technical editorial team must publish without Git.

The SEO strategy is not “publish on every keyword.” It is to build topical authority around Adeseun's demonstrated experience: leadership and enterprise, African media and storytelling, architecture and design, and purpose-led communication. Every article should add first-hand insight, a useful framework, an example, original imagery, or a considered point of view that a generic summary cannot reproduce.

## 2. Existing site evidence and implications

This plan is based on the repository, not a generic blog template.

| Existing evidence | Design or SEO implication |
| --- | --- |
| “Ivory Atrium & Emerald Brass” tokens in `app/styles/tokens.css` | Reuse warm ivory, deep emerald, terracotta, brass, thin rules, near-square frames, and the single dark chrome register. Do not create a separate blog theme or dark mode. |
| Cormorant Garamond, EB Garamond, and IBM Plex Mono are self-hosted in `lib/fonts.ts` | Use Cormorant for editorial display, EB Garamond for long reading, and IBM Plex Mono for metadata and controls. No new font is needed. |
| The site uses a “personal headquarters”/building metaphor | “The Study” is the natural room for essays and ideas. It also restores a name already anticipated in the content architecture without conflicting with “The Blueprint” about page. |
| `content/README.md` already reserves `content/journal/*.mdx` | Use MDX plus a validated content schema for launch. This preserves editorial review, history, and server-rendered output. |
| `lib/seo.ts` already centralizes canonical, Open Graph, and Twitter metadata | Extend it with article metadata and stable entity IDs instead of hand-writing head tags in each article. |
| `app/sitemap.ts` currently gives every URL `lastModified: new Date()` | Replace synthetic “now” dates with real modification dates. A sitemap must not imply every page changes on every build. |
| `app/robots.ts` and the root sitemap already exist | Add blog URLs to the same controlled crawl system; do not add a second SEO plugin or conflicting robots file. |
| Most public pages are React Server Components, with client components at interactive leaves | Keep article text, metadata, schema, breadcrumbs, cards, and pagination server-rendered. Use client JavaScript only where it adds real value. |
| The canonical site URL is still a predicted Vercel subdomain in `lib/seo.ts` | Confirm the production domain before launch. Incorrect canonicals, schema URLs, social URLs, and sitemap URLs would undermine the entire release. |

## 3. Naming and route architecture

### Recommended public naming

- **Navigation label:** The Study
- **Navigation note:** Ideas & essays
- **Page H1:** Ideas for building what matters.
- **Page eyebrow:** The Study
- **Route:** `/ideas`
- **Article route:** `/ideas/[slug]`
- **Topic route when justified:** `/ideas/topic/[topic]`
- **Archive pagination:** `/ideas/page/[page]`
- **Author profile:** use the existing `/about` page after making it a genuine author profile and adding `ProfilePage` schema.

`/blog` may be familiar, but `/ideas` fits the site's existing executive positioning and accommodates essays, field notes, frameworks, and commentary without promising a newsroom cadence. If `/blog` is ever exposed, it should 301 redirect to `/ideas`; there must be only one indexable home for the content.

### URL rules

- Use short, lowercase, hyphenated, permanent slugs: `/ideas/designing-spaces-that-shape-behaviour`.
- Do not include dates, categories, or `.html` in article URLs.
- Do not change a slug after publication unless necessary; when changed, use a one-hop 301 redirect and update all internal links.
- All indexable pages get self-referencing canonical URLs.
- Tracking parameters must canonicalize to the clean article URL.
- Do not expose multiple paths for the same article through categories or tags.

### Taxonomy

Launch with four editorial pillars:

| Pillar | Scope | Natural connections to the site |
| --- | --- | --- |
| Leadership & Enterprise | Building organisations, creative leadership, governance, teams, execution, entrepreneurship | The Atrium, The Boardroom, speaking and advisory inquiries |
| Media & African Stories | African narratives, media leadership, cultural preservation, platform-building | The Screening Room, media ventures, talks |
| Architecture & Design | Architecture, interiors, spatial thinking, design as a business and human tool | Future architecture portfolio, The Blueprint |
| Purpose, Communication & Relationships | Thoughtful communication, identity, faith, resilience, relationships, mentorship | The Library, The Foundation, relevant books |

These are editorial hypotheses based on the existing site. Keyword demand, SERP intent, and competitor overlap must be researched before assigning primary search queries.

Avoid a large tag cloud. A topic archive should only become indexable when it has a useful introduction and at least five strong articles. Until then, topics can be metadata and filters on `/ideas` without generating thin URLs. Internal search pages, filter combinations, preview URLs, and drafts should be `noindex` and excluded from sitemaps.

## 4. Blog landing page: information architecture

The page should read as a curated journal, not a wall of identical cards.

### Desktop structure

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Fixed dark global header                                            │
├──────────────────────────────────────────────────────────────────────┤
│ THE STUDY                                                           │
│ Ideas for building what matters.                                    │
│ Short editorial introduction                          [Topic nav]    │
├──────────────────────────────────────────────────────────────────────┤
│ FEATURED ESSAY                                                      │
│ 60% image or art-directed visual │ 40% category, H2, dek, byline    │
│                                  │ date, reading time, text link     │
├──────────────────────────────────────────────────────────────────────┤
│ LATEST                                                              │
│ Lead latest story (large)    │ Story card       │ Story card         │
│                              │ Story card       │ Story card         │
├──────────────────────────────────────────────────────────────────────┤
│ FROM THE NOTEBOOK                                                   │
│ Compact text-led entries separated by brass rules                   │
├──────────────────────────────────────────────────────────────────────┤
│ EXPLORE BY IDEA                                                     │
│ Four editorial pillars with a sentence and 2–3 article links        │
├──────────────────────────────────────────────────────────────────────┤
│ Newsletter band: “A considered note, when there is one to send.”    │
├──────────────────────────────────────────────────────────────────────┤
│ Numbered pagination / Older essays                                  │
├──────────────────────────────────────────────────────────────────────┤
│ Global dark footer                                                  │
└──────────────────────────────────────────────────────────────────────┘
```

### Mobile structure

1. Compact page introduction below the fixed header.
2. Horizontally scrollable topic chips with normal crawlable links.
3. Featured article as image, label, title, excerpt, and metadata in one column.
4. Latest articles as a vertical list; alternate image-led and text-led entries to avoid visual monotony.
5. Pillar links as an accordion only if the links remain present in rendered HTML; otherwise use a simple stacked list.
6. Newsletter band.
7. Previous/next pagination with a short numbered set.

### Listing hierarchy and card behaviour

- **One featured story:** chosen editorially; it is not automatically the newest article.
- **Latest:** reverse chronological, 6–9 articles on the first page.
- **Notebook entries:** optional shorter pieces, clearly labelled by format; they still require useful standalone pages.
- **Pillar section:** curated, not generated solely from tags.
- **Pagination:** use crawlable `<a href>` links. Do not rely on infinite scroll. If “Load more” is added for convenience, every batch must also have a stable paginated URL.
- **Whole-card interaction:** the title is the primary link. An optional image link may point to the same URL. Do not wrap a card containing multiple controls in one oversized anchor.
- **Link wording:** use the article title or a descriptive phrase instead of repeated “Read more” links.

### Article card anatomy

Each card contains:

1. A reserved-ratio image to prevent layout shift.
2. Pillar label in IBM Plex Mono.
3. Article title as an H2 or H3 according to page hierarchy.
4. A one- or two-sentence deck, capped by layout rather than hidden from crawlers.
5. “Adeseun Oyeneye · 2 Oct 2026 · 7 min read.”
6. A visible focus state, restrained image scale on hover, and no essential information that appears only on hover.

## 5. Article page: information architecture

### Desktop structure

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Fixed dark global header                                            │
├──────────────────────────────────────────────────────────────────────┤
│ Home / The Study / Leadership & Enterprise                          │
│ PILLAR LABEL                                                        │
│ H1: Article title across a generous editorial measure               │
│ Dek: what the reader will understand or be able to do               │
│ [portrait] By Adeseun Oyeneye                                       │
│ Published 2 Oct 2026 · Updated 12 Oct 2026 · 8 min read             │
├──────────────────────────────────────────────────────────────────────┤
│ Wide hero image                                                     │
│ Caption and photographer/illustrator credit                         │
├──────────────────────────────────────────────────────────────────────┤
│ Meta rail        │ Article body, max 62–68ch │ Sticky contents      │
│ Save/share       │ Answer-first opening       │ on long articles     │
│                  │ H2 / H3 sections           │                      │
│                  │ figures, quotes, tables    │                      │
│                  │ sources and update note    │                      │
├──────────────────────────────────────────────────────────────────────┤
│ Author biography and credentials                                    │
├──────────────────────────────────────────────────────────────────────┤
│ Related ideas: 3 contextually selected articles                     │
├──────────────────────────────────────────────────────────────────────┤
│ One contextual CTA: newsletter, book, talk, or advisory—not all     │
├──────────────────────────────────────────────────────────────────────┤
│ Global footer                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

The left and right rails disappear below approximately 1100 px. The table of contents moves into a compact “On this page” block after the introduction. Share controls move below the byline or at the article end. The central reading measure does not widen.

### Article sequence

1. Breadcrumbs.
2. Pillar label.
3. One H1.
4. A concise deck/dek that states the article's value.
5. Author byline linked to `/about`.
6. Visible publication date; show a modified date only after a meaningful revision.
7. Estimated reading time as a convenience, not a trust substitute.
8. Representative hero image with meaningful alt text, caption, and credit when applicable.
9. Answer-first introduction or key takeaway.
10. Optional table of contents when there are at least four substantial H2 sections or the article is approximately 1,500+ words.
11. Main article body with H2/H3 hierarchy.
12. “Sources and further reading” for cited claims.
13. Optional methodology, disclosure, or correction note.
14. Author biography.
15. Three related articles selected for topical usefulness, not merely recency.
16. One contextual conversion.

### Reading experience

- Provide stable heading IDs and linkable sections.
- Keep paragraphs mostly 2–4 sentences; let complex ideas be complex without creating walls of text.
- Use pull quotes only for memorable original lines, never for generic decoration.
- Use callouts sparingly: “Key idea,” “From experience,” “Example,” and “Practical next step.”
- Tables need captions or a short introduction and must scroll safely on small screens.
- Footnotes or endnotes are appropriate for research-heavy essays; ordinary source links should remain contextual.
- Do not interrupt the first third of the article with newsletter pop-ups or purchase banners.
- Reading progress may remain, but it must not obscure the page, announce unnecessary live updates, or add heavy client-side work.

## 6. Visual system and typography

### Brand application

| Role | Existing token/family | Blog use |
| --- | --- | --- |
| Page ground | `--color-ground` | Default article and index background |
| Elevated surface | `--color-surface` | Author bio, subtle cards, newsletter form |
| Section contrast | `--color-surface-sunken` | Featured/curated bands, not every other block |
| Primary accent | Emerald | Links, focus rings, active topics, primary CTA |
| Secondary accent | Terracotta | Occasional editorial callout or hover; never a competing primary color |
| Detail accent | Brass/gold | Rules, eyebrows, metadata ornaments, small details only |
| Display | Cormorant Garamond | H1–H3, pull quotes, article/card titles |
| Reading | EB Garamond | Decks, paragraphs, lists, captions, author bio |
| Utility | IBM Plex Mono | Dates, categories, reading time, filters, breadcrumbs |

Brass must not be used for small body text until its contrast has been re-measured. The token file itself notes that the current palette's WCAG ratios have not yet been re-verified. Treat that as a launch gate.

### Recommended article type scale

| Element | Desktop | Mobile | Notes |
| --- | --- | --- | --- |
| H1 | existing `text-5xl` to `text-6xl` | `text-4xl` | Cormorant, 600, balanced wrap, max 18–22 words preferred |
| Deck | 22–26 px | 19–22 px | EB Garamond, subdued, max 50–60ch |
| Body | 20–22 px | 18–20 px | EB Garamond, line-height 1.6–1.72, max 62–68ch |
| H2 | 34–44 px | 30–36 px | Cormorant, 600, generous top margin |
| H3 | 25–32 px | 23–28 px | Cormorant, 600 |
| Metadata | 11–13 px | 11–12 px | IBM Plex Mono, modest uppercase tracking |
| Caption | 14–16 px | 14–15 px | EB Garamond, subdued; credit distinct but readable |

Use the existing fluid scale instead of hard-coded pixels in components. Add semantic/component aliases only where the editorial templates need stable meaning, for example `--article-measure`, `--article-body-size`, `--article-rule`, and `--article-callout-bg`.

### Image direction

The image language should be documentary and architectural: real work, spaces, materials, marked-up plans, books, people in context, objects with personal meaning, and restrained editorial illustrations. Avoid generic corporate stock imagery.

- Primary article art: master file at least 1600 px wide.
- Generate or art-direct 16:9, 4:3, and 1:1 crops for article structured data and sharing.
- Store intrinsic width and height and render through `next/image`.
- Use short, descriptive file names.
- Alt text describes the image in the article's context; decorative images get empty alt text.
- Put captions and credits in visible HTML.
- Preserve natural texture; avoid heavy overlays that compromise legibility or flatten photography.

## 7. Reusable component inventory

Build the feature from small server-first components:

- `StudyHero`
- `TopicNavigation`
- `FeaturedArticle`
- `ArticleCard` with image-led and text-led variants
- `ArticleListItem`
- `ArchivePagination`
- `Breadcrumbs`
- `ArticleHeader`
- `AuthorByline`
- `ArticleHeroImage`
- `ArticleBody`
- `TableOfContents`
- `EditorialCallout`
- `PullQuote`
- `FigureWithCaption`
- `SourceList`
- `AuthorBio`
- `RelatedArticles`
- `NewsletterCTA`
- `ArticleShareLinks`

For each component, define default, hover, focus-visible, active, loading, empty, and error behaviour. Keep buttons and chips at least 44 × 44 CSS px where they are interactive. Article cards and links must remain fully usable with a keyboard and without motion.

## 8. Content model

Use a validated MDX front matter schema. The exact library can be Velite, as the repository already proposes, or an equivalent build-time content layer.

```yaml
title: "A precise, reader-facing article title"
slug: "precise-article-slug"
dek: "One or two sentences that explain the value of the article."
seoTitle: "Optional title override for search"
seoDescription: "Unique summary written for this page"
publishedAt: "2026-10-02T09:00:00+01:00"
modifiedAt: "2026-10-02T09:00:00+01:00"
author: "adeseun-oyeneye"
pillar: "leadership-enterprise"
topics:
  - "creative leadership"
format: "essay"
featured: false
status: "published"
canonical: null
noindex: false
hero:
  src: "/images/ideas/precise-article-slug/hero.jpg"
  alt: "Contextual description of the image"
  caption: "Optional visible caption"
  credit: "Photographer or illustrator"
  width: 1920
  height: 1080
related:
  - "another-article-slug"
sources:
  - label: "Source title"
    url: "https://authoritative.example/source"
```

Generate the following rather than asking an editor to maintain them manually:

- reading time;
- word count;
- heading table of contents;
- absolute canonical URL;
- JSON-LD image variants;
- RSS entry;
- sitemap entry;
- article archive placement.

Validation should fail the build for duplicate slugs, missing title/dek/date/author/hero alt text, invalid dates, future publication dates in production, broken internal related slugs, and published posts without an SEO description.

## 9. Metadata plan

Use `generateMetadata` in `app/ideas/[slug]/page.tsx`, backed by the same validated article object used to render the page. Critical metadata should resolve server-side and be present in the delivered HTML.

Each article must provide:

- unique `<title>`: normally `Article title — Adeseun Oyeneye`;
- unique meta description that accurately summarizes the whole article;
- self-referencing absolute canonical;
- Open Graph `type: article`;
- Open Graph title, description, URL, image, published time, modified time, author, and relevant tags;
- Twitter/X large-image card fields;
- `robots` set to index/follow for published articles;
- `googleBot` preview directives allowing large image and unrestricted snippet/video previews unless a policy requires otherwise;
- article-specific generated Open Graph image, with a deterministic fallback to the editorial hero crop;
- `notFound()` for unknown or unpublished slugs so a draft cannot return a soft 404.

Do not treat character counts as hard Google limits. Titles and descriptions should be concise enough to survive device-dependent truncation, but accuracy and distinctiveness matter more than forcing text into a fixed number.

Use `en-NG` for the document or article language if the editorial standard is Nigerian English. The existing `openGraph.locale: en_US` should be reviewed for consistency with the real audience and writing style.

## 10. Structured data architecture

Structured data describes truthful visible content; it does not guarantee a rich result or improve rankings by itself.

### Stable entity graph

Use durable `@id` values so the site refers to the same entities on every page:

- `https://production-domain.example/#website` — `WebSite`
- `https://production-domain.example/#adeseun` — `Person`
- `https://production-domain.example/about/#profile` — `ProfilePage`
- article URL plus `#article` — `BlogPosting`
- article URL plus `#webpage` — `WebPage`
- article URL plus `#primaryimage` — `ImageObject`
- article URL plus `#breadcrumb` — `BreadcrumbList`

### Global and page-specific schema

| Page | Recommended schema |
| --- | --- |
| Home | `WebSite` and `Person`; add a preferred site name and verified `sameAs` profiles |
| About | `ProfilePage` with `mainEntity` referencing the same `Person` ID |
| The Study index | `CollectionPage` with an `ItemList` containing only the visible article cards |
| Article | `BlogPosting`, `WebPage`, `ImageObject`, and `BreadcrumbList`, connected with `@id` references |

### `BlogPosting` fields

Include:

- `headline`;
- `description`;
- `url` and `mainEntityOfPage`;
- `datePublished` and truthful `dateModified` with timezone;
- `author` referencing the `Person` ID and profile URL;
- `publisher` referencing the truthful publisher entity;
- `image` with crawlable high-resolution 16:9, 4:3, and 1:1 versions;
- `inLanguage`;
- `articleSection`;
- `keywords` as a concise list of real topics, not a stuffed keyword field;
- `wordCount`;
- `isPartOf` referencing the website or blog collection;
- `about`, `mentions`, or `citation` only when the article visibly supports them.

The author name, dates, headline, image, and other schema claims must match the visible page. Point the author to `/about`, include a real portrait and credentials there, and populate `sameAs` only with confirmed public profiles.

Do not add `FAQPage` merely because an article has question headings; Google's FAQ rich-result eligibility is restricted. Do not add deprecated `HowTo` rich-result markup. Validate initial templates and samples with Schema.org Validator, Google's Rich Results Test, and Search Console URL Inspection.

## 11. Author byline, profile, and trust system

### Compact byline

Show directly below the deck:

- circular or softly framed 40–48 px portrait;
- “By Adeseun Oyeneye,” linked to `/about`;
- visible publication date in a `<time datetime>` element;
- visible modified date only for substantive revisions;
- reading time;
- optional editorial role or one relevant credential, not a résumé line.

### Author biography

Place a 80–130 word bio after the article. It should state why Adeseun is qualified to address the article's subject, adapting one sentence to the pillar where appropriate. Include a portrait, a link to the full profile, and only verified social or professional profile links.

The `/about` page should become the canonical author entity page by adding:

- a plain-language professional biography near the top;
- current roles and areas of experience;
- selected evidence of work and publications;
- verified profile links;
- contact/editorial policy links where appropriate;
- `ProfilePage` schema connected to the existing `Person` entity.

### Editorial trust pages

Add small, durable pages before scaling output:

- `/editorial-policy` — authorship, review, source, AI-assistance, and correction practices;
- `/privacy` — analytics and newsletter data handling;
- `/terms` if legally appropriate;
- contact pathway for corrections.

If AI assists research, outlining, or editing, the accountable human author must review the work. Disclosure should reflect the actual process. Never present synthetic experience, quotes, projects, data, or credentials as first-hand fact.

## 12. On-page content standard

### Before writing

Every brief records:

- target reader and their job-to-be-done;
- primary search intent and likely page type;
- proposed primary query and semantic subtopics;
- what first-hand experience or original material the article adds;
- competing result formats and content gaps;
- conversion path;
- source plan;
- internal links to give and receive.

Use SERP-overlap research before deciding whether two similar queries need one article or separate articles. High-overlap queries belong on one strong page; do not manufacture near-duplicate posts.

### Article rules

- One descriptive H1.
- Use the primary subject naturally in the title, H1, opening, and relevant heading—not at a mechanical density.
- Answer the central question early, then earn depth with explanation and evidence.
- Match article length to intent and completeness. There is no universal SEO word count.
- Use H2 for major reader questions and H3 for subordinate ideas; never choose headings for visual size alone.
- Cite authoritative primary sources for factual, technical, financial, health, legal, or statistical claims.
- Link to relevant books, talks, businesses, profile evidence, and earlier essays where it genuinely helps the reader.
- Add original examples, images, frameworks, diagrams, or observations whenever possible.
- Provide a clear conclusion or next step, not a repetitive summary written for length.
- Check facts, links, names, dates, image rights, accessibility, and schema before publication.

### Internal linking model

- Every article links back to its relevant pillar hub once that hub exists.
- Pillar pages link to every principal article in the cluster.
- Each article should receive at least three contextual internal links over time.
- Add 2–5 useful contextual internal links per 1,000 words as a review heuristic, not a quota.
- Use concise, descriptive anchor text; avoid repeated “click here” and “read more.”
- Link related books, videos, businesses, speaking pages, or impact work where the subject makes that connection useful.
- Run a monthly orphan-page and broken-link check.

## 13. Search-oriented editorial roadmap

Do not publish all four pillars at equal volume on day one. Start where Adeseun has the strongest evidence and ability to contribute original insight, then expand based on Search Console data and audience response.

### Suggested launch set

Launch with 6–8 substantive articles so the page feels intentionally established:

1. One flagship leadership/enterprise essay.
2. One practical leadership framework.
3. One first-hand media/African storytelling essay.
4. One architecture/design essay with original project or process imagery.
5. One communication essay connected naturally to a book.
6. One purpose/mentorship essay.
7. One shorter field note.
8. One personal “why this Study exists” editorial.

These are formats, not final keyword titles. Confirm topics through query research and SERP analysis before commissioning them.

### Cluster model

For each chosen pillar:

1. Create one broad, enduring pillar guide or manifesto.
2. Add 3–6 narrower articles addressing distinct intents.
3. Link every spoke to the pillar and the pillar back to every spoke.
4. Add relevant spoke-to-spoke links.
5. Merge ideas when the same search results rank for both queries.
6. Review performance after 90 days before expanding the cluster.

### Formats that fit the brand

- Executive essays.
- Field notes from building companies, media, or spaces.
- Annotated frameworks and decision principles.
- Case reflections with lessons and evidence.
- Conversations/interviews with transcripts and clear attribution.
- Book-connected essays that stand alone rather than functioning as sales pages.
- Visual essays for architecture and design.

Avoid reactive trend posts, thin listicles, generic motivational articles, and programmatic city/keyword pages. The site's advantage is perspective and experience, not publication volume.

## 14. Sitemap, robots, feeds, and indexation

### Sitemap

At the current scale, keep one root `/sitemap.xml`. Splitting is unnecessary until scale or Search Console reporting makes separate sitemaps useful.

Include only URLs that are:

- canonical;
- published;
- indexable;
- HTTP 200;
- useful enough to appear in search.

For blog entries:

- use `modifiedAt` as `lastModified`, falling back to `publishedAt`;
- never set every article's modification date to the current build time;
- exclude drafts, previews, noindex pages, search results, filter combinations, and redirects;
- use absolute production URLs;
- remove reliance on `priority` and `changefreq` for Google—they are not meaningful prioritisation mechanisms;
- submit the sitemap through Google Search Console and Bing Webmaster Tools after the production domain is confirmed.

The existing static-page sitemap should also move from `new Date()` for every route to truthful per-page modification dates.

### Robots and page directives

- Keep public articles and their required image/CSS/JS resources crawlable.
- Use page-level `noindex` for drafts, previews, internal search, account/admin, and transaction-only pages.
- Do not use `robots.txt` as a substitute for `noindex`; a blocked URL can still be known without its content being crawled.
- Review `/admin`, `/checkout`, `/read`, preview, and development routes as a wider site indexation task before launch.
- Decide explicitly whether AI discovery crawlers should be allowed. If AI citation visibility is a goal, do not casually block browsing/user agents without understanding the trade-off.

### Discovery feeds

Add:

- `/feed.xml` with title, canonical article URL, summary, publication/modified dates, and author;
- an autodiscovery `<link rel="alternate" type="application/rss+xml">`;
- an optional JSON Feed only if a real reader or distribution need emerges.

An RSS feed helps discovery and subscribers, but it is not a substitute for crawlable HTML links and a sitemap.

## 15. Performance and Core Web Vitals

Target the “good” thresholds at the 75th percentile of real visits:

- LCP: **≤ 2.5 seconds**;
- INP: **≤ 200 ms**;
- CLS: **≤ 0.1**.

Implementation rules:

- Render article prose and listing content on the server.
- Keep the article template mostly free of client components.
- Use `next/image`, meaningful `sizes`, modern formats, fixed dimensions, and restrained quality settings.
- Prioritise only the real above-the-fold LCP image.
- Preserve the existing self-hosted `next/font/local` setup.
- Do not ship animation libraries merely for card hover or article reveals; CSS is enough.
- Reserve space for images, embeds, newsletter forms, and consent banners.
- Lazy-load below-the-fold video and heavy embeds behind a poster/consent action.
- Avoid third-party share widgets; use ordinary share links or the native Web Share API as progressive enhancement.
- Keep analytics and newsletter scripts deferred and consent-aware.
- Test article, index, and paginated templates separately on mid-range mobile hardware.

The global smooth scrolling, custom cursor, and transition system should be re-evaluated on long articles. They may remain only if field measurements show no reading, accessibility, or INP cost.

## 16. Accessibility and inclusive reading

- Keep one `<main>` and one `<article>` with a labelled header and footer.
- Preserve the existing skip link and visible focus treatment.
- Maintain a logical heading outline.
- Ensure every control is keyboard accessible and at least 44 × 44 CSS px.
- Use true links for navigation and true buttons for actions.
- Respect `prefers-reduced-motion`; article comprehension must never depend on animation.
- Confirm AA contrast for body text, metadata, links, rules, focus rings, and all tinted callouts.
- Do not use colour alone to indicate an active topic or link state.
- Give images contextual alt text and videos captions/transcripts.
- Make tables horizontally scrollable and retain their headers.
- Avoid justified text, very long measures, low-contrast italics, and all-caps prose.
- Test at 200% browser zoom and with a screen reader on the final templates.

## 17. Analytics, monitoring, and KPIs

Configure Google Search Console on the final canonical domain and connect privacy-compliant analytics. Search Console measures pre-click search performance; analytics measures on-site behaviour. Their numbers will not match exactly.

### Baseline and reporting

Record the launch date, indexed URL count, sitemap status, and Core Web Vitals baseline. Report monthly by article, pillar, and template.

| Area | KPI |
| --- | --- |
| Discovery | Valid indexed articles, sitemap coverage, crawl errors, orphan pages |
| Search | Impressions, clicks, CTR, query/page pairs, position distribution, branded vs non-branded clicks |
| Engagement | Engaged sessions, scroll depth bands, related-article clicks, return readers |
| Conversion | Newsletter signup, book click, speaking/contact initiation, assisted conversion by article |
| Quality | Articles updated, broken links, citation errors, accessibility defects, schema errors |
| Performance | p75 LCP, INP, CLS by index/article template and device |
| AI visibility | Verified citations/mentions from monitored platforms; never estimated as ordinary organic traffic |

Avoid vanity reporting based only on page views or the number of published posts. The leading success signal is whether useful articles are discovered for relevant non-branded needs and move readers into deeper site journeys.

## 18. Editorial lifecycle

### Status flow

`idea → brief → draft → subject review → copy edit → SEO/UX QA → scheduled → published → monitored → refreshed/merged/retired`

### Publication checklist

- Search intent and page type confirmed.
- Original contribution is explicit.
- Title, H1, dek, and description are unique and aligned.
- Claims and quotations are sourced.
- Author and reviewer are identified.
- Dates are correct and timezone-aware.
- Heading outline is valid.
- Internal links are contextual and working.
- Hero image, crops, alt text, caption, credit, and rights are complete.
- Canonical and social previews are correct.
- JSON-LD matches visible content and validates.
- Mobile, keyboard, reduced-motion, zoom, and screen-reader checks pass.
- Draft/preview URLs remain noindex.
- Article is present in sitemap, RSS, index, pillar, and related-article links after publication.

### Refresh and retirement

- Review fast-changing subjects at least every 6–12 months; evergreen essays can use a longer evidence-based cadence.
- Update `dateModified` only when the main content materially changes, and add a visible update note where it helps the reader.
- Correct errors transparently.
- Merge overlapping posts and 301 redirect the weaker URL to the consolidated article.
- If content is removed with no relevant replacement, return 410 or a proper 404 instead of redirecting everything to `/ideas`.

## 19. Delivery roadmap

### Phase 0 — decisions and evidence (1 week)

- Confirm the production domain.
- Confirm “The Study” and `/ideas`.
- Select the four initial pillars and first 6–8 real articles.
- Confirm author biography, headshot, roles, profile URLs, and editorial ownership.
- Decide whether MDX publishing is acceptable for the team.
- Run keyword, SERP, and competitor research for the first two pillars.

### Phase 1 — foundation (1–2 weeks)

- Add the MDX/Velite content pipeline and validation.
- Add `/ideas`, `/ideas/[slug]`, pagination, 404 handling, and draft exclusion.
- Extend metadata helpers and create stable schema entity IDs.
- Correct sitemap modification dates and add blog URLs.
- Add RSS.
- Add author/profile and editorial-policy foundations.

### Phase 2 — interface (1–2 weeks)

- Build index and article components using existing tokens.
- Add responsive image variants and dynamic article Open Graph images.
- Add breadcrumbs, table of contents, author bio, sources, related reading, and one contextual CTA.
- Perform visual, responsive, accessibility, and reduced-motion QA.

### Phase 3 — launch content and technical QA (1–2 weeks)

- Publish 6–8 reviewed articles.
- Build internal link connections to books, media, business, profile, speaking, and impact pages.
- Validate metadata, canonicals, rendered HTML, schema, sitemap, RSS, status codes, and social cards.
- Run Lighthouse in lab, then establish field monitoring.
- Submit the sitemap in Search Console and Bing Webmaster Tools.

### Phase 4 — authority loop (ongoing)

- Publish at a sustainable cadence, initially 2–4 strong pieces per month.
- Review query and article performance monthly.
- Refresh winners, improve weak snippets, consolidate cannibalising pages, and expand only validated clusters.
- Add original research, visual frameworks, interviews, and case evidence.
- Pursue relevant distribution and citations through real partnerships, speaking, media, books, and professional networks.

## 20. Prioritised implementation backlog

| Priority | Recommendation | Expected impact | Effort | Verification |
| --- | --- | --- | --- | --- |
| P0 | Confirm the real production domain and update `SITE_URL` | Prevents incorrect canonical, sitemap, schema, and social URLs | Low | Inspect rendered canonical, OG URL, JSON-LD and sitemap on production |
| P0 | Add validated server-rendered article routes and content schema | Creates the crawlable publishing foundation and prevents bad content states | Medium | View raw HTML, build with invalid fixtures, test draft/unknown slugs |
| P0 | Implement unique article metadata and dynamic social images | Improves search clarity and link sharing | Medium | Inspect page source and use social preview debuggers |
| P0 | Add connected `BlogPosting`, breadcrumb, image, website, and person schema | Clarifies article, author, hierarchy, and entity relationships | Medium | Rich Results Test, Schema.org Validator, URL Inspection |
| P0 | Replace build-time “now” sitemap dates with truthful dates | Preserves sitemap trust and update signals | Low | Diff sitemap across an unchanged build; dates must remain stable |
| P0 | Launch with 6–8 evidence-rich articles and a real author profile | Avoids an empty/thin launch and establishes E-E-A-T signals | High | Editorial review, source audit, index coverage after launch |
| P1 | Build the curated index and distraction-light article templates | Improves discovery, comprehension, and brand consistency | Medium | Mobile/desktop usability tests and analytics journey review |
| P1 | Implement pillar-based internal linking and related articles | Improves discovery, topic clarity, and deeper reading | Medium | Crawl graph shows no orphans and at least three incoming links over time |
| P1 | Add author bio, editorial policy, corrections pathway, and visible dates | Strengthens transparency and trust | Medium | Manual page review; schema and visible facts match |
| P1 | Add RSS and crawlable pagination | Improves discovery and archive access | Low–medium | Feed validation; crawl paginated URLs with JavaScript disabled |
| P1 | Validate contrast and accessibility across editorial components | Protects inclusive reading and legal/brand quality | Medium | Automated checks plus keyboard, zoom, and screen-reader testing |
| P1 | Establish Search Console, analytics, and CWV monitoring | Enables evidence-led iteration | Medium | Verified property, sitemap processed, dashboards receiving data |
| P2 | Add indexable pillar hubs when each has enough unique content | Builds topical authority without thin archives | Medium | Hub has useful introduction, clear links, unique metadata, and ≥5 articles |
| P2 | Add original research, diagrams, interviews, and visual essays | Creates differentiating content and citation potential | High | Earned links/citations, engagement, and qualitative reader feedback |
| P2 | Split sitemaps only when scale or reporting warrants it | Avoids premature complexity | Low later | URL volume or Search Console analysis justifies separate sets |

## 21. Definition of done

The blog is launch-ready when:

- the final domain is confirmed and all absolute URLs resolve to it;
- `/ideas`, article routes, pagination, topics in use, RSS, robots, and sitemap return correct status codes;
- six or more real, reviewed articles are published;
- every article has unique metadata, visible byline/dates, author bio, hero art, sources where needed, related content, and one appropriate CTA;
- structured data validates and matches visible content;
- no draft, preview, search, admin, checkout, reader, or parameter URL is unintentionally indexable;
- important pages are within three clicks and no article is orphaned;
- the templates pass keyboard, screen-reader, zoom, contrast, and reduced-motion checks;
- lab performance is healthy and field monitoring is configured for LCP, INP, and CLS;
- Search Console and analytics are collecting a documented baseline;
- the editorial owner, review process, correction process, and update cadence are named.

## 22. Sources and standards used

- [Google: Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Google: Breadcrumb structured data](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)
- [Google: Profile page structured data](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
- [Google: General structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Google: Add a byline date](https://developers.google.com/search/docs/appearance/publication-dates)
- [Google: Helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google: AI features and non-commodity content](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Google: Link best practices](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
- [Google: Image SEO best practices](https://developers.google.com/search/docs/appearance/google-images)
- [Google: Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google: Pagination and incremental loading](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading)
- [Google: Title links](https://developers.google.com/search/docs/appearance/title-link)
- [Google: Search snippets and meta descriptions](https://developers.google.com/search/docs/appearance/snippet)
- [web.dev: Core Web Vitals](https://web.dev/articles/vitals)
- [Next.js: Metadata and Open Graph images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Next.js: `generateMetadata`](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js: sitemap file convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)

## 23. Limitations

This is an implementation-ready architecture and design plan, not a live SEO audit. No verified production domain, Search Console property, analytics account, keyword-volume provider, backlink index, or live competitor dataset was available. Topic names and launch formats are therefore strategy recommendations grounded in the current site; primary queries and content priorities should be validated with first-party data and current SERPs before articles are commissioned.
