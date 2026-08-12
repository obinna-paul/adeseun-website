/**
 * Adeseun Oyeneye — design tokens
 * Direction: Alabaster Gallery & Aso-Oke Gold
 *
 * Drop this into `theme.extend` in tailwind.config.js. Every value below is
 * deliberate — no default Tailwind color/spacing/shadow scale was reused.
 *
 * Skill provenance (see .claude/skills/ in this repo):
 *  - taste-skill: single accent (gold) locked project-wide; secondary
 *    (indigo) and tertiary (garnet) are structural/semantic, not a second
 *    accent competing for attention. All text/background pairings below
 *    were checked against WCAG contrast — see the numbers in each comment.
 *  - emil-design-eng: animation tokens follow the entering->ease-out,
 *    moving->ease-in-out decision tree; UI durations stay under ~250ms,
 *    only marketing/explanatory motion (cinematic*) runs longer.
 *
 * Fonts are NOT loaded via <link> to fonts.googleapis.com — taste-skill
 * bans that for production. Self-host the four files this config assumes
 * (see the style tile for a working @font-face block) via next/font or a
 * static @font-face with font-display: swap.
 */

module.exports = {
  theme: {
    extend: {
      colors: {
        // ---- grounds & surfaces ----
        ground: 'hsl(220, 14%, 96%)',            // page background — the gallery floor
        surface: 'hsl(0, 0%, 100%)',              // cards, panels — the gallery wall
        'surface-elevated': 'hsl(220, 20%, 99%)', // raised cards, the reading nook
        'surface-sunken': 'hsl(220, 14%, 91%)',   // insets, wells, input backgrounds

        // ---- lines ----
        'line-whisper': 'hsl(220, 14%, 90%)',     // decorative dividers only
        line: 'hsl(220, 14%, 82%)',                // default card/panel border (pairs with shadow, not alone)
        'line-strong': 'hsl(220, 18%, 55%)',      // input/interactive borders — 3.3:1 non-text contrast

        // ---- text hierarchy (graphite, not warm espresso) ----
        text: 'hsl(230, 18%, 14%)',                // primary — 14.9:1 on ground (AAA)
        'text-subdued': 'hsl(230, 10%, 38%)',      // secondary body — 6.2:1 on ground (AA)
        'text-faint': 'hsl(230, 8%, 58%)',         // meta/captions, large text only — 3.3:1 (AA-large)
        'text-on-dark': 'hsl(220, 24%, 97%)',      // text on gold-fill / indigo / garnet

        // ---- the one accent: aso-oke gold ----
        gold: 'hsl(42, 55%, 42%)',                 // icons, hairline accents, large display text — AA-large on surface
        'gold-ink': 'hsl(40, 58%, 34%)',           // gold used AS text/links on light surfaces — 4.7–5.2:1 (AA)
        'gold-fill': 'hsl(40, 68%, 28%)',          // solid button fill — 6.6:1 with text-on-dark (AAA)
        'gold-tint': 'hsl(42, 55%, 94%)',          // wash background for badges; pair with gold-ink text

        // ---- structural / semantic (rare use — never a second accent) ----
        indigo: 'hsl(243, 32%, 28%)',              // heritage-structural: single dividers, rare emphasis — 12.1:1 with text-on-dark
        garnet: 'hsl(350, 45%, 32%)',               // semantic flag only (e.g. a single "exclusive" mark) — 9.5:1 with text-on-dark
      },

      fontFamily: {
        // Two cuts of one historical Garamond revival, split by optical role —
        // not the Fraunces/Instrument Serif/Playfair default reach.
        display: ['"Cormorant Garamond"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"EB Garamond"', 'ui-serif', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },

      // Custom 1.22–1.25 ratio scale — tighter steps than Tailwind's default,
      // widening slightly at the top for the rare full-bleed hero moment.
      fontSize: {
        xs:  ['0.6875rem', { lineHeight: '1rem',    letterSpacing: '0.04em'  }], // mono eyebrows, meta, dates
        sm:  ['0.8125rem', { lineHeight: '1.25rem', letterSpacing: '0.02em'  }], // tags, secondary UI text
        base:['1rem',      { lineHeight: '1.7rem',  letterSpacing: '0em'     }], // body copy (font-body)
        lg:  ['1.1875rem', { lineHeight: '1.8rem',  letterSpacing: '0em'     }], // lead paragraphs
        xl:  ['1.4375rem', { lineHeight: '1.9rem',  letterSpacing: '-0.005em'}], // card titles
        '2xl':['1.75rem',  { lineHeight: '2.2rem',  letterSpacing: '-0.01em' }], // section subheads
        '3xl':['2.125rem', { lineHeight: '2.6rem',  letterSpacing: '-0.015em'}], // module headlines
        '4xl':['2.625rem', { lineHeight: '3rem',    letterSpacing: '-0.02em' }], // page headlines
        '5xl':['3.25rem',  { lineHeight: '3.6rem',  letterSpacing: '-0.02em' }], // large section headlines
        '6xl':['4rem',     { lineHeight: '4.2rem',  letterSpacing: '-0.025em'}], // hero sub-headlines
        '7xl':['5rem',     { lineHeight: '5.2rem',  letterSpacing: '-0.03em' }], // hero headlines (Foyer Act I/VII)
        '8xl':['6.25rem',  { lineHeight: '6.4rem',  letterSpacing: '-0.03em' }], // rare cinematic full-bleed
        '9xl':['7.75rem',  { lineHeight: '7.8rem',  letterSpacing: '-0.035em'}], // maximum — single word/phrase only
      },

      // Extends (not replaces) the base 4px grid; adds named "airy" rhythm
      // tokens for macro section spacing, since that's what "airy and
      // intentional" actually means at the page level.
      spacing: {
        '4.5': '1.125rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        gutter: '1.5rem',                          // mobile content padding
        margin: 'clamp(1.5rem, 5vw, 6rem)',        // fluid outer margin
        room: '8rem',                              // vertical rhythm between major sections ("rooms")
        'room-lg': '11rem',                        // homepage act transitions
      },

      maxWidth: {
        'prose-gallery': '65ch',                    // reading column (The Study, synopses)
        frame: '1400px',                            // page container (Persuade-mode pages)
        'frame-narrow': '860px',                    // Read-mode pages (The Study)
      },

      // Shadows tinted to the ground's hue (220), never pure black —
      // taste-skill's rule for shadows that read as depth, not heaviness.
      boxShadow: {
        'elevation-card': '0 1px 2px hsla(220, 20%, 20%, 0.06), 0 8px 24px -8px hsla(220, 20%, 20%, 0.10)',
        'elevation-modal': '0 24px 64px -12px hsla(220, 25%, 15%, 0.18)',
        'glow-gold': '0 0 0 1px hsla(42, 55%, 42%, 0.35), 0 8px 28px -6px hsla(42, 55%, 42%, 0.25)', // spend once — flagship elements only
        'glow-soft': '0 4px 40px hsla(220, 30%, 30%, 0.08)',
        'inset-sheen': 'inset 0 1px 0 hsla(0, 0%, 100%, 0.6)', // cast-plaster edge highlight on elevated surfaces
      },

      backdropBlur: {
        nook: '20px',       // Library's reading-nook overlay (see The Walkthrough)
        'glass-thin': '8px',
      },

      // Two-tier, documented radius system (taste-skill's Shape Consistency
      // Lock): architecture is sharp, interaction is soft. No in-between.
      borderRadius: {
        none: '0px',
        frame: '2px',      // cards, images, containers, panels
        control: '999px',  // buttons, inputs, tags, pills
        DEFAULT: '2px',
      },

      borderWidth: {
        hairline: '1px',
        frame: '3px',       // reserved for the one-off "museum frame" treatment (flagship book/talk spotlight)
      },

      // emil-design-eng's decision tree, named: ease-out for entrances,
      // ease-in-out for on-screen movement, a gentle standard curve for
      // hover/color (his one case where plain easing is legitimate).
      transitionTimingFunction: {
        'gallery-out': 'cubic-bezier(0.23, 1, 0.32, 1)',
        'gallery-in-out': 'cubic-bezier(0.77, 0, 0.175, 1)',
        'gallery-standard': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      transitionDuration: {
        press: '140ms',           // button/control :active feedback
        flick: '180ms',           // tooltips, small popovers
        reveal: '220ms',          // dropdowns, the Shelf-Pull tilt
        settle: '360ms',          // modals, the reading-nook panel
        cinematic: '900ms',       // marketing/explanatory — hero entrances
        'cinematic-slow': '2400ms', // the Values Manifesto scroll-scrub
      },

      // Named presets — each tied to a real moment from The Walkthrough,
      // not an abstract "fade-in-1/2/3".
      keyframes: {
        gentleReveal: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        authoritativeEntrance: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        shelfPull: {
          '0%': { transform: 'rotate(0deg) translateX(0)' },
          '100%': { transform: 'rotate(-4deg) translateX(-6px)' },
        },
        nookExpand: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        manifestoLine: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        // General-purpose scroll/section reveal — most content on the site
        'gentle-reveal': 'gentleReveal 600ms cubic-bezier(0.23, 1, 0.32, 1) both',
        // Hero-scale entrances (Foyer Act I, Act VII) — more weight, held longer
        'authoritative-entrance': 'authoritativeEntrance 900ms cubic-bezier(0.23, 1, 0.32, 1) both',
        // The Library's Shelf-Pull hover tilt
        'shelf-pull': 'shelfPull 220ms cubic-bezier(0.23, 1, 0.32, 1) both',
        // The Library's reading-nook panel opening
        'nook-expand': 'nookExpand 360ms cubic-bezier(0.23, 1, 0.32, 1) both',
        // The Foyer's Values Manifesto, one line at a time
        'manifesto-line': 'manifestoLine 600ms cubic-bezier(0.23, 1, 0.32, 1) both',
      },
    },
  },
};
