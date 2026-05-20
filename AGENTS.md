## Project

`Ansi.md` is a static Astro + TypeScript reference for ANSI codes, terminal color, CLI output, tools, and TUI libraries.

Save tokens: keep this file short. Add durable rules only.

## Commands

- Use `just`: `just install`, `just dev`, `just fmt`, `just build`.
- No `package.json` scripts.

## Design

- Text-first technical reference; not a product site.
- Visual reference: fil-c.org/calling_convention; borrow structure, not palette.
- Brand color/font live in `src/main.css` `@theme`.
- Avoid heroes, cards, gradients, decorative imagery, marketing copy, per-page subtitles.
- Prefer top margins for document flow.

## Code

- Source/assets stay under `src/`; never use `public/`.
- Prefer semantic HTML and classes, not IDs.
- Use MDX for authored long-form pages when useful.
- Keep client JS rare.
- Avoid wrapper-only helpers; import library utilities directly unless adding project behavior.

## Tailwind

- Use Tailwind `@apply` in `src/main.css` for repeated doc/site elements.
- Local component styles are okay; the Vite plugin adds `@reference "@/main.css"`.
- CSS uses nesting; avoid arbitrary bracket utilities.
- Responsive utilities: only `sm:` and `lg:`; never `md:`.

## Data

- Keep tables explicit and auditable.
- Generated data goes in `src/data/`; build/cache output goes in `tmp/`.

## Handoff

- Run `just build` before substantial handoff.
- Do not take browser screenshots unless asked.
