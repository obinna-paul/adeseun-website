import { pageMetadata } from "@/lib/seo";
import { StudyHero, StudyTimeline, BehindTheCurtain, BeyondThePage, StudyCTA } from "@/components/sections/study";

export const metadata = pageMetadata({
  title: "The Blueprint",
  path: "/about",
  description: "A cinematic timeline through her books, her working life, and the thinking behind both — not a resume.",
});

/**
 * Moved from /study (see next.config.ts's redirect) as part of the
 * executive-first restructure — same real, verified components and
 * content, new route and room name ("The Blueprint," not "The Study")
 * to match the site's new building metaphor (lib/navigation.ts).
 *
 * ManifestoSection (Home's values section) is NOT folded in here yet,
 * despite earlier planning notes suggesting it would be — it's a heavy,
 * 900vh scroll-pinned experience, and stacking it after this page's own
 * substantial timeline/curtain/credentials content risked an excessively
 * long, two-heavy-scroll-experiences page. Left on Home, unchanged, until
 * that merge gets its own dedicated pass rather than being rushed here.
 */
export default function AboutPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <StudyHero />
      <StudyTimeline />
      <BehindTheCurtain />
      <BeyondThePage />
      <StudyCTA />
    </main>
  );
}
