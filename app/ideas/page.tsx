import { IdeasIndex } from "@/components/sections/ideas";
import { IDEA_ARTICLES } from "@/content/ideas/articles";
import { ideasCollectionJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Blog — Ideas & Essays",
  path: "/ideas",
  description: "Essays on leadership, African media, architecture, purpose, and the patient work of turning ideas into something other people can trust.",
});

export default function IdeasPage() {
  const jsonLd = ideasCollectionJsonLd(IDEA_ARTICLES);

  return (
    <main id="main-content" tabIndex={-1}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <IdeasIndex />
    </main>
  );
}
