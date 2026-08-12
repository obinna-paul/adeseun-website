/**
 * Content for The Invitation (/invitation) — formerly "The Table" in the
 * sitemap (see lib/navigation.ts), the site's contact/booking page.
 *
 * Rewritten author-first, per direct instruction: "Consulting" (an
 * executive-advisory category left over from the earlier fabricated
 * framing) is replaced with "Workshops," a natural extension of Think
 * Before You Speak's subject rather than a corporate-consulting offer.
 *
 * Social URLs are still honest placeholders (`"#"`) — no confirmed
 * handles were found during research, and inventing one would read as
 * real. Lagos, unlike in the earlier draft, is now a confirmed fact
 * (AFRICAST 2025, which she coordinates, runs in Lagos; Threesixty
 * Africa Group and the NBC are both Nigerian) — not just an inference
 * from the palette's name. Form submission has no backend yet — see
 * InvitationForm's own comment.
 */

export type Interest = "Speaking" | "Workshops" | "Media" | "Literary Rights";

export const INTERESTS: Interest[] = ["Speaking", "Workshops", "Media", "Literary Rights"];

export const PAGE_EYEBROW = "The Invitation";
export const PAGE_HEADLINE = "Come to the table.";
export const PAGE_INTRO =
  "For a keynote, a workshop, a press inquiry, or the rights to something she's written — tell her what the room needs.";

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
