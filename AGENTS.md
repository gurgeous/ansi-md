## Critical

- Ignore `old/`; it is inactive reference trash.
- Use `just`: `install`, `dev`, `fmt`, `lint`, `test`, `build`.
- No `package.json` scripts.
- Run `just check` after code changes.
- Run `just build` before substantial handoff.
- Do not take browser screenshots unless asked.

## Project

`Ansi.md` is a static Astro + TypeScript reference for ANSI,
terminal color, CLI output, tools, and TUI libraries.

Save tokens: keep this file short. Add durable rules only.

## Design

- Text-first technical reference; not a product site.
- Visual reference: fil-c.org/calling_convention; structure,
  not palette.
- Brand color/font live in `src/main.css` `@theme`.
- Avoid heroes, cards, gradients, marketing copy, and subtitles.
- Prefer top margins for document flow.

## Code

- Source/assets stay under `src/`; never use `public/`.
- Prefer `@/...` imports instead of relative source imports.
- Use es-toolkit via auto-imports; do not import it manually.
- Do not remove auto-imports; ignore build warnings about unused imports.
- Prefer semantic HTML and classes, not IDs.
- Keep client JS rare.
- Avoid wrapper-only helpers.
- Prefix HTML element refs with `$`, including element arrays/maps.
- Function type aliases use an `Fn` suffix.
- Omit trivial TS return types; avoid pointless `: void`.
- Avoid `private`/`readonly`; use them only when genuinely valuable.
- For impossible internal states, prefer `throw "impossible"` over verbose error scaffolding.
- TS comments explain purpose or constraints, never names.
- Add a short file-purpose comment atop non-test TS files.
- Keep source lines at 72 columns or less.
- Palette/code modules live in `src/lib/code/`.

## Tailwind

- Use `src/main.css` `@apply` for repeated doc/site elements.
- Local component styles are okay; Vite adds `@reference`.
- Put repeated/interesting Astro utility groups in scoped `<style>`.
- CSS uses nesting; avoid arbitrary bracket utilities.
- Responsive utilities: only `sm:` and `lg:`; never `md:`.
