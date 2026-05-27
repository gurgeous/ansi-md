// Shared color parsing, datasets, and nearest-match helpers.
// It keeps terminal color math in one place for static and browser code.
import type { Palette } from "@/lib/palettes";
import Color from "colorjs.io";
import { sprintf } from "sprintf-js";

// Palette color with lazy Color.js parsing for distance checks.
export class NamedColor {
  name: string;
  hex: string;
  parsed!: Color; // lazy init

  constructor(name: string, hex: string) {
    this.name = name;
    this.hex = hex;
  }

  // one-liners
  get color() { return (this.parsed ??= new Color(this.hex)) } // prettier-ignore
  toJSON() { return { hex: this.hex, name: this.name } } // prettier-ignore

  // Rehydrate serialized palette entries into lazy NamedColor objects.
  static fromData(colors: NamedColorInit[]) {
    return colors.map((color) => new NamedColor(color.name, color.hex));
  }
}

// Serialized color data for the Astro/browser boundary.
export type NamedColorInit = {
  name: string; // palette label, or ANSI 256 index as a string
  hex: string;  // canonical sRGB hex value
};

// Flatten a nested palette into named lookup entries.
export function namedColors(palette: Palette) {
  return Object.entries(palette).flatMap(([family, colors]) => {
    return Object.entries(colors).map(([shade, hex]) => {
      return new NamedColor(`${family}-${shade}`, hex);
    });
  });
}

//
// parsing/normalizing hex strings
//

// Convert loose hex input into converter display form.
export function normalizeHexInput(value: string) {
  const hex = value
    .toLowerCase()
    .replaceAll(/[^0-9a-f]/g, "")
    .slice(0, 6);
  if (hex) return `#${hex}`;
  return value.includes("#") ? "#" : "";
}

// Parse a displayed input value into #rrggbb form, or null.
export function parseHex(value: string): string | null {
  const hex = normalizeHexInput(value).replace(/^#/, "");
  if (hex.length === 6) return `#${hex}`;
  return null;
}

//
// nearest color math
//

// Find the nearest named color using OKLab perceptual distance.
export function nearestColor(hex: string, colors: NamedColor[]) {
  const target = new Color(hex);
  const match = minBy(colors, (color) => target.deltaEOK(color.color));
  if (!match) throw "impossible";
  return match;
}

// Convert any Color.js-supported color string to full sRGB hex.
export function hexify(color: string): string {
  // collapse=false to avoid 3/4 digit hex, we always want rrggbb
  return new Color(color).to("srgb").toString({ format: "hex", collapse: false });
}

// Format 8-bit RGB channels as a canonical #rrggbb string.
export function rgbHex(r: number, g: number, b: number): string {
  return sprintf("#%02x%02x%02x", r, g, b);
}
