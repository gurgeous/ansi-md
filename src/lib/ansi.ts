// ANSI escape-code helpers.
// Shared palette math lives under lib/palettes.

// one-liners
function fg16(idx: number, b = false) { return `\\e[${(b ? 90 : 30) + idx}m` } // prettier-ignore
function bg16(idx: number, b = false) { return `\\e[${(b ? 100 : 40) + idx}m` } // prettier-ignore
function fg256(idx: number) { return `\\e[38;5;${idx}m` } // prettier-ignore
function bg256(idx: number) { return `\\e[48;5;${idx}m` } // prettier-ignore
function fgDefault() { return "\\e[39m" } // prettier-ignore
function bgDefault() { return "\\e[49m" } // prettier-ignore

export default {
  fgDefault,
  bgDefault,
  fg16,
  bg16,
  fg256,
  bg256,
};
