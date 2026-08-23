import { pageMetadata } from "@/lib/seo";
import { BusinessesSection } from "@/components/sections/businesses";

export const metadata = pageMetadata({
  title: "The Atrium",
  path: "/businesses",
  description: "The companies and platforms she's built or leads — 360Africa Media Group, Bounty5 Home, Universal Worship Network, and more.",
});

export default function BusinessesPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <BusinessesSection />
    </main>
  );
}
