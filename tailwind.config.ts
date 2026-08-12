import type { Config } from "tailwindcss";

/**
 * Tailwind v4 reads design tokens from `app/styles/tokens.css` via the
 * `@theme` directive — that file is the canonical source, not this one.
 * v4 also auto-detects content sources, so no `content` glob is required.
 *
 * This file exists because the project wants an explicit, typed config
 * checkpoint (and a place for future plugins) — kept intentionally thin
 * per taste-skill's v4 guidance, rather than duplicating tokens here.
 */
const config: Config = {
  darkMode: undefined, // no dark mode — Page Theme Lock, see tokens.css
  plugins: [],
};

export default config;
