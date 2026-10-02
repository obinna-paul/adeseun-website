import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Editorial Policy",
  path: "/editorial-policy",
  description: "The authorship, sourcing, corrections, and editorial standards behind the blog by Adeseun Oyeneye.",
});

const POLICIES = [
  {
    title: "Authorship and accountability",
    body: "Every published essay names the person accountable for its ideas and accuracy. Editorial, research, or technical assistance does not replace the judgement and approval of the named author.",
  },
  {
    title: "Sources and evidence",
    body: "Factual claims are checked against reliable sources. Where a subject depends on specialised evidence, primary and authoritative sources are preferred and linked in context or listed with the article.",
  },
  {
    title: "Experience and opinion",
    body: "First-hand experience is identified as such. Interpretation and opinion are presented clearly rather than disguised as universal fact. The blog does not invent quotations, projects, results, credentials, or personal experience.",
  },
  {
    title: "AI-assisted work",
    body: "Tools may assist research organisation, transcription, outlining, editing, or production. Published work remains subject to human review, fact-checking, rights checks, and final approval by the accountable author.",
  },
  {
    title: "Corrections and updates",
    body: "Material corrections are made promptly. Substantive updates receive a truthful modified date and, where useful to the reader, a visible note describing what changed. Publication dates are not refreshed merely to make an older article appear new.",
  },
  {
    title: "Commercial independence",
    body: "A commercial relationship, gifted product, paid partnership, or other material interest that could affect a reader’s interpretation is disclosed clearly on the relevant page.",
  },
] as const;

export default function EditorialPolicyPage() {
  return (
    <main id="main-content" tabIndex={-1} className="bg-ground px-gutter pb-room pt-40 sm:pt-44">
      <div className="mx-auto max-w-frame">
        <div className="max-w-3xl border-b border-line pb-10">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-gold-ink">Blog</p>
          <h1 className="mt-4 text-balance font-display text-5xl font-semibold text-text sm:text-6xl">Editorial policy</h1>
          <p className="mt-6 text-xl text-text-subdued">
            The blog exists to publish considered, useful work. These standards explain how that work is authored, supported, reviewed, corrected, and disclosed.
          </p>
        </div>

        <div className="mt-12 grid gap-x-12 gap-y-14 lg:grid-cols-2">
          {POLICIES.map((policy, index) => (
            <section key={policy.title} className="border-t border-line pt-5">
              <p className="font-mono text-xs text-gold-ink">{String(index + 1).padStart(2, "0")}</p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-text">{policy.title}</h2>
              <p className="mt-4 text-lg text-text-subdued">{policy.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-16 border border-line bg-surface p-8 sm:p-10">
          <h2 className="font-display text-3xl font-semibold text-text">Request a correction</h2>
          <p className="mt-4 max-w-2xl text-lg text-text-subdued">
            If an article contains a factual error, missing attribution, rights concern, or important context, please send the article URL and a clear description through The Reception.
          </p>
          <Link href="/contact" className="mt-6 inline-flex min-h-12 items-center rounded-control bg-emerald-fill px-7 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-text-on-dark hover:bg-emerald-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-4">
            Contact The Reception
          </Link>
        </div>
      </div>
    </main>
  );
}
