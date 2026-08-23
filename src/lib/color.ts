// Shared color parsing, datasets, and nearest-match helpers.
// It keeps terminal color math in one place for static and browser code.
import Color from "colorjs.io";
import { sprintf } from "sprintf-js";

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

// Return the nearest parsed color from a candidate list.
export function nearestColor(needle: Color, haystack: Color[]) {
  if (haystack.length === 0) throw "impossible";
  return minBy(haystack, (color) => needle.deltaEOK(color))!;
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

// Calculate perceived brightness for a canonical #rrggbb color.
export function luma(hex: string) {
  const [r, g, b] = hex.match(/\w\w/g)!.map((channel) => parseInt(channel, 16));
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}
