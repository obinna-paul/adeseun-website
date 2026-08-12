"use client";

import { motion } from "motion/react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { gentleReveal, viewportOnce } from "@/lib/motion";
import { CTA_HEADLINE, CTA_BODY, CTA_HREF } from "./study-content";

export function StudyCTA() {
  return (
    <section className="bg-ground px-gutter py-room text-center">
      <motion.div
        className="mx-auto flex max-w-2xl flex-col items-center gap-6"
        variants={gentleReveal}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <h2 className="text-balance font-display text-4xl font-semibold text-text sm:text-5xl">{CTA_HEADLINE}</h2>
        <p className="max-w-xl text-text-subdued">{CTA_BODY}</p>
        <div className="mt-4">
          <MagneticButton href={CTA_HREF} variant="primary">
            Book Her for Your Room
          </MagneticButton>
        </div>
      </motion.div>
    </section>
  );
}
