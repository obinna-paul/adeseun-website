import { pageMetadata } from "@/lib/seo";
import { SpeakingSection } from "@/components/sections/speaking";

export const metadata = pageMetadata({
  title: "The Podium",
  path: "/speaking",
  description: "Keynotes, corporate advisory, and speaking engagements — where she contributes, and how to invite her.",
});

export default function SpeakingPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <SpeakingSection />
    </main>
  );
}
