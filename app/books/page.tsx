import Link from "next/link";
import { pageMetadata, bookJsonLd } from "@/lib/seo";
import { LibraryGrid } from "@/components/sections/library";
import {
  BOOKS,
  PAGE_INTRO,
  applyEbookMetadata,
  ebookOnlyBook,
} from "@/components/sections/library/library-content";
import { getPublishedEbookCatalog } from "@/lib/ebooks";
import type { EbookCatalogItem } from "@/lib/ebook-types";

// Publication edits and newly released digital-only titles must appear without
// waiting for a site redeploy.
export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "The Library",
  path: "/books",
  description:
    "Books on thoughtful communication, meaningful living, identity, strategy, design, resilience, purpose, connection, and faith, browsed like a private collection.",
});

/**
 * Moved from /library (see next.config.ts's redirect) as part of the
 * executive-first restructure — same real content and components, new
 * route to match the site's new page map (lib/navigation.ts). The room
 * keeps its name, "The Library": it already fit before the rest of the
 * site's naming changed around it.
 *
 * The brief asked for "a deep, library-like texture (maybe a dark wood
 * grain or subtle paper texture)" — offering paper texture as the
 * explicit alternative to a dark background. Taken deliberately: a dark
 * section here would be a second dark moment on a site whose Page Theme
 * Lock (taste-skill 4.11) reserves that register for the home hero alone
 * ("the site's one sanctioned dark moment," app/styles/tokens.css).
 * This is laid paper instead — a fine fiber grain plus a soft vignette,
 * both within the palette, so the room reads as a reading room, not a
 * second theme.
 */
const PAPER_TEXTURE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const FEATURED_PRINT_BOOK_IDS = [
  "the-teenagers-365-day-devotional",
  "the-bible-in-a-year",
  "mailbox",
  "architectural-soul",
] as const;

export default async function BooksPage() {
  const ebookCatalog = await getPublishedEbookCatalog(BOOKS.map((book) => book.id)).catch((error) => {
    console.error("Could not load the e-book catalog:", error);
    return {} as Record<string, EbookCatalogItem>;
  });
  // BOOKS stays in publication order for stable numbering and admin use.
  // The public library presents the newest paperbacks first, with selected
  // featured titles pinned into the opening row.
  const featuredIds = new Set<string>(FEATURED_PRINT_BOOK_IDS);
  const printBooksNewestFirst = [
    ...FEATURED_PRINT_BOOK_IDS.flatMap((id) => {
      const book = BOOKS.find((candidate) => candidate.id === id);
      return book ? [book] : [];
    }),
    ...[...BOOKS].reverse().filter((book) => !featuredIds.has(book.id)),
  ];
  const catalogBooks = [
    ...printBooksNewestFirst.map((book) => applyEbookMetadata(book, ebookCatalog[book.id])),
    ...Object.values(ebookCatalog)
      .filter((publication) => publication.standalone && !BOOKS.some((book) => book.id === publication.bookId))
      .map(ebookOnlyBook),
  ];

  return (
    <main id="main-content" tabIndex={-1}>
      <section
        aria-label="The Library"
        className="relative overflow-hidden bg-surface-sunken px-gutter py-room"
        style={{
          backgroundImage: `radial-gradient(120% 100% at 50% 0%, hsla(36,26%,91%,0) 0%, hsla(30,20%,20%,0.05) 100%), ${PAPER_TEXTURE}`,
          backgroundBlendMode: "normal, overlay",
        }}
      >
        <div className="relative mx-auto max-w-frame">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <h1 className="text-balance font-display text-4xl font-semibold text-text sm:text-5xl">The Library</h1>
              <p className="mt-4 max-w-md text-lg text-text-subdued">{PAGE_INTRO}</p>
            </div>
            <Link
              href="/read"
              className="rounded-control border border-line-strong bg-surface/60 px-5 py-3 font-mono text-xs uppercase tracking-[0.12em] text-emerald-ink transition-colors duration-150 ease-gallery-standard hover:border-emerald-line hover:bg-emerald-tint"
            >
              My e-books
            </Link>
          </div>

          <LibraryGrid books={catalogBooks} ebookCatalog={ebookCatalog} />
        </div>
      </section>

      {catalogBooks.map((book) => (
        <script
          key={book.id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              bookJsonLd({
                title: book.title,
                description: book.description,
                url: "https://adeseunoyeneye.com/books",
              }),
            ),
          }}
        />
      ))}
    </main>
  );
}
