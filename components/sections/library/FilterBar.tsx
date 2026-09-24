"use client";

import { motion } from "motion/react";
import type { Category } from "./library-content";
import { ease } from "@/lib/design-tokens";

/**
 * The active pill uses a shared `layoutId` so Motion animates the
 * highlight sliding between buttons rather than crossfading two static
 * states — the one legitimate `layout` use here (moving on screen →
 * ease-in-out per emil-design-eng's decision tree, not ease-out).
 */
export function FilterBar({
  active,
  categories,
  onChange,
}: {
  active: Category | "All";
  categories: Category[];
  onChange: (value: Category | "All") => void;
}) {
  const options: Array<Category | "All"> = ["All", ...categories];

  return (
    <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = option === active;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option)}
            className="relative rounded-control px-4 py-2 font-mono text-xs uppercase tracking-[0.1em] transition-colors duration-150 ease-gallery-standard"
          >
            {isActive && (
              <motion.span
                layoutId="active-filter-pill"
                className="absolute inset-0 rounded-control bg-gold-fill"
                transition={{ duration: 0.35, ease: ease.inOut }}
              />
            )}
            <span className={`relative ${isActive ? "text-text-on-dark" : "text-text-subdued hover:text-text"}`}>
              {option}
            </span>
          </button>
        );
      })}
    </div>
  );
}
