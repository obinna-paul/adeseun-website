import { pageMetadata } from "@/lib/seo";
import { HeroSection } from "@/components/sections/hero";
import { ManifestoSection } from "@/components/sections/manifesto/ManifestoSection";

export const metadata = pageMetadata({ title: "Home", path: "/" });

/**
 * The home hero is rewritten executive-first (see HeroSection's own doc
 * comment). ManifestoSection stays here for now, unchanged — its values
 * copy is slated to be folded into /about's "Woman Behind the Work"
 * thread once that page exists, but moving it out before its destination
 * is built would just delete real, already-written voice content from
 * the live site for no reason. The rest of the new executive-first
 * homepage content (businesses strip, featured book, media highlight,
 * recognition strip, closing CTA) is deliberately not added yet either —
 * every one of those would link to a page (/businesses, /books, /media,
 * /awards, /contact) that doesn't exist as a real route yet. Add each
 * strip once its destination page ships, not before.
 */
export default function Home() {
  return (
    <main id="main-content" tabIndex={-1}>
      <HeroSection />
      <ManifestoSection />
    </main>
  );
}
