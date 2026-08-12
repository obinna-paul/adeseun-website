import { pageMetadata } from "@/lib/seo";
import { StudyHero, StudyTimeline, BehindTheCurtain, StudyCTA } from "@/components/sections/study";

export const metadata = pageMetadata({
  title: "The Study",
  path: "/study",
  description:
    "A cinematic timeline through her corporate ascent, her books, and the thinking behind both — not a resume.",
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
