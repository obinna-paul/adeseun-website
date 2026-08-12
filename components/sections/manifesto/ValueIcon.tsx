import { ICON_PATHS } from "./manifesto-icons";
import type { IconId } from "./manifesto-content";

/**
 * Renders one hand-drawn mark. Every path carries `pathLength="1"` so
 * ManifestoSection's GSAP timeline can animate `stroke-dashoffset` from
 * 1 to 0 with one consistent value regardless of the path's actual
 * geometric length — and `className="manifesto-icon-path"` so that
 * timeline can select every path in the active beat with one query,
 * without React refs threaded through three component layers.
 *
 * `static` renders fully drawn with no dash-offset at all — the
 * reduced-motion / no-JS-animation path.
 */
export function ValueIcon({ icon, staticDraw = false }: { icon: IconId; staticDraw?: boolean }) {
  const paths = ICON_PATHS[icon];
  return (
    <svg
      viewBox="0 0 64 64"
      className="h-12 w-12 text-gold sm:h-14 sm:w-14"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          pathLength={1}
          className="manifesto-icon-path"
          style={staticDraw ? undefined : { strokeDasharray: 1, strokeDashoffset: 1 }}
        />
      ))}
    </svg>
  );
}
