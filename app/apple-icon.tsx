import { ImageResponse } from "next/og";

/**
 * Same mark as icon.tsx, at the 180×180 Apple touch-icon convention Next
 * picks up automatically. Kept as a separate file rather than one icon
 * reused at two sizes — iOS specifically looks for `apple-icon`, and its
 * home-screen tile has square corners it rounds itself (Apple applies its
 * own squircle mask), so this omits the `border-radius` icon.tsx uses for
 * browser tabs and fills the square edge-to-edge instead.
 */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 128,
            height: 128,
            borderRadius: "50%",
            border: "3px solid hsl(42, 55%, 42%)",
            fontFamily: "serif",
            fontSize: 56,
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
