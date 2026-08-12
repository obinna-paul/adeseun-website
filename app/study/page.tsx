import { pageMetadata } from "@/lib/seo";
import { StudyHero, StudyTimeline, BehindTheCurtain, StudyCTA } from "@/components/sections/study";

export const metadata = pageMetadata({
  title: "The Study",
  path: "/study",
  description: "A cinematic timeline through her three books and the thinking behind them — not a resume.",
});

export default function StudyPage() {
  return (
    <main>
      <StudyHero />
      <StudyTimeline />
      <BehindTheCurtain />
      <StudyCTA />
    </main>
  );
}
