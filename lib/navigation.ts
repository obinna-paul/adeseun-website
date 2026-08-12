/**
 * The site's rooms — shared by the 404 page and the global footer so
 * the two never drift out of sync. Names/notes follow the established
 * sitemap (The Oyeneye Doctrine, see The Walkthrough).
 *
 * "The Table" is renamed "The Invitation" here per direct instruction —
 * same room (the contact/booking destination Study's CTA already links
 * to), new name and route. Updated in one place; StudyCTA's CTA_HREF
 * points at the same "/invitation" path.
 */
export const SITE_ROOMS = [
  { name: "The Foyer", href: "/", note: "Home" },
  { name: "The Library", href: "/library", note: "Books" },
  { name: "The Screening Room", href: "/screening-room", note: "Videos & Media" },
  { name: "The Boardroom", href: "/boardroom", note: "Executive" },
  { name: "The Study", href: "/study", note: "Voice & Philosophy" },
  { name: "The Invitation", href: "/invitation", note: "Contact" },
] as const;
