import { pageMetadata, bookJsonLd } from "@/lib/seo";
import { LibraryGrid } from "@/components/sections/library";
import { BOOKS, PAGE_INTRO } from "@/components/sections/library/library-content";

export const metadata = pageMetadata({
  title: "The Library",
  path: "/library",
  description: "Her four books — on thoughtful communication, meaningful living, tranquility, and identity — browsed like a private collection.",
});

/**
 * The brief asked for "a deep, library-like texture (maybe a dark wood
 * grain or subtle paper texture)" — offering paper texture as the
 * explicit alternative to a dark background. Taken deliberately: a dark
 * section here would be a second dark moment on a site whose Page Theme
 * Lock (taste-skill 4.11) reserves that register for the Foyer hero
 * alone ("the site's one sanctioned dark moment," app/styles/tokens.css).
 * This is laid paper instead — a fine fiber grain plus a soft vignette,
 * both within the Alabaster Gallery palette, so the room reads as a
 * reading room, not a second theme.
 */
const PAPER_TEXTURE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function LibraryPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <section
        aria-label="The Library"
        className="relative overflow-hidden bg-surface-sunken px-gutter py-room"
        style={{
          backgroundImage: `radial-gradient(120% 100% at 50% 0%, hsla(220,14%,91%,0) 0%, hsla(230,20%,20%,0.05) 100%), ${PAPER_TEXTURE}`,
          backgroundBlendMode: "normal, overlay",
        }}
      >
        <div className="relative mx-auto max-w-frame">
          <div className="max-w-2xl">
            <h1 className="text-balance font-display text-4xl font-semibold text-text sm:text-5xl">The Library</h1>
            <p className="mt-4 max-w-md text-lg text-text-subdued">{PAGE_INTRO}</p>
          </div>

          <LibraryGrid />
        </div>
      </section>

      {BOOKS.map((book) => (
        <script
          key={book.id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              bookJsonLd({
                title: book.title,
                description: book.description,
                url: "https://adeseunoyeneye.com/library",
              }),
            ),
          }}
        />
      ))}
    </main>
  );
}
