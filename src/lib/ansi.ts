// ANSI escape-code helpers and ANSI-16 theme data.
// Shared ANSI 256 palette math lives under lib/palettes.
import { NamedColor } from "@/lib/color.ts";

// ansi16
const catppuccin16: { normal: NamedColor[]; bright: NamedColor[] } = {
  normal: [
    new NamedColor("black", "#51576d"),
    new NamedColor("red", "#e78284"),
    new NamedColor("green", "#a6d189"),
    new NamedColor("yellow", "#e5c890"),
    new NamedColor("blue", "#8caaee"),
    new NamedColor("magenta", "#f4b8e4"),
    new NamedColor("cyan", "#81c8be"),
    new NamedColor("white", "#a5adce"),
  ],
  bright: [
    new NamedColor("bright black", "#626880"),
    new NamedColor("bright red", "#e78284"),
    new NamedColor("bright green", "#a6d189"),
    new NamedColor("bright yellow", "#e5c890"),
    new NamedColor("bright blue", "#8caaee"),
    new NamedColor("bright magenta", "#f4b8e4"),
    new NamedColor("bright cyan", "#81c8be"),
    new NamedColor("bright white", "#b5bfe2"),
  ],
};

// one-liners
function fg16(idx: number, b = false) { return `\\e[${(b ? 90 : 30) + idx}m` } // prettier-ignore
function bg16(idx: number, b = false) { return `\\e[${(b ? 100 : 40) + idx}m` } // prettier-ignore
function fg256(idx: number) { return `\\e[38;5;${idx}m` } // prettier-ignore
function bg256(idx: number) { return `\\e[48;5;${idx}m` } // prettier-ignore

export default {
  fg16,
  bg16,
  fg256,
  bg256,
  catppuccin16,
};
