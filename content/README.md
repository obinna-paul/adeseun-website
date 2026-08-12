# Content layer — plan, not yet wired

Two content sources, split by who edits them and how often:

- **MDX + [Velite](https://velite.js.org/), file-based** — for The Study's
  long-form essays and The Foyer's Values Manifesto copy. Git-versioned,
  reviewable in a PR, no external account needed. Fits "always building":
  a new essay is a new `.mdx` file and a commit, nothing to provision.
  Not yet installed — add it when the first real essay is ready to go in,
  rather than carrying an unwired dependency now.

- **Sanity (headless CMS)** — for The Library (books) and The Screening
  Room (videos/press), where her team needs to add or reorder entries
  without touching code or opening a PR. Requires an actual Sanity
  project (an external account decision, not something to provision
  silently). `lib/cms.ts` is the intended integration seam once that
  project exists.

This directory is the future home of the MDX content (`content/journal/*.mdx`).
It's empty for now — populate it once real essays exist.
