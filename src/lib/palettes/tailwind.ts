// Adapt Tailwind into a shared palette template.
import { hexify } from "@/lib/color.ts";
import raw from "tailwindcss/colors";
import type { Colors, Palette } from "./index.ts";

// Convert from Tailwind's export shape into our palette template shape.
const oklch = pickBy(raw, isObject) as Record<string, Colors>;
export default mapValues(oklch, (colors) => mapValues(colors, hexify)) as Palette;
