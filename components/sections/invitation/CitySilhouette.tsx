/**
 * A minimal skyline, not a landmark-accurate map — a bespoke geometric
 * mark (taste-skill 4.8's exception: "a single, simple geometric mark"),
 * built from plain rectangles rather than claiming to render any real
 * building. Deliberately abstract so it doesn't overstate a location
 * that isn't confirmed yet — see invitation-content.ts's LOCATION_LABEL
 * comment.
 */
const BUILDINGS = [14, 26, 18, 34, 22, 30, 16, 24, 20, 28, 15];

export function CitySilhouette({ className }: { className?: string }) {
  const width = 220;
  const height = 40;
  const barWidth = width / BUILDINGS.length;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <line x1="0" y1={height - 0.5} x2={width} y2={height - 0.5} stroke="currentColor" strokeOpacity="0.25" />
      {BUILDINGS.map((h, i) => (
        <rect
          key={i}
          x={i * barWidth + 1.5}
          y={height - h}
          width={barWidth - 3}
          height={h}
          fill="currentColor"
          opacity={0.14 + (i % 3) * 0.06}
        />
      ))}
    </svg>
  );
}
