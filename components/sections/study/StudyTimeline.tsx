import { TIMELINE_MILESTONES } from "./study-content";
import { TimelineCard } from "./TimelineCard";

/**
 * A generic map, as asked — this reads exactly the same whether
 * TIMELINE_MILESTONES has six entries or sixty, and whether it's the
 * local file it is today or a future Sanity query. Nothing here knows
 * or cares how many milestones exist.
 *
 * The vertical line: a single 1px div, positioned at the left edge on
 * mobile (one column, nothing to alternate) and re-centered at lg — no
 * JS involved in the line itself, purely responsive CSS.
 */
export function StudyTimeline() {
  return (
    <section className="bg-ground px-gutter py-room" aria-label="Her timeline">
      <div className="mx-auto max-w-3xl text-center">
        <span className="font-mono text-xs uppercase tracking-[0.15em] text-gold-ink">The Study</span>
        <h2 className="mt-3 text-balance font-display text-4xl font-semibold text-text sm:text-5xl">
          A room built one chapter at a time.
        </h2>
      </div>

      <div className="relative mx-auto mt-20 max-w-5xl">
        <div
          aria-hidden="true"
          className="absolute left-6 top-0 h-full w-px bg-line lg:left-1/2"
        />
        {/* Plain flex-column, not a 2-column grid: with grid-cols-2 and
            column-only placement, CSS Grid's auto-flow packs consecutive
            items into shared rows (items 0+1 side by side, 2+3, etc.) —
            not one milestone per row alternating sides, which is what a
            timeline actually needs. Each TimelineCard handles its own
            left/right alignment via `lg:w-1/2` + margin, so a single
            column of full-width rows is enough. */}
        <div className="flex flex-col gap-20 lg:gap-24">
          {TIMELINE_MILESTONES.map((milestone, i) => (
            <TimelineCard key={milestone.id} milestone={milestone} side={i % 2 === 0 ? "left" : "right"} />
          ))}
        </div>
      </div>
    </section>
  );
}
