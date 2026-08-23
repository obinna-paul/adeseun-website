/**
 * Content for The Atrium (/businesses) — the enterprise ecosystem page
 * the blueprint calls "Founder & Entrepreneur." Every company name, role,
 * and one-line description below is grounded in her own confirmed
 * executive-profile materials (the same source as study-content.ts's
 * `CREDENTIAL_GROUPS` and the "26 years" / "360Africa Media Group" /
 * "Bounty5 Home" corrections applied there) — nothing invented.
 *
 * Per the blueprint's own implementation rule: this page introduces and
 * contextualizes each company, it does not duplicate the full corporate
 * websites — so each entry is a short blurb, not a case study (Selected
 * Work & Case Studies is a separate, deferred page for that).
 */

export type Venture = {
  id: string;
  name: string;
  role: string;
  blurb: string;
  image?: string;
  imageFit?: "cover" | "contain";
};

export const VENTURES: Venture[] = [
  {
    id: "360africa-media",
    name: "360Africa Media Group",
    role: "Vice President",
    blurb: "Media, communications, content, and business development — the platform behind AFRICAST 2025 and Nigeria House at the Paris 2024 Olympics.",
    image: "/images/adeseun-portrait-media-bw.jpg",
  },
  {
    id: "360africa-tv",
    name: "360AfricaTv",
    role: "Vice President, 360Africa Media Group",
    blurb: "Television, African culture, entertainment, and storytelling.",
  },
  {
    id: "bounty5-home",
    name: "Bounty5 Home",
    role: "CEO",
    blurb: "Home architecture and interior design — concept to execution, spatial vision to material selection.",
    image: "/images/adeseun-architecture-site.jpg",
  },
  {
    id: "universal-worship-network",
    name: "Universal Worship Network",
    role: "Founder",
    blurb: "A faith-based media platform — worship, inspiration, and connection.",
    image: "/images/adeseun-universal-worship-network.png",
  },
  {
    id: "girlbye-pro",
    name: "Girlbye Pro",
    role: "Creative Director",
    blurb: "A styling agency — consumer and lifestyle brand work.",
    image: "/images/adeseun-portrait-approachable.jpg",
  },
  {
    id: "dream-m12",
    name: "Dream M12",
    role: "Founder",
    blurb: "Fitness and lifestyle.",
  },
  {
    id: "pluv-publishing",
    name: "PluvSeptember 30 Publishing",
    role: "Founder",
    blurb: "Publishing — the imprint behind her own books, and open to more.",
  },
  {
    id: "red-chair-talk",
    name: "The Red Chair Talk",
    role: "Executive Producer",
    blurb: "A talk show on relationships and community.",
  },
];

export const PAGE_EYEBROW = "The Atrium";
export const PAGE_HEADLINE = "The businesses she's building.";
export const PAGE_INTRO =
  "The companies are part of the story — not the whole of it. Each one below connects back to her, introduced here rather than duplicated in full.";

export const CTA_HEADLINE = "Interested in working with one of these?";
export const CTA_BODY = "Partnership, press, or a direct introduction — start the same place every conversation does.";
export const CTA_HREF = "/contact";
