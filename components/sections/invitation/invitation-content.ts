/**
 * Content for The Invitation (/invitation) — formerly "The Table" in the
 * sitemap (see lib/navigation.ts), the site's contact/booking page.
 *
 * Social URLs are honest placeholders (`"#"`), not fabricated profile
 * links — no confirmed handles exist yet, and inventing one would read
 * as real. The location line leans on a detail the brand system itself
 * already established (the palette is literally named "Aso-Oke Gold" —
 * a Yoruba/Nigerian textile), not something invented here, but it's
 * still unconfirmed as *her* specific base; flagged for her to correct.
 * Form submission has no backend yet — see InvitationForm's own comment.
 */

export type Interest = "Speaking" | "Consulting" | "Media" | "Literary Rights";

export const INTERESTS: Interest[] = ["Speaking", "Consulting", "Media", "Literary Rights"];

export const PAGE_EYEBROW = "The Invitation";
export const PAGE_HEADLINE = "Come to the table.";
export const PAGE_INTRO =
  "For a keynote, a boardroom, a press inquiry, or the rights to something she's written — tell her what the room needs.";

export const SUCCESS_HEADLINE = "Thank you.";
export const SUCCESS_BODY = "This landed with her directly. Expect a reply within a few days.";

export const LOCATION_LABEL = "Lagos — and wherever the next boardroom is.";

export type SocialLink = { label: string; href: string };
export const SOCIAL_LINKS: SocialLink[] = [
  { label: "LinkedIn", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "X", href: "#" },
];

export const NEWSLETTER_HEADLINE = "A note, now and then.";
export const NEWSLETTER_BODY =
  "No digest, no drip campaign — just a short letter when there's something worth saying. Rare, and written herself.";
