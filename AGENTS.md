## Critical

- Ignore `old/`; it is inactive reference trash.
- Use `just`: `build`, `lint`, `test`. Use the narrowest relevant check.
  Standalone script changes do not require `just llm`; reserve it for substantive changes.
- Never add `package.json` scripts
- Give PRs a descriptive title; never use `wip`.
- Succintness/simplicity is a core value, don't add layers

## Design

- Text-first technical reference; not a product site.
- Brand color/font live in `src/main.css` `@theme`.
- Avoid heroes, cards, gradients, marketing copy, and subtitles.
- Top margins for document flow.

## Code

- Assets stay under `src/`; never use `public/`.
- Prefer `@/...` imports instead of relative source imports.
- `index.ts` only re-exports package-facing API, not internal helpers.
- Prefer semantic HTML and classes, not IDs.
- Keep client JS rare.
- Prefix HTML element refs with `$`, including element arrays/maps.
- Function type aliases use an `Fn` suffix.
- Add a short file-purpose comment atop non-test TS files.
- TS comments explain purpose or constraints, never names.

## Compactness

- Use es-toolkit via auto-imports; do not import it manually.
- Do not remove auto-imports; ignore build warnings about unused imports.
- Avoid wrapper-only helpers.
- Omit trivial TS return types; avoid pointless `: void`.
- Avoid `private`/`readonly`; use them only when genuinely valuable.
- For impossible internal states, prefer `throw "impossible"` over verbose error scaffolding.
- Do not add tests for `throw "impossible"` paths.

## Tailwind

- Use `src/main.css` `@apply` for repeated doc/site elements.
- Local component styles are okay; Vite adds `@reference`.
- Put repeated/interesting Astro utility groups in scoped `<style>`.
- CSS uses nesting; avoid arbitrary bracket utilities.
- Responsive utilities: only `sm:` and `lg:`; never `md:`.
