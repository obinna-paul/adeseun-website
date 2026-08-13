import {
  BEYOND_EYEBROW,
  BEYOND_HEADLINE,
  BEYOND_INTRO,
  CREDENTIAL_GROUPS,
  BEYOND_CLIENTS_LINE,
} from "./study-content";

/**
 * Deliberately the plainest section on the page — no photography, no
 * motion choreography beyond the site's default scroll-in (this reads
 * more like a reference page than a documentary beat, and dressing it
 * up with the same cinematic treatment as the timeline would overstate
 * its importance relative to the books). `bg-surface-sunken` (the same
 * paper-toned ground The Library uses) marks it as a distinct register
 * from both Behind the Curtain's white and the timeline/CTA's ground —
 * "the reference material," not narrative.
 *
 * A plain `<ul>` per credential group, not a card grid — this is a list
 * of facts, not a gallery of moments; treating it like one would be the
 * same mismatch taste-skill's icon rule warns against elsewhere
 * (decorating something that doesn't need decoration).
 */
export function BeyondThePage() {
  return (
    <section className="bg-surface-sunken px-gutter py-room" aria-label="Beyond the page">
      <div className="mx-auto max-w-3xl text-center">
        <span className="font-mono text-xs uppercase tracking-[0.15em] text-gold-ink">{BEYOND_EYEBROW}</span>
        <h2 className="mt-3 text-balance font-display text-3xl font-semibold text-text sm:text-4xl">
          {BEYOND_HEADLINE}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-text-subdued">{BEYOND_INTRO}</p>
      </div>

      <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2">
        {CREDENTIAL_GROUPS.map((group) => (
          <div key={group.label}>
            <span className="font-mono text-xs uppercase tracking-[0.12em] text-text-faint">{group.label}</span>
            <ul className="mt-4 space-y-3 border-l border-line pl-4">
              {group.items.map((item) => (
                <li key={item} className="text-sm leading-snug text-text-subdued">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-16 max-w-2xl text-center text-sm leading-relaxed text-text-faint">
        {BEYOND_CLIENTS_LINE}
      </p>
    </section>
  );
}
