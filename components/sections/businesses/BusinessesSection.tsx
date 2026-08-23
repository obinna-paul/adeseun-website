import Image from "next/image";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { VentureCard } from "./VentureCard";
import { VENTURES, PAGE_EYEBROW, PAGE_HEADLINE, PAGE_INTRO, CTA_HEADLINE, CTA_BODY, CTA_HREF } from "./businesses-content";

export function BusinessesSection() {
  return (
    <>
      <section className="bg-ground px-gutter py-room" aria-label="The Atrium">
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-mono text-xs uppercase tracking-[0.15em] text-gold-ink">{PAGE_EYEBROW}</span>
          <h1 className="mt-3 text-balance font-display text-4xl font-semibold text-text sm:text-5xl">{PAGE_HEADLINE}</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-text-subdued">{PAGE_INTRO}</p>
        </div>

        {/* Her own "Brand Portfolio & Enterprise Footprint" one-pager, used
            intact — real logos and her own framing, not redrawn. */}
        <div className="mx-auto mt-12 max-w-2xl overflow-hidden rounded-frame shadow-elevation-card">
          <Image
            src="/images/adeseun-brand-portfolio-overview.png"
            alt="Brand Portfolio & Enterprise Footprint — an overview of her companies"
            width={650}
            height={924}
            className="h-auto w-full"
            sizes="(min-width: 1024px) 40vw, 90vw"
          />
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {VENTURES.map((venture) => (
            <VentureCard key={venture.id} venture={venture} />
          ))}
        </div>
      </section>

      <section className="bg-surface-sunken px-gutter py-24 text-center">
        <h2 className="text-balance font-display text-3xl font-semibold text-text sm:text-4xl">{CTA_HEADLINE}</h2>
        <p className="mx-auto mt-3 max-w-md text-lg text-text-subdued">{CTA_BODY}</p>
        <div className="mt-8 flex justify-center">
          <MagneticButton href={CTA_HREF} variant="primary">
            Get in touch
          </MagneticButton>
        </div>
      </section>
    </>
  );
}
