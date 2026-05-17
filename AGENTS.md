## Project

`ansi.md` is a static Astro + TypeScript reference for ANSI codes, terminal capabilities, CLI output, progress UI, tools, and TUI libraries.

Save tokens: keep this file short. Add durable rules only; do not duplicate obvious repo state.

## Commands

- Install: `just install`
- Dev: `just dev`
- Format: `just fmt`
- Build/check: `just build`
- No `package.json` scripts; this repo always uses `just`.

## Design

- Text-first technical reference, not a product site.
- Fluid layout; left TOC on desktop, below header on mobile.
- Header: logo/wordmark only.
- Avoid heroes, cards, gradients, decorative imagery, marketing copy, and per-page subtitles.
- Use color sparingly and only to explain terminal behavior.

## Code

- Keep source under `src/`; never use `public/`.
- Assets belong in `src/assets/` and should be imported through Astro/Vite.
- Prefer semantic HTML for docs: `article`, `section`, `nav`, `table`, `pre`, `code`, `dl`, `ol`, `ul`.
- Use MDX for authored long-form pages when useful; embed interactive islands as Astro components.
- Keep client JS rare.

## Tailwind

- Use Tailwind utilities in markup/components. Raw CSS selectors are a code smell.
- `src/styles/main.css` should normally contain only `@import "tailwindcss";`.
- Avoid inline `style` attributes and DOM `.style` writes; use SVG attributes or component state for dynamic previews.
- Use arbitrary Tailwind values only when needed.

## Data

- Keep content/data tables explicit and easy to audit.
- Prefer `foo?: T` and `undefined`.
- Keep generated data under `src/data/`; caches/build output under `tmp/`.

## Handoff

- Keep changes small and direct.
- Do not add Ruby or unrelated tooling.
- Run `just build` before handing off substantial changes.
