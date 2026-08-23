/**
 * Content for The Boardroom (/executive-profile) — the formal
 * professional-authority layer of the site, per the blueprint's brief:
 * suitable for investors, governments, conference organizers,
 * journalists, partners, and corporate institutions.
 *
 * Every figure below (the 1999–2025 timeline, the credentials, the 26
 * years) is reproduced from her own confirmed executive-profile
 * materials — the same source that corrected study-content.ts's earlier
 * "24 years" / "Threesixty Africa Media" to "26 years" / "360Africa
 * Media Group." Nothing here is invented or estimated.
 */

export type TimelineEntry = { year: string; description: string };

export const CAREER_TIMELINE: TimelineEntry[] = [
  { year: "1999", description: "Foundations in design, communication, and enterprise." },
  { year: "2005", description: "Expansion into architecture and interior solutions." },
  { year: "2010", description: "Growth into media, brand, and business leadership." },
  { year: "2016", description: "Development of women-focused and youth-oriented initiatives." },
  { year: "2020", description: "Multi-brand leadership across media, lifestyle, and social impact." },
  { year: "2025", description: "Vice President, 360Africa Media Group — regional influence and strategic advisory." },
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
  years: "26 years",
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
