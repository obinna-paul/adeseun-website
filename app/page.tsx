import { pageMetadata } from "@/lib/seo";
import { HeroSection } from "@/components/sections/hero";
import { ManifestoSection } from "@/components/sections/manifesto/ManifestoSection";

export const metadata = pageMetadata({ title: "The Foyer", path: "/" });

/**
 * Act I (Hero) and Act IV (Values Manifesto) are built. Acts II, III,
 * V–VII are next — the hero's ScrollCue targets id="act-ii", which
 * doesn't exist yet and so is currently a graceful no-op; Manifesto is
 * placed directly after the hero for now, out of strict Walkthrough
 * order, since it was requested and built before Acts II–III were.
 */
export default function Home() {
  return (
    <main>
      <HeroSection />
      <ManifestoSection />
    </main>
  );
}
