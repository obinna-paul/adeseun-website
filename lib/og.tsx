import { ImageResponse } from "next/og";
import { SITE_NAME } from "./seo";

/**
 * The site's social card, rendered on demand by `next/og` (Satori) and
 * shared by both `app/opengraph-image.tsx` and `app/twitter-image.tsx`
 * so the two never drift. In-brand: the Foyer's dark hero-ground, a
 * single aso-oke-gold rule, her name, and the four real book titles as
 * the supporting line — author-first, the same hierarchy the site keeps.
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
export const OG_ALT = `${SITE_NAME} — Author of Think Before You Speak, Beyond the Mundane, Tranquility, and Black Is Beautiful`;

const HERO_GROUND = "hsl(230, 24%, 7%)";
const ON_DARK = "hsl(220, 24%, 97%)";
const GOLD = "hsl(42, 55%, 42%)";
const ON_DARK_DIM = "hsla(220, 24%, 97%, 0.62)";

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
        <div style={{ display: "flex", letterSpacing: "0.28em", fontSize: 26, color: GOLD, textTransform: "uppercase" }}>
          Author
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 128, color: ON_DARK, lineHeight: 1 }}>{SITE_NAME}</div>
          <div style={{ display: "flex", width: 180, height: 4, background: GOLD, marginTop: 40, marginBottom: 40 }} />
          <div style={{ display: "flex", fontSize: 34, color: ON_DARK_DIM, lineHeight: 1.35, maxWidth: 900 }}>
            Think Before You Speak · Beyond the Mundane · Tranquility · Black Is Beautiful
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 24, color: ON_DARK_DIM, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Founder &amp; Vice-President, Threesixty Africa Media
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
