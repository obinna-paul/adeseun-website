import { pageMetadata } from "@/lib/seo";
import { HeroSection } from "@/components/sections/hero";
import { ManifestoSection } from "@/components/sections/manifesto/ManifestoSection";

export const metadata = pageMetadata({ title: "The Foyer", path: "/" });

/**
 * Act I (Hero) and Act IV (Values Manifesto) are built. Acts II, III,
 * V–VII are next; Manifesto is placed directly after the hero for now,
 * out of strict Walkthrough order, since it was requested and built
 * before Acts II–III were.
 */
export default function Home() {
  return (
    <main id="main-content" tabIndex={-1}>
      <HeroSection />
      <ManifestoSection />
    </main>
  );
}
