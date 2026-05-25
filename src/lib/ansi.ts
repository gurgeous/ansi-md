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
  colors256,
  hex256,
};
