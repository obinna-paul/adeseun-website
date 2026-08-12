import { pageMetadata } from "@/lib/seo";
import { TextLink } from "@/components/ui/TextLink";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { UnderlineDemo } from "./UnderlineDemo";

export const metadata = pageMetadata({
  title: "Interactions",
  path: "/interactions",
  description: "Internal review page for the site's micro-interaction layer — not a real room in the sitemap.",
  noIndex: true,
});

/**
 * A review page, not a "room" — deliberately absent from SITE_ROOMS and
 * noindexed. Every interaction from the micro-interactions pass, isolated
 * so it can be reviewed on its own rather than hunted for across five
 * pages. Eyebrow labels are used freely here on purpose: this is a spec
 * page, not a marketing page, so taste-skill's eyebrow-restraint rule
 * (scoped to landing/marketing pages) doesn't apply the same way.
 */
export default function InteractionsPage() {
  return (
    <main className="px-gutter py-room">
      <div className="mx-auto max-w-frame">
        <span className="font-mono text-xs uppercase tracking-[0.15em] text-gold-ink">Internal / Not in Sitemap</span>
        <h1 className="mt-3 text-balance font-display text-5xl font-semibold text-text sm:text-6xl">
          The micro-interaction layer.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-text-subdued">
          Every hover, click, and scroll cue from the polish pass, isolated for review. Move your mouse around —
          most of this only shows on a fine pointer.
        </p>

        {/* ---------------------------------------------------------- */}
        <section className="mt-24">
          <span className="font-mono text-xs uppercase tracking-[0.15em] text-gold-ink">01 — Custom Cursor</span>
          <h2 className="mt-2 font-display text-3xl font-semibold text-text">Dot → circle → icon.</h2>
          <p className="mt-2 max-w-lg text-text-subdued">
            A small dot at rest. Hover a link/button for a labeled gold-bordered circle; hover an image for an
            expand icon.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div
              data-cursor="link"
              data-cursor-text="Explore"
              className="flex h-40 items-center justify-center rounded-frame border border-line-whisper bg-surface text-center font-mono text-xs uppercase tracking-wide text-text-faint"
            >
              Hover — link
              <br />
              (&ldquo;Explore&rdquo;)
            </div>
            <div
              data-cursor="link"
              data-cursor-text="Read"
              className="flex h-40 items-center justify-center rounded-frame border border-line-whisper bg-surface text-center font-mono text-xs uppercase tracking-wide text-text-faint"
            >
              Hover — link
              <br />
              (&ldquo;Read&rdquo;)
            </div>
            <div
              data-cursor="image"
              className="flex h-40 items-center justify-center rounded-frame border border-line-whisper bg-surface-sunken text-center font-mono text-xs uppercase tracking-wide text-text-faint"
            >
              Hover — image
              <br />
              (expand icon)
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        <section className="mt-24">
          <span className="font-mono text-xs uppercase tracking-[0.15em] text-gold-ink">02 — Click Bounce</span>
          <h2 className="mt-2 font-display text-3xl font-semibold text-text">Press, don&rsquo;t just click.</h2>
          <p className="mt-2 max-w-lg text-text-subdued">
            Every native link/button scales to 0.97 on `:active` sitewide (globals.css) — try clicking any of
            these.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <MagneticButton variant="primary">Magnetic button</MagneticButton>
            <button
              type="button"
              className="rounded-control border border-line px-6 py-3 font-mono text-sm text-text transition-colors duration-150 ease-gallery-standard hover:border-gold"
            >
              Plain button
            </button>
            <a
              href="#top"
              className="rounded-frame border border-line-whisper bg-surface px-6 py-3 font-mono text-sm text-text shadow-elevation-card"
            >
              Card-style link
            </a>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        <section className="mt-24">
          <span className="font-mono text-xs uppercase tracking-[0.15em] text-gold-ink">03 — Nav Underline</span>
          <h2 className="mt-2 font-display text-3xl font-semibold text-text">Draws itself in.</h2>
          <p className="mt-2 max-w-lg text-text-subdued">
            The real version (Footer) is driven by <code className="font-mono text-sm">usePathname()</code> — click
            between these to see the same mechanism without leaving the page.
          </p>
          <UnderlineDemo />
        </section>

        {/* ---------------------------------------------------------- */}
        <section className="mt-24 max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-[0.15em] text-gold-ink">04 — Text Link Gradient</span>
          <h2 className="mt-2 font-display text-3xl font-semibold text-text">Inline links, wiped in gold.</h2>
          <p className="mt-4 text-lg leading-relaxed text-text-subdued">
            This is what a link looks like sitting inside a normal paragraph — hover{" "}
            <TextLink href="/study">this phrase</TextLink> and watch the color sweep from left to right instead of
            just flicking to gold.
          </p>
        </section>

        {/* ---------------------------------------------------------- */}
        <section className="mt-24">
          <span className="font-mono text-xs uppercase tracking-[0.15em] text-gold-ink">
            05 — Scrollbar &amp; Reading Progress
          </span>
          <h2 className="mt-2 font-display text-3xl font-semibold text-text">Already on screen.</h2>
          <p className="mt-2 max-w-lg text-text-subdued">
            The thin gold line at the very top of the viewport is the reading-progress indicator — it&rsquo;s been
            filling in as you scroll this page. The scrollbar itself (right edge of the window) is the
            custom-styled, translucent one from globals.css.
          </p>
        </section>

        {/* Padding so there's real scroll distance to demonstrate the progress bar with. */}
        <div className="mt-24 h-[40vh]" aria-hidden="true" />
      </div>
    </main>
  );
}
