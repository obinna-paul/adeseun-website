"use client";

import { useState } from "react";
import Link from "next/link";
import { List } from "@phosphor-icons/react/dist/ssr";
import { Monogram } from "@/components/ui/Monogram";
import { NavLink } from "./NavLink";
import { MobileNav } from "./MobileNav";
import { SITE_PAGES } from "@/lib/navigation";

/**
 * Persistent top nav — `fixed`, not `sticky`: sticky still consumes its
 * own height in normal flow at its starting position, which would push
 * every page's opening section down by the header's height, breaking
 * the Hero's and Study's full-bleed `min-h-[100dvh]` cold-opens (see
 * HeroSection/StudyHero). `fixed` removes it from flow entirely and
 * floats it above whatever's underneath instead — page sections keep
 * their own generous top padding (`py-room`, or full-bleed hero
 * treatment) and the translucent bar simply overlays the first ~5rem.
 *
 * `bg-hero-ground/75 backdrop-blur-lg`, not a solid bar — same
 * reasoning Footer's own doc comment already gives for living outside
 * Page Theme Lock (taste-skill 4.11): persistent global chrome isn't a
 * page "section" flipping themes mid-page, so it's allowed to be the
 * site's dark register regardless of what page loads under it. A solid
 * `bg-hero-ground` bar would read fine floating over the Foyer's own
 * dark hero but would land as an abrupt dark stripe atop every light
 * page's opening content; frosted glass keeps the same dark identity
 * (tint dominates whatever's blurred behind it) without ever fully
 * opaque-clipping the page content for that first ~5rem.
 *
 * `z-30` — below ReadingProgress's thin gold line (`z-40`, fixed at the
 * true `top-0` edge) so that line reads as an accent riding along the
 * header's own top border, not two competing top-of-viewport elements;
 * below BookModal's backdrop/popup (`z-40`/`z-50`) and MobileNav's own
 * backdrop/popup (same tier) so an open modal always covers the header
 * too, never the reverse.
 *
 * Home is deliberately absent from the desktop link row — the Monogram
 * already links there right next to it, and a text link that duplicates
 * the logo's own destination one element away is dead weight, not a
 * completeness feature. Desktop only shows `primary`-flagged pages (per
 * the nav-simplicity brief: keep the visible bar to a handful of items
 * even though the site has real depth behind it) — MobileNav's
 * full-screen drawer lists the complete page set instead.
 */
export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const primaryPages = SITE_PAGES.filter((page) => page.primary);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-30 border-b border-text-on-dark/10 bg-hero-ground/75 backdrop-blur-lg">
        <div className="mx-auto flex h-20 max-w-frame items-center justify-between px-gutter lg:px-16">
          <Link href="/" data-cursor="link" data-cursor-text="Home" aria-label="Adeseun Oyeneye — home">
            <Monogram className="text-text-on-dark" />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
            {primaryPages.map((page) =>
              page.built ? (
                <NavLink
                  key={page.href}
                  href={page.href}
                  className="font-mono text-xs uppercase tracking-[0.12em] text-text-on-dark/80 transition-colors duration-150 ease-gallery-standard hover:text-gold"
                >
                  {page.name}
                </NavLink>
              ) : (
                <span
                  key={page.href}
                  aria-disabled="true"
                  className="inline-flex items-baseline gap-1.5 font-mono text-xs uppercase tracking-[0.12em] text-text-on-dark/35"
                >
                  {page.name}
                  <span className="text-[0.6rem] tracking-[0.1em] text-text-on-dark/25">Soon</span>
                </span>
              ),
            )}
          </nav>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            data-cursor="link"
            data-cursor-text="Menu"
            className="flex h-11 w-11 items-center justify-center text-text-on-dark/80 transition-colors duration-150 ease-gallery-standard hover:text-gold lg:hidden"
          >
            <List size={24} weight="light" />
          </button>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
