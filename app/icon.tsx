import { ImageResponse } from "next/og";

/**
 * The favicon, generated rather than a hand-exported PNG — same reasoning
 * as opengraph-image.tsx: one source of truth, no asset to keep in sync.
 * Reuses the Monogram's mark (components/ui/Monogram.tsx: "AO" in a thin
 * ring, the site's one sanctioned logo substitute per taste-skill 4.8 —
 * no invented crest) but as a solid gold ring on the hero-ground dark,
 * not the transparent/currentColor treatment the on-page Monogram uses:
 * a favicon has no surrounding text color to inherit, and needs to read
 * at 16–32px against both light and dark browser chrome, which a filled
 * dark circle with a light ring does far more reliably than a thin
 * outline on nothing.
 */

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "hsl(230, 24%, 7%)",
          borderRadius: "50%",
          border: "1.5px solid hsl(42, 55%, 42%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "serif",
            fontSize: 15,
            letterSpacing: "0.02em",
            color: "hsl(220, 24%, 97%)",
          }}
        >
          AO
        </div>
      </div>
    ),
    { ...size },
  );
}
