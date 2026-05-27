// Adapt Catppuccin into a shared palette template.
import type { Colors } from "@/lib/palettes";
import { flavors } from "@catppuccin/palette";

// Convert from the upstream package shape into our palette template shape.
const palette = mapValues(flavors, (flavor) => mapValues(flavor.colors, (c) => c.hex));

export const ghostty16: { normal: Colors; bright: Colors } = {
  normal: {
    black: "#51576d",
    red: "#e78284",
    green: "#a6d189",
    yellow: "#e5c890",
    blue: "#8caaee",
    magenta: "#f4b8e4",
    cyan: "#81c8be",
    white: "#a5adce",
  },
  bright: {
    black: "#626880",
    red: "#e78284",
    green: "#a6d189",
    yellow: "#e5c890",
    blue: "#8caaee",
    magenta: "#f4b8e4",
    cyan: "#81c8be",
    white: "#b5bfe2",
  },
};

export default palette;
