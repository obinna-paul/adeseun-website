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

// Dream M12, PluvSeptember 30 Publishing, The Red Chair Talk, and
// 360AfricaTv were removed from this list per direct instruction — no
// real image exists for any of them yet. Re-add each once a real photo
// is supplied, rather than showing a placeholder in the meantime.
export const VENTURES: Venture[] = [
  {
    id: "360africa-media",
    name: "360Africa Media Group",
    role: "Vice President",
    blurb: "Media, communications, content, and business development — the platform behind AFRICAST 2025 and Nigeria House at the Paris 2024 Olympics.",
    image: "/images/adeseun-portrait-media-bw.jpg",
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
];

export const PAGE_EYEBROW = "The Atrium";
export const PAGE_HEADLINE = "The businesses she's building.";
export const PAGE_INTRO =
  "The companies are part of the story — not the whole of it. Each one below connects back to her, introduced here rather than duplicated in full.";

export const CTA_HEADLINE = "Interested in working with one of these?";
export const CTA_BODY = "Partnership, press, or a direct introduction — start the same place every conversation does.";
export const CTA_HREF = "/contact";
