"use client";

import { RadioGroup } from "@base-ui/react/radio-group";
import { Radio } from "@base-ui/react/radio";
import { INTERESTS, type Interest } from "./invitation-content";

/**
 * Custom-styled radios, real radio semantics — base-ui's Radio renders
 * an actual hidden `<input type="radio">` alongside the styled `<span>`,
 * so keyboard arrow-key navigation between options and form semantics
 * come for free (per pick-ui-library: don't hand-roll what the
 * primitive already solves).
 */
export function InterestRadioGroup({
  value,
  onValueChange,
}: {
  value: Interest | null;
  onValueChange: (value: Interest) => void;
}) {
  return (
    <div>
      <span className="font-mono text-xs uppercase tracking-[0.12em] text-text-faint">I&rsquo;m interested in</span>
      <RadioGroup
        value={value}
        onValueChange={(next) => onValueChange(next as Interest)}
        aria-label="I'm interested in"
        className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4"
      >
        {INTERESTS.map((interest) => (
          <label key={interest} className="group flex cursor-pointer items-center gap-3">
            <Radio.Root
              value={interest}
              className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-line transition-colors duration-150 ease-gallery-standard data-[checked]:border-gold group-hover:border-gold-ink"
            >
              <Radio.Indicator className="h-2.5 w-2.5 rounded-full bg-gold-fill data-[unchecked]:hidden" />
            </Radio.Root>
            <span className="font-body text-base text-text transition-colors duration-150 ease-gallery-standard group-hover:text-gold-ink">
              {interest}
            </span>
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}
