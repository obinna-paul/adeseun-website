/**
 * The first Tab stop on every page: a link that jumps keyboard and
 * screen-reader users straight past the chrome to the page's <main>.
 * Off-screen until focused (`.skip-link` in globals.css), then it slides
 * into view as a real gold-bordered control. Targets `#main-content`,
 * the id every page's <main> carries.
 *
 * A plain anchor, not a button or router Link — the browser's native
 * in-page-anchor focus handling is exactly what a skip link needs, and
 * the target <main> has `tabIndex={-1}` so focus actually lands there.
 */
export function SkipLink() {
  return (
    <a href="#main-content" className="skip-link">
      Skip to content
    </a>
  );
}
