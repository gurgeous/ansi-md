// Shared ANSI 256 palette data for code generation and color tools.

import { rgbHex } from "@/lib/color.ts";
import type { Colors } from "@/lib/palettes";

const CUBE = [0x00, 0x5f, 0x87, 0xaf, 0xd7, 0xff] as const;

// Calculate one ANSI 256 palette color from its 16-255 index.
export function hex256(index: number) {
  if (index >= 232) {
    const gray = 8 + (index - 232) * 10;
    return rgbHex(gray, gray, gray);
  }

  const offset = index - 16;
  const r = CUBE[Math.floor(offset / 36) % 6];
  const g = CUBE[Math.floor(offset / 6) % 6];
  const b = CUBE[offset % 6];
  return rgbHex(r, g, b);
}

const ansi256: Colors = Object.fromEntries(range(16, 256).map((index) => [String(index), hex256(index)]));

export default ansi256;
