// Shared ANSI 256 palette data for code generation and color tools.

import { rgbHex } from "@/lib/color.ts";
import type { Colors } from "@/lib/palettes";

const CUBE = [0x00, 0x5f, 0x87, 0xaf, 0xd7, 0xff] as const;

// Calculate one ANSI 256 palette color from its 16-255 index.
// https://gist.github.com/hSATAC/1095100
export function hex256(index: number) {
  if (index >= 232) {
    const gray = 8 + (index - 232) * 10;
    return rgbHex(gray, gray, gray);
  }

  const off = index - 16;
  const r = CUBE[Math.floor(off / 36) % 6];
  const g = CUBE[Math.floor(off / 6) % 6];
  const b = CUBE[off % 6];
  return rgbHex(r, g, b);
}

// export Colors
export default Object.fromEntries(range(16, 256).map((ii) => [String(ii), hex256(ii)])) as Colors;
