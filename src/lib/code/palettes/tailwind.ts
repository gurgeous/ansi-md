// Adapt Tailwind into a Palette
import { type Colors } from "@/lib/code/code.ts";
import Color from "colorjs.io";
import raw from "tailwindcss/colors";

// Convert from Tailwind's export shape into our palette template shape.
const oklch = pickBy(raw, isObject) as Record<string, Colors>;
const palette = mapValues(oklch, (colors) => mapValues(colors, colorToHex));
export default palette;

// Convert any Color.js-supported color string to expanded sRGB hex.
function colorToHex(color: string) {
  return new Color(color).to("srgb").toString({ format: "hex", collapse: false });
}
