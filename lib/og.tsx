import { ImageResponse } from "next/og";
import { SITE_NAME } from "./seo";

/**
 * The site's social card, rendered on demand by `next/og` (Satori) and
 * shared by both `app/opengraph-image.tsx` and `app/twitter-image.tsx`
 * so the two never drift. In-brand: the dark hero-ground, an emerald
 * rule, her name, and her executive role line as the supporting text —
 * executive-first, per the site's current positioning.
 *
 * No custom font is loaded: Satori supports ttf/otf/woff, and the site's
 * faces ship as woff2 only, so forcing one would mean re-encoding fonts
 * for a 1200×630 image most viewers see at thumbnail size. The default
 * face, set on a heavily art-directed dark ground, reads as intentional.
 * Every element that holds more than one child sets `display: flex`
 * explicitly — Satori requires it (unlike a browser, it has no block
 * default).
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";
export const OG_ALT = `${SITE_NAME} — Entrepreneur, Media Executive, Architect, Interior Designer, Author, Corporate Adviser`;

const HERO_GROUND = "hsl(160, 28%, 6%)";
const ON_DARK = "hsl(38, 32%, 97%)";
const EMERALD = "hsl(152, 46%, 42%)"; // lightened from the token's L24 — this is a bright accent line on a dark ground, not text-on-light
const ON_DARK_DIM = "hsla(38, 32%, 97%, 0.62)";

export function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: HERO_GROUND,
          padding: "80px 96px",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", letterSpacing: "0.28em", fontSize: 26, color: EMERALD, textTransform: "uppercase" }}>
          Entrepreneur &middot; Media Executive &middot; Architect
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 128, color: ON_DARK, lineHeight: 1 }}>{SITE_NAME}</div>
          <div style={{ display: "flex", width: 180, height: 4, background: EMERALD, marginTop: 40, marginBottom: 40 }} />
          <div style={{ display: "flex", fontSize: 34, color: ON_DARK_DIM, lineHeight: 1.35, maxWidth: 900 }}>
            Building businesses, shaping spaces, and telling African stories.
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 24, color: ON_DARK_DIM, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Vice President, 360Africa Media Group
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
