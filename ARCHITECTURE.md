# Technical architecture

Decision record for the stack, written once so it survives past this
session. Update it if a decision changes — don't let it drift silently.

## Stack

| Concern | Choice | Why |
| --- | --- | --- |
| Framework | **Next.js 15, App Router, React Server Components by default** | RSC keeps the static parts of each "room" (copy, layout) off the client bundle entirely; only the leaves that need interactivity (cursor, scroll, motion) ship JS. That split is what makes an animation-rich site still fast — per taste-skill's default and Next's own SEO/perf story (streaming, built-in `<Image>`, file-based metadata). |
| Styling | **Tailwind v4**, CSS-first config via `@theme` in `app/styles/tokens.css` | v4 moved token definition into CSS custom properties — which is exactly the shape our design tokens (`design/tailwind.tokens.config.js`, the Alabaster Gallery system) already take. `tailwind.config.ts` stays thin by design; it is not the source of truth. |
| Animation | **[Motion](https://motion.dev)** (`motion/react`, formerly Framer Motion) for component-level animation; **Lenis** for scroll normalization | Motion handles springs, layout animations, exit animations, and gesture-driven values — needed for the Shelf-Pull, the reading-nook expand, and page transitions. Lenis smooths ordinary scroll everywhere it's active; native `scroll-behavior` only smooths scroll-*to* jumps. See `components/scroll/SmoothScroll.tsx` for the full reasoning. GSAP was removed along with the Values Manifesto (see below) — it was the only scroll-pin/scrub consumer on the site; re-add it only if a future section needs that specific pattern again. |
| Content layer | **Hybrid: MDX/Velite (file-based) + Sanity (headless CMS)** | Split by who edits and how often — see `content/README.md`. Long-form voice content (The Study) is git-versioned MDX; the frequently-updated catalog (Library, Screening Room) needs a real editor UI for her team, which points to Sanity once that project exists. Not choosing one CMS for everything avoids forcing her team through git for a book update, or forcing long-form prose through a CMS rich-text box. |
| Components | **base-ui** (accessible unstyled primitives) + **cva/clsx** (typed variant styling) + **zustand** (only if/when real shared state appears) | Per the vendored `pick-ui-library` skill: don't hand-roll dialogs/popovers/focus-trapping, don't reach for global state before a component tree actually needs it. |
| Icons | **Phosphor** (`@phosphor-icons/react`) when icons are needed | Not yet installed — no icon has been needed in the scaffold itself. |

## Why not the "obvious" alternatives

- **CSS-in-JS / styled-components**: fights RSC (client-only), and Tailwind
  v4's `@theme` already gives us typed, themeable tokens without a runtime.
- **GSAP as the default animation library**: was reserved for scroll-pin/
  scrub patterns (the now-removed Values Manifesto); not a current
  dependency. Reintroduce it (per `taste-skill`'s canonical skeletons)
  only if a future section genuinely needs a scroll-pin/scrub, not by
  default. Motion covers everything else with a smaller mental model and
  RSC-friendly leaf components.
- **A single all-purpose CMS for everything**: see Content layer above.
- **`next-themes` / dark mode toggle**: deliberately absent. The Alabaster
  Gallery direction is a locked single visual world (taste-skill's Page
  Theme Lock) — see `app/styles/tokens.css`.

## Known constraints

- **TypeScript is pinned to 6.0.x, not the newest 7.x tag.** TS 7 (the
  native-compiled rewrite) is `latest` on npm as of this build, but
  `typescript-eslint` — which `eslint-config-next` depends on — hard-errors
  on it (`typescript-eslint does not support TS 7.0`). Re-check
  `npm view typescript-eslint peerDependencies` before bumping past 6.1.x.
- **No `scroll-behavior: smooth` in globals.css, on purpose.** See the
  comment in that file — Lenis owns scroll smoothing, and Next.js 16
  stopped auto-suspending CSS smooth-scroll during route transitions.
- **ESLint is pinned to 9.x, not 10.x.** `eslint-plugin-react@7.37.5`
  (bundled by `eslint-config-next`) throws `contextOrFilename.getFilename
  is not a function` under ESLint 10 — a real incompatibility, not a
  config mistake. Re-check before bumping once a fixed `eslint-plugin-react`
  ships.

## Folder organization

```
app/                  Next.js App Router — routes, root layout, global CSS
  fonts/               self-hosted woff2 files (next/font/local)
  styles/tokens.css     canonical design tokens (@theme)
components/
  cursor/               CustomCursor
  scroll/                SmoothScroll (Lenis)
  transitions/            PageTransition
  layout/                (reserved for header/nav/footer, once built)
  sections/               (reserved for per-room scroll "acts")
  ui/                     (reserved for small reusable primitives)
lib/                   design-tokens.ts, motion.ts, seo.ts, fonts.ts, utils.ts
design-system/         barrel — one import for every token category
content/               MDX content (see content/README.md)
design/                Doctrine, Walkthrough, style tile, tailwind tokens
```

## What's scaffolded vs. what's next

The site was restructured from an earlier "rooms in a house" literary
metaphor (The Foyer, The Library, The Study, The Screening Room, The
Invitation — author-first) to an executive-first "building" metaphor,
**The Blueprint**, per direct instruction: she's a practicing architect,
and the site is now framed as a building she designed, toured room by
room, each room mapped to a business function. See `lib/navigation.ts`
(`SITE_PAGES`) for the full room map and the reasoning in its doc
comment.

Built and live: Home (`/`, new executive-first hero — see
`components/sections/hero/HeroSection.tsx`), The Blueprint (`/about`),
The Atrium (`/businesses`), The Boardroom (`/executive-profile`), The
Library (`/books`), The Screening Room (`/media`), The Podium
(`/speaking`), The Hall (`/awards`), The Foundation (`/impact`), The
Reception (`/contact`). Old routes (`/library`, `/screening-room`,
`/study`, `/invitation`) 301-redirect to their new homes
(`next.config.ts`).

Not yet built, and deliberately absent from `SITE_PAGES` rather than
listed as "Soon" placeholders, per direct instruction: The Archive
(case studies), The Study (journal/thought leadership, blocked on
actual essays and the MDX/Velite pipeline), The Drafting Room
(architecture portfolio, blocked on real project photography), The
Press Room (blocked on an approved press kit/photos), The Gallery
(blocked on curated photography). Add each back to `SITE_PAGES` the
same commit its real page ships.

The home page's Values Manifesto section (the site's one scroll-pinned,
GSAP-driven interaction) was removed along with all of its supporting
code (`components/sections/manifesto/`, `lib/gsap.ts`, the `gsap`
dependency) per direct instruction, in favor of real content sections
built from already-established pages — see HomeSection's own doc
comment for the current content order.

The design tokens were also repainted from the original "Alabaster
Gallery & Aso-Oke Gold" (cool grey, single gold accent) to "Ivory Atrium
& Emerald Brass" (warm ivory, emerald primary, terracotta secondary,
brass/gold as a metallic detail accent) — see `app/styles/tokens.css`'s
own doc comment for the full reasoning.
