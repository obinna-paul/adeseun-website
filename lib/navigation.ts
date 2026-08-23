/**
 * The site's rooms — shared by the 404 page, Header, Footer, and
 * MobileNav so none of them drift out of sync.
 *
 * "The Blueprint" — a spatial metaphor replacing the old "rooms in a
 * house" (The Foyer, The Library, The Study, ...), which read as literary
 * and domestic. The site is Adeseun Oyeneye's executive/business
 * "personal headquarters," framed as a building she designed — she's a
 * real architect and interior designer — toured room by room, each
 * mapped to a business function instead of a domestic one.
 *
 * Only rooms with a real, built page are listed here, per direct
 * instruction: no "Soon"/placeholder entries for pages that don't exist
 * yet. Work (case studies), Ideas (journal/essays), Architecture &
 * Design, Press, and Gallery were removed from this list rather than
 * flagged unbuilt — add each back the same commit its real page ships,
 * once real assets/content exist for it (case-study depth, essays,
 * project photography, an approved press kit).
 *
 * `primary: true` marks the rooms the persistent Header shows (per the
 * nav-simplicity brief: keep the visible bar short). Footer and
 * MobileNav both render the complete list regardless of `primary` —
 * that's their established job as the full building directory.
 */
export type SitePage = {
  name: string;
  href: string;
  note: string;
  primary?: boolean;
};

export const SITE_PAGES: SitePage[] = [
  { name: "The Blueprint", href: "/about", note: "Her story", primary: true },
  { name: "The Atrium", href: "/businesses", note: "Companies & ventures", primary: true },
  { name: "The Library", href: "/books", note: "Published books", primary: true },
  { name: "The Screening Room", href: "/media", note: "Appearances & video", primary: true },
  { name: "The Reception", href: "/contact", note: "Get in touch", primary: true },
  { name: "The Boardroom", href: "/executive-profile", note: "Career & credentials" },
  { name: "The Podium", href: "/speaking", note: "Invite her" },
  { name: "The Hall", href: "/awards", note: "Recognition" },
  { name: "The Foundation", href: "/impact", note: "Vision & legacy" },
];
