/**
 * The site's rooms — shared by the 404 page, Header, Footer, and
 * MobileNav so none of them drift out of sync.
 *
 * "The Blueprint" — a new spatial metaphor replacing the old "rooms in a
 * house" (The Foyer, The Library, The Study, ...), which read as literary
 * and domestic. The site is being repositioned as Adeseun Oyeneye's
 * executive/business "personal headquarters" first per direct
 * instruction, but the user explicitly asked to keep a spatial/narrative
 * metaphor rather than flatten every page to a plain conventional name.
 * The new concept fits her literally: she's a practicing architect and
 * interior designer, and the site becomes a building she designed —
 * toured room by room, each mapped to a business function instead of a
 * domestic one. It also echoes the blueprint's own hero line ("creating
 * institutions designed to outlive their founder") and the name of the
 * scope document itself ("WEBSITE SCOPE BLUEPRINT"). Real content from
 * the old rooms is re-homed into this map rather than discarded — The
 * Library and The Screening Room keep their names outright (they already
 * fit); everything else gets a new room name for its new function. See
 * each new page's own content file for what moved from where.
 *
 * `primary: true` marks the ~7 rooms the persistent Header shows (per
 * the nav-simplicity brief: keep the visible bar short even though the
 * building has real depth behind it). Footer and MobileNav both render
 * the *complete* list regardless of `primary` — that's their established
 * job as the full building directory.
 *
 * `built: false` marks a planned room with no page behind its route yet
 * (The Archive, The Study, The Drafting Room, The Press Room, The
 * Gallery — gated on real case-study material, essays, project
 * photography, and approved press assets that don't exist in this repo
 * yet). Every consumer honors the flag rather than silently linking to a
 * 404: Header/Footer/MobileNav show the name but strip the link and grey
 * it with a "Soon" note; the 404 page's own list drops unbuilt rooms
 * entirely. Flip to `true` the same commit the page ships in.
 */
export type SitePage = {
  name: string;
  href: string;
  note: string;
  built: boolean;
  primary?: boolean;
};

export const SITE_PAGES: SitePage[] = [
  { name: "The Blueprint", href: "/about", note: "Her story", built: true, primary: true },
  { name: "The Atrium", href: "/businesses", note: "Companies & ventures", built: true, primary: true },
  { name: "The Archive", href: "/work", note: "Case studies", built: false, primary: true },
  { name: "The Library", href: "/books", note: "Published books", built: true, primary: true },
  { name: "The Study", href: "/ideas", note: "Journal", built: false, primary: true },
  { name: "The Screening Room", href: "/media", note: "Appearances & video", built: true, primary: true },
  { name: "The Reception", href: "/contact", note: "Get in touch", built: true, primary: true },
  { name: "The Boardroom", href: "/executive-profile", note: "Career & credentials", built: true },
  { name: "The Podium", href: "/speaking", note: "Invite her", built: true },
  { name: "The Hall", href: "/awards", note: "Recognition", built: true },
  { name: "The Foundation", href: "/impact", note: "Vision & legacy", built: true },
  { name: "The Drafting Room", href: "/architecture-design", note: "Architecture & design", built: false },
  { name: "The Press Room", href: "/press", note: "Media room", built: false },
  { name: "The Gallery", href: "/gallery", note: "Photography", built: false },
];
