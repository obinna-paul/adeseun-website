import { pageMetadata } from "@/lib/seo";
import { ScreeningRoomSection } from "@/components/sections/screening-room";

export const metadata = pageMetadata({
  title: "The Screening Room",
  path: "/screening-room",
  description: "Real footage of her speaking at events, panels, and functions — watch any clip directly.",
});

export default function ScreeningRoomPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <ScreeningRoomSection />
    </main>
  );
}
