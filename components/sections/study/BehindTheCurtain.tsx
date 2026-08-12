import { CURTAIN_ITEMS } from "./study-content";
import { CurtainItem } from "./CurtainItem";

/**
 * CSS multi-column masonry — `columns-*` + `break-inside-avoid` on each
 * item — not a JS masonry library. The layout is genuinely simple
 * enough that reaching for a library would be exactly the "heavier
 * tool than the task needs" pick-ui-library warns against.
 *
 * Each note/snippet gets a small deterministic tilt (cycling through a
 * fixed set of values by index) rather than `Math.random()` — a random
 * value would differ between the server's render and the client's
 * first paint and trigger a hydration mismatch, the same class of bug
 * fixed across the Manifesto and Hero.
 */
const ROTATIONS = [-1.4, 0.8, -0.6, 1.2, -1.1, 0.5];

export function BehindTheCurtain() {
  return (
    <section className="bg-surface px-gutter py-room" aria-label="Behind the curtain">
      <div className="mx-auto max-w-3xl text-center">
        <span className="font-mono text-xs uppercase tracking-[0.15em] text-gold-ink">Behind the Curtain</span>
        <h2 className="mt-3 text-balance font-display text-4xl font-semibold text-text sm:text-5xl">
          The parts that don&rsquo;t make the book jacket.
        </h2>
      </div>

      <div className="mx-auto mt-16 max-w-5xl columns-1 gap-6 sm:columns-2 lg:columns-3">
        {CURTAIN_ITEMS.map((item, i) => (
          <CurtainItem key={item.id} item={item} rotate={item.kind === "note" ? (ROTATIONS[i % ROTATIONS.length] ?? 0) : 0} />
        ))}
      </div>
    </section>
  );
}
