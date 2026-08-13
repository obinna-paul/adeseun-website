import { pageMetadata } from "@/lib/seo";
import { StudyHero, StudyTimeline, BehindTheCurtain, BeyondThePage, StudyCTA } from "@/components/sections/study";

export const metadata = pageMetadata({
  title: "The Study",
  path: "/study",
  description: "A cinematic timeline through her four books and the thinking behind them — not a resume.",
});

export default function StudyPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <StudyHero />
      <StudyTimeline />
      <BehindTheCurtain />
      <BeyondThePage />
      <StudyCTA />
    </main>
  );
}
