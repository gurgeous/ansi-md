## Project

`Ansi.md` is a static Astro + TypeScript reference for ANSI codes, terminal capabilities, CLI output, progress UI, tools, and TUI libraries.

Save tokens: keep this file short. Add durable rules only; do not duplicate obvious repo state.

## Commands

- Install: `just install`
- Dev: `just dev`
- Format: `just fmt`
- Build/check: `just build`
- No `package.json` scripts; this repo always uses `just`.

## Design

- Text-first technical reference, not a product site.
- Visual reference: fil-c.org/calling_convention; borrow structure only, not palette.
- Brand color/font live in `src/main.css` `@theme`; use `brand` tokens as accents, not body copy.
- Fluid layout; left TOC on desktop, below header on mobile.
- Avoid heroes, cards, gradients, decorative imagery, marketing copy, and per-page subtitles.
- Use color sparingly and only to explain terminal behavior.
- Prefer top margins for document flow; avoid bottom margins except deliberate heading typography.

## Code

- Keep source under `src/`; never use `public/`.
- Assets belong in `src/assets/` and should be imported through Astro/Vite.
- Prefer semantic HTML for docs: `article`, `section`, `nav`, `table`, `pre`, `code`, `dl`, `ol`, `ul`.
- Use classes, not IDs; use named anchors only when fragment links need targets.
- Use MDX for authored long-form pages when useful; embed interactive islands as Astro components.
- Keep client JS rare.

## Tailwind

- Prefer semantic HTML plus Tailwind `@apply` in `src/main.css` for repeated doc/site elements.
- Keep one-off component layout classes small; do not hide Tailwind utility lists in JS/TS constants.
- Components/pages may add local styles when they are clearer than bloating global element rules.
- CSS should use nesting for related rules; avoid pointless `body` nesting.
- Avoid inline `style` attributes and DOM `.style` writes; use SVG attributes or component state for dynamic previews.
- Avoid arbitrary Tailwind bracket values/variants; use standard scale classes.

## Data

- Keep content/data tables explicit and easy to audit.
- Prefer `foo?: T` and `undefined`.
- Keep generated data under `src/data/`; caches/build output under `tmp/`.

## Handoff

- Keep changes small and direct.
- Do not add Ruby or unrelated tooling.
- Run `just build` before handing off substantial changes.
- Do not take browser screenshots unless the user asks.
