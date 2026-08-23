import { pageMetadata } from "@/lib/seo";
import { ImpactSection } from "@/components/sections/impact";

export const metadata = pageMetadata({
  title: "The Foundation",
  path: "/impact",
  description: "Institution building, cultural preservation, and mentorship — the long-term work beyond any single project.",
});

export default function ImpactPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <ImpactSection />
    </main>
  );
}
