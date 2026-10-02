# Content layer

Two content sources, split by who edits them and how often:

- **Typed, file-based articles** — The Study is live from
  `content/ideas/articles.ts`. Each essay uses one validated TypeScript shape,
  stays Git-versioned and reviewable, and is server-rendered by the App Router.
  The shape intentionally mirrors MDX front matter so the bodies can move to
  MDX + Velite later without changing routes, metadata, schema, cards, RSS, or
  sitemap generation. The current local layer avoids adding a publishing
  dependency before the editorial team has confirmed how it wants to work.

- **Sanity (headless CMS)** — for The Library (books) and The Screening
  Room (videos/press), where her team needs to add or reorder entries
  without touching code or opening a PR. Requires an actual Sanity
  project (an external account decision, not something to provision
  silently). `lib/cms.ts` is the intended integration seam once that
  project exists.

`content/ideas/articles.ts` is the current source of truth for The Study. Only
entries explicitly marked `sample: true` are exposed during layout review. The
sample index and article are noindexed and excluded from the sitemap and RSS;
editorial launch copy must be approved by the named author before those
safeguards are removed.
