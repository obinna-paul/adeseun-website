import { pageMetadata } from "@/lib/seo";
import { AwardsSection } from "@/components/sections/awards";

export const metadata = pageMetadata({
  title: "The Hall",
  path: "/awards",
  description: "Honours, proclamations, and recognitions — kept in one place.",
});

export default function AwardsPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <AwardsSection />
    </main>
  );
}
