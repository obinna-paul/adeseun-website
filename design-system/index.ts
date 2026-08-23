/**
 * Design-system barrel — one import for every token category.
 *
 *   import { colors, ease, duration, radius, motion } from "@/design-system";
 *
 * Tailwind utility classes (bg-gold, text-4xl, shadow-elevation-card, …)
 * are still the default way to consume tokens in markup — reach for this
 * barrel only when a raw value is genuinely needed in TS/JS: Motion
 * variants, canvas/SVG, or a computed inline style.
 */

export { colors, ease, duration, radius } from "../lib/design-tokens";

export {
  transitions,
  gentleReveal,
  authoritativeEntrance,
  nookExpand,
  pressFeedback,
  viewportOnce,
  staggerChildren,
  pageTransition,
} from "../lib/motion";

export * as motion from "../lib/motion";

export { display as displayFont, body as bodyFont, mono as monoFont, fontVariables } from "../lib/fonts";

export { pageMetadata, rootMetadata, personJsonLd, bookJsonLd } from "../lib/seo";

export { cn } from "../lib/utils";
