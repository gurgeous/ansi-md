// Adapt Tailwind into a shared palette template.
import { hexify } from "@/lib/color.ts";
import raw from "tailwindcss/colors";
import type { Colors } from "./index.ts";

// Convert from Tailwind's export shape into our palette template shape.
const oklch = pickBy(raw, isObject) as Record<string, Colors>;
const palette = mapValues(oklch, (colors) => mapValues(colors, hexify));
export default palette;
