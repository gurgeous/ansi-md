# Ansi.md (h1)

Small markdown-style demo page for the global `article` content styles.

This paragraph exercises body copy, inline `code`, and a regular [link](/ansi-256). Fil-C is a fanatically compatible memory-safe implementation of C and C++. Lots of software compiles and runs with Fil-C with zero or minimal changes. All memory safety errors are caught as Fil-C panics. Fil-C achieves this using a combination of concurrent garbage collection and invisible capabilities (InvisiCaps). Every possibly-unsafe C and C++ operation is checked. Fil-C has no unsafe statement and only limited FFI to unsafe code.

## Prose (h2)

Another paragraph makes the default vertical spacing obvious. The page should feel like a plain technical note rather than a product surface.

### Lists (h3)

- ANSI escapes are transport.
- `terminfo` is capability metadata.
- Palette names are data, not semantics.

1. Start with plain text.
1. Add color only where it helps.
1. Keep fallbacks readable.

## Code (h2)

Inline code should stay quiet, while fenced code should read like a copied note:

```sh
printf '\033[38;5;45mcyan-ish\033[0m\n'
printf '\033[1;38;2;12;74;110mbrand\033[0m\n'

GUB="hello $hi world"
```

## Table (h2)

<div class="table-wrap">

| Mode      | Example                 | Notes                     |
| --------- | ----------------------- | ------------------------- |
| 16 color  | `\x1b[31m`              | Theme slot, not fixed RGB |
| 256 color | `\x1b[38;5;45m`         | Portable indexed palette  |
| Truecolor | `\x1b[38;2;56;189;248m` | Useful when supported     |

</div>

## Form Bits (h2)

<label>
  Sample input
  <input value="#38bdf8" />
</label>

<output>#38bdf8 looks readable on a dark terminal background.</output>
