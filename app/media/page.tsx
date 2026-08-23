import { pageMetadata } from "@/lib/seo";
import { ScreeningRoomSection } from "@/components/sections/screening-room";

export const metadata = pageMetadata({
  title: "The Screening Room",
  path: "/media",
  description: "Real footage of her speaking at events, panels, and functions, plus the media companies she leads.",
});

/**
 * Moved from /screening-room (see next.config.ts's redirect) as part of
 * the executive-first restructure — same real component and 16 real
 * clips, new route to match the blueprint's "Media & Entertainment"
 * scope. The room keeps its name, "The Screening Room."
 */
export default function MediaPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <ScreeningRoomSection />
    </main>
  );
}
