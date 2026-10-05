/**
 * Content for The Boardroom (/executive-profile) — the formal
 * professional-authority layer of the site, per the blueprint's brief:
 * suitable for investors, governments, conference organizers,
 * journalists, partners, and corporate institutions.
 *
 * The credentials and career highlights below are reproduced from her
 * own confirmed executive-profile materials. Nothing here is invented
 * or estimated.
 */

export type CareerHighlight = { description: string };

export const CAREER_HIGHLIGHTS: CareerHighlight[] = [
  { description: "Foundations in design, communication, and enterprise." },
  { description: "Expansion into architecture and interior solutions." },
  { description: "Growth into media, brand, and business leadership." },
  { description: "Development of women-focused and youth-oriented initiatives." },
  { description: "Multi-brand leadership across media, lifestyle, and social impact." },
  { description: "Vice President, 360Africa Media Group — regional influence and strategic advisory." },
];

export const CREDENTIALS: string[] = [
  "Associate, Chartered Institute of Directors Nigeria",
  "Marketing and Communications — IBMI Berlin",
  "Economics and International Business — IBMI Berlin",
  "Diploma in Interior Design — Alison",
  "Life Coach: Roles and Responsibilities — Alison",
  "IT Management: Software and Databases — Alison",
  "The Way to Life — World Bible School",
];

export const KEY_FACTS = {
  experience: "Media, design, strategy, and enterprise",
  businesses: "360Africa Media, 360AfricaTv, Bounty5 Home, Girlbye Pro, Universal Worship Network",
  focus: "Leadership, communication, design, advisory, empowerment.",
  governance: "Chartered Director (CIoD)",
};

export const PAGE_EYEBROW = "The Boardroom";
export const PAGE_HEADLINE = "Adeseun Oyeneye.";
export const PAGE_SUBHEAD = "Vice President, 360Africa Media Group";
export const PAGE_INTRO =
  "A multidisciplinary executive whose work intersects media, design, strategy, and human development — recognised for building ideas into institutions and translating vision into tangible impact.";

export const CTA_HEADLINE = "Bring her expertise into the room.";
export const CTA_BODY = "For advisory work, governance conversations, or a formal introduction.";
export const CTA_HREF = "/contact";
