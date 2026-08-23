import { pageMetadata } from "@/lib/seo";
import { HeroSection } from "@/components/sections/hero";
import {
  HomePositioningSection,
  HomeBusinessesSection,
  HomeFeaturedBookSection,
  HomeMediaSection,
  HomeRecognitionSection,
  HomeCTASection,
} from "@/components/sections/home";

export const metadata = pageMetadata({ title: "Home", path: "/" });

/**
 * Rebuilt per direct instruction: the Values Manifesto (a 900vh
 * GSAP scroll-pinned section) is removed entirely, along with its
 * scroll-pin/scrub interaction and all of its supporting code — see
 * ARCHITECTURE.md. In its place, real content sections built from
 * data that already exists and is already verified elsewhere on the
 * site (businesses, books, media, recognition), rather than more
 * placeholder narrative.
 *
 * Content order, and the layout family each section uses, deliberately
 * varied per taste-skill's section-layout-repetition rule:
 *   1. Hero — full-bleed cinematic (components/sections/hero)
 *   2. Positioning — plain centered text, no image
 *   3. Businesses — divided text list, not a card grid
 *   4. Featured book — image/text split
 *   5. Media — image/text split, reversed (zigzag cap: 2 in a row, no more)
 *   6. Recognition — stacked list, breaks the zigzag
 *   7. Final CTA — centered banner, same "Work With Me" intent as the hero
 */
export default function Home() {
  return (
    <main id="main-content" tabIndex={-1}>
      <HeroSection />
      <HomePositioningSection />
      <HomeBusinessesSection />
      <HomeFeaturedBookSection />
      <HomeMediaSection />
      <HomeRecognitionSection />
      <HomeCTASection />
    </main>
  );
}
