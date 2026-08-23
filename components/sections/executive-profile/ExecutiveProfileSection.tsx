"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { gentleReveal, staggerChildren } from "@/lib/motion";
import {
  CAREER_TIMELINE,
  CREDENTIALS,
  KEY_FACTS,
  PAGE_EYEBROW,
  PAGE_HEADLINE,
  PAGE_SUBHEAD,
  PAGE_INTRO,
  CTA_HEADLINE,
  CTA_BODY,
  CTA_HREF,
} from "./executive-profile-content";

/**
 * The Boardroom's own hero is a plain split layout (portrait + text),
 * not HeroPortrait's cold-open treatment — that treatment is Home's one
 * sanctioned dark moment (taste-skill 4.11's Page Theme Lock); this page
 * stays in the site's ordinary light register throughout, formal rather
 * than cinematic, matching its "suitable for investors and governments"
 * brief.
 */
export function ExecutiveProfileSection() {
  return (
    <>
      <section className="bg-ground px-gutter py-room" aria-label="The Boardroom">
        <div className="mx-auto flex max-w-frame flex-col items-center gap-12 lg:flex-row lg:items-start">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={gentleReveal}
            className="w-full max-w-xs shrink-0 overflow-hidden rounded-frame shadow-elevation-card lg:max-w-sm"
          >
            <Image
              src="/images/adeseun-portrait-executive.jpg"
              alt="Adeseun Oyeneye"
              width={273}
              height={820}
              className="h-auto w-full object-cover"
              priority
            />
          </motion.div>

          <div className="max-w-xl">
            <span className="font-mono text-xs uppercase tracking-[0.15em] text-gold-ink">{PAGE_EYEBROW}</span>
            <h1 className="mt-3 text-balance font-display text-4xl font-semibold text-text sm:text-5xl">{PAGE_HEADLINE}</h1>
            <p className="mt-2 font-mono text-sm uppercase tracking-[0.08em] text-text-faint">{PAGE_SUBHEAD}</p>
            <p className="mt-6 text-lg text-text-subdued">{PAGE_INTRO}</p>

            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line-whisper pt-8">
              <div>
                <dt className="font-mono text-xs uppercase tracking-[0.1em] text-text-faint">Experience</dt>
                <dd className="mt-1 font-display text-lg text-text">{KEY_FACTS.years}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-[0.1em] text-text-faint">Governance</dt>
                <dd className="mt-1 font-display text-lg text-text">{KEY_FACTS.governance}</dd>
              </div>
              <div className="col-span-2">
                <dt className="font-mono text-xs uppercase tracking-[0.1em] text-text-faint">Businesses</dt>
                <dd className="mt-1 text-base text-text-subdued">{KEY_FACTS.businesses}</dd>
              </div>
              <div className="col-span-2">
                <dt className="font-mono text-xs uppercase tracking-[0.1em] text-text-faint">Focus</dt>
                <dd className="mt-1 text-base text-text-subdued">{KEY_FACTS.focus}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="bg-surface-sunken px-gutter py-room" aria-label="Career timeline">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-semibold text-text sm:text-4xl">A 26-year career journey.</h2>
          <motion.ol
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerChildren(90)}
            className="mt-10 flex flex-col gap-8 border-l border-line pl-8"
          >
            {CAREER_TIMELINE.map((entry) => (
              <motion.li key={entry.year} variants={gentleReveal} className="relative">
                <span className="absolute -left-[2.35rem] top-1 h-3 w-3 rounded-full border-2 border-gold bg-surface-sunken" aria-hidden="true" />
                <span className="font-mono text-sm text-gold-ink">{entry.year}</span>
                <p className="mt-1 text-lg text-text">{entry.description}</p>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </section>

      <section className="bg-ground px-gutter py-room" aria-label="Credentials">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-semibold text-text sm:text-4xl">Credentials.</h2>
          <ul className="mt-8 grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2">
            {CREDENTIALS.map((item) => (
              <li key={item} className="border-t border-line-whisper pt-4 text-base text-text-subdued">
                {item}
              </li>
            ))}
          </ul>
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
