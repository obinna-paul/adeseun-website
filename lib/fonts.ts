import localFont from "next/font/local";

/**
 * Self-hosted via next/font/local — taste-skill bans loading Google Fonts
 * via <link> in production. next/font handles subsetting, preloading, and
 * zero layout shift automatically; font files live in app/fonts/.
 *
 * Two cuts of one Garamond revival, split by optical role — display carries
 * headlines at weight 600, body carries reading copy at 400. Not a
 * display-serif-plus-Inter default pairing.
 */

export const display = localFont({
  src: [
    { path: "../app/fonts/CormorantGaramond-normal.woff2", weight: "500 700", style: "normal" },
    { path: "../app/fonts/CormorantGaramond-italic.woff2", weight: "500", style: "italic" },
  ],
  variable: "--font-display",
  display: "swap",
});

export const body = localFont({
  src: [
    { path: "../app/fonts/EBGaramond-normal.woff2", weight: "400 500", style: "normal" },
    { path: "../app/fonts/EBGaramond-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-body",
  display: "swap",
});

export const mono = localFont({
  src: [
    { path: "../app/fonts/IBMPlexMono-500.woff2", weight: "500", style: "normal" },
    { path: "../app/fonts/IBMPlexMono-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-mono",
  display: "swap",
});

/** Combined className for <html>, wiring all three font CSS variables at once. */
export const fontVariables = `${display.variable} ${body.variable} ${mono.variable}`;
