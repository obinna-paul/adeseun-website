/**
 * Content for The Reception (/contact) — formerly "The Invitation"
 * (`/invitation`, and "The Table" before that — see lib/navigation.ts),
 * the site's contact/booking page. Renamed again and reframed
 * executive-first as part of the wider restructure: the interest
 * categories now match the blueprint's Contact spec (business, speaking,
 * media, partnership, general) rather than the earlier author-first
 * "Workshops"/"Literary Rights" framing alone — Literary Rights is kept
 * (the books are still real and still hers), Workshops folds into
 * Speaking, and Advisory/Partnership are added for the executive side of
 * the work.
 *
 * Social URLs are still honest placeholders (`"#"`) — no confirmed
 * handles were found during research, and inventing one would read as
 * real. Lagos is a confirmed fact (AFRICAST 2025, which she coordinates,
 * runs in Lagos; 360Africa Media Group and the NBC are both Nigerian) —
 * not just an inference from the palette's name. Form submission has no
 * backend yet — see InvitationForm's own comment.
 */

export type Interest = "Speaking" | "Advisory" | "Media" | "Partnership" | "Literary Rights";

export const INTERESTS: Interest[] = ["Speaking", "Advisory", "Media", "Partnership", "Literary Rights"];

export const PAGE_EYEBROW = "The Reception";
export const PAGE_HEADLINE = "Let's work together.";
export const PAGE_INTRO =
  "For a keynote, an advisory engagement, a media inquiry, a partnership, or the rights to something she's written — tell her what the room needs.";

export const SUCCESS_HEADLINE = "Thank you.";
export const SUCCESS_BODY = "This landed with her directly. Expect a reply within a few days.";

export const LOCATION_LABEL = "Lagos — and wherever the next room full of readers is.";

export type SocialLink = { label: string; href: string };
export const SOCIAL_LINKS: SocialLink[] = [
  { label: "LinkedIn", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "X", href: "#" },
];

export const NEWSLETTER_HEADLINE = "A note, now and then.";
export const NEWSLETTER_BODY =
  "No digest, no drip campaign — just a short letter when there's something worth saying. Rare, and written herself.";
