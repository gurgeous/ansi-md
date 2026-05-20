# Ansi.md

Small markdown-style demo page for the global `article` content styles.

This paragraph exercises body copy, inline `code`, and a regular [link](/ansi-256). The goal is not content yet. It is a compact surface for checking type, spacing, borders, and document rhythm.

## Prose

Another paragraph makes the default vertical spacing obvious. The page should feel like a plain technical note rather than a product surface.

### Lists

- ANSI escapes are transport.
- `terminfo` is capability metadata.
- Palette names are data, not semantics.

1. Start with plain text.
1. Add color only where it helps.
1. Keep fallbacks readable.

## Definition List

<dl>
  <dt>CSI</dt>
  <dd>Control Sequence Introducer. Most cursor movement and SGR styling starts here.</dd>
  <dt>OSC</dt>
  <dd>Operating System Command. Often used for titles, hyperlinks, and clipboard integration.</dd>
  <dt>SGR</dt>
  <dd>Select Graphic Rendition. The part people usually mean when they say ANSI colors.</dd>
</dl>

## Code

Inline code should stay quiet, while fenced code should read like a copied note:

```sh
printf '\033[38;5;45mcyan-ish\033[0m\n'
printf '\033[1;38;2;12;74;110mbrand\033[0m\n'
```

## Table

<div class="table-wrap">

| Mode      | Example                 | Notes                     |
| --------- | ----------------------- | ------------------------- |
| 16 color  | `\x1b[31m`              | Theme slot, not fixed RGB |
| 256 color | `\x1b[38;5;45m`         | Portable indexed palette  |
| Truecolor | `\x1b[38;2;56;189;248m` | Useful when supported     |

</div>

## Form Bits

<label>
  Sample input
  <input value="#38bdf8" />
</label>

<output>#38bdf8 looks readable on a dark terminal background.</output>
