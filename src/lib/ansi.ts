// ANSI-specific palette data and escape-code helpers.
// Keep the xterm 256-color table separate from generic color matching logic.
import { NamedColor, hex2 } from "@/lib/color.ts";

const CUBE = [0x00, 0x5f, 0x87, 0xaf, 0xd7, 0xff] as const;

// ANSI 256 colors 16-255 as named canonical sRGB hex values.
const colors256 = range(16, 256).map((index) => {
  return new NamedColor(String(index), hex256(index));
});

// Calculate one ANSI 256 palette color from its 16-255 index.
function hex256(index: number) {
  if (index >= 232) {
    const gray = 8 + (index - 232) * 10;
    return `#${hex2(gray)}${hex2(gray)}${hex2(gray)}`;
  }

  const offset = index - 16;
  const r = CUBE[Math.floor(offset / 36) % 6];
  const g = CUBE[Math.floor(offset / 6) % 6];
  const b = CUBE[offset % 6];
  return `#${hex2(r)}${hex2(g)}${hex2(b)}`;
}

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
  colors256,
  hex256,
};
