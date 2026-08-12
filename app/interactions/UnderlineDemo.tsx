"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const ITEMS = ["The Foyer", "The Library", "The Study", "The Invitation"];

/**
 * A self-contained stand-in for NavLink's mechanism (scaleX 0→1,
 * origin-left, CSS transition) — NavLink itself is driven by
 * `usePathname()`, which this page can't fake without real routes, so
 * this demo swaps an `active` index in local state instead. Same visual
 * technique, no navigation required to see it.
 */
export function UnderlineDemo() {
  const [active, setActive] = useState(0);

  return (
    <div className="mt-8 flex flex-wrap gap-8">
      {ITEMS.map((item, i) => (
        <button
          key={item}
          type="button"
          onClick={() => setActive(i)}
          data-cursor="link"
          data-cursor-text="Explore"
          className="group relative inline-block w-fit font-mono text-sm uppercase tracking-[0.12em] text-text-subdued transition-colors duration-150 ease-gallery-standard hover:text-text"
        >
          {item}
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-500 ease-gallery-out",
              active === i && "scale-x-100",
            )}
          />
        </button>
      ))}
    </div>
  );
}
