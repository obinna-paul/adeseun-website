import { pageMetadata } from "@/lib/seo";
import { HeroSection } from "@/components/sections/hero";

export const metadata = pageMetadata({ title: "The Foyer", path: "/" });

/**
 * Act I is built (see components/sections/hero). Acts II–VII are next —
 * this page will grow a <section id="act-ii"> etc. as each one lands,
 * which is also what the hero's ScrollCue is already wired to find.
 */
export default function Home() {
  return (
    <main>
      <HeroSection />
    </main>
  );
}
