import { cn } from "@/lib/utils";

/**
 * A bespoke typographic mark, not a hand-rolled illustration — the
 * exception taste-skill's icon rule (4.8) explicitly allows: "a single,
 * simple geometric mark... a wordmark in display type." Real letterforms
 * (Cormorant Garamond, the site's own display face) inside a thin ring,
 * not a drawn logo — no real brand mark exists yet, and inventing an
 * elaborate crest would be exactly the fabricated-asset problem the
 * honest-placeholder pattern elsewhere on this site avoids.
 */
export function Monogram({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center rounded-full border border-current/40 font-display text-lg tracking-[0.02em]",
        className,
      )}
    >
      AO
    </span>
  );
}
