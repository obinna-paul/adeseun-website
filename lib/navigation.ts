/**
 * The site's rooms — shared by the 404 page and the global footer so
 * the two never drift out of sync. Names/notes follow the established
 * sitemap (The Oyeneye Doctrine, see The Walkthrough).
 *
 * "The Table" is renamed "The Invitation" here per direct instruction —
 * same room (the contact/booking destination Study's CTA already links
 * to), new name and route. Updated in one place; StudyCTA's CTA_HREF
 * points at the same "/invitation" path.
 *
 * `built: false` marks a planned room with no page behind its route yet
 * (The Boardroom) — real navigation dead ends caught during the pre-
 * deploy audit. Both consumers honor the flag rather than silently
 * linking to a 404: Footer shows the name but strips the link and greys
 * it with a "Soon" note; the 404 page's "here's where you can actually
 * go" grid drops unbuilt rooms entirely (a 404 page is the last place
 * that should link to another dead end). Flip to `true` the same commit
 * the page ships in — nothing else to update. The Screening Room made
 * that flip once its real content (her YouTube appearances) landed.
 */
export const SITE_ROOMS = [
  { name: "The Foyer", href: "/", note: "Home", built: true },
  { name: "The Library", href: "/library", note: "Books", built: true },
  { name: "The Screening Room", href: "/screening-room", note: "Videos & Media", built: true },
  { name: "The Boardroom", href: "/boardroom", note: "Executive", built: false },
  { name: "The Study", href: "/study", note: "Voice & Philosophy", built: true },
  { name: "The Invitation", href: "/invitation", note: "Contact", built: true },
] as const;
