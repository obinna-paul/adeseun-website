import { Monogram } from "@/components/ui/Monogram";
import { BackToTop } from "./BackToTop";
import { MotionToggle } from "./MotionToggle";
import { NavLink } from "./NavLink";
import { SITE_ROOMS } from "@/lib/navigation";

/**
 * The darkest surface on the site — reusing `--color-hero-ground`
 * rather than introducing a second near-black. That keeps the palette
 * to one dark note instead of two, and lets the footer read as a
 * deliberate bookend: the same register the Foyer opened on, arrived at
 * again once there's nowhere further to scroll. Not a new exception to
 * taste-skill's Page Theme Lock (4.11) — a persistent global chrome
 * element (like a nav bar) isn't a "section" flipping themes mid-page,
 * the same reasoning that already covers the custom cursor and the
 * page-transition wrapper living outside any single page's palette.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-hero-ground px-gutter py-room text-text-on-dark">
      <div className="mx-auto max-w-frame">
        <div className="flex flex-col gap-16 border-b border-text-on-dark/10 pb-16 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex max-w-sm flex-col gap-6">
            <Monogram />
            <p className="text-balance font-display text-2xl italic leading-snug text-text-on-dark/90 sm:text-3xl">
              Adeseun Oyeneye
            </p>
          </div>

          <nav aria-label="Site" className="grid grid-cols-2 gap-x-10 gap-y-4 sm:grid-cols-3 lg:flex lg:flex-col lg:gap-4">
            {SITE_ROOMS.map((room) =>
              room.built ? (
                <NavLink
                  key={room.href}
                  href={room.href}
                  className="font-mono text-xs uppercase tracking-[0.12em] text-text-on-dark/70 transition-colors duration-150 ease-gallery-standard hover:text-gold"
                >
                  {room.name}
                </NavLink>
              ) : (
                // Named, not hidden — visitors can see what's coming — but
                // not a link: the page behind this route doesn't exist yet.
                <span
                  key={room.href}
                  aria-disabled="true"
                  className="inline-flex w-fit items-baseline gap-1.5 font-mono text-xs uppercase tracking-[0.12em] text-text-on-dark/35"
                >
                  {room.name}
                  <span className="text-[0.6rem] tracking-[0.1em] text-text-on-dark/25">Soon</span>
                </span>
              ),
            )}
          </nav>
        </div>

        <div className="flex flex-col-reverse items-center gap-6 pt-10 sm:flex-row sm:justify-between">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-text-on-dark/50">
            &copy; {year} Adeseun Oyeneye. All rights reserved.
          </span>
          <div className="flex items-center gap-8">
            <MotionToggle />
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}
