// Adapt Catppuccin into a shared palette template.
import type { Palette } from "@/lib/palettes";
import { flavors } from "@catppuccin/palette";

// Convert from the upstream package shape into our palette template shape.
export default mapValues(flavors, (flavor) => mapValues(flavor.colors, (c) => c.hex)) as Palette;

// https://github.com/catppuccin/ghostty/blob/main/themes/catppuccin-frappe.conf
export const ghostty16: Palette = {
  normal: {
    black: "#51576d",
    red: "#e78284",
    green: "#a6d189",
    yellow: "#e5c890",
    blue: "#8caaee",
    magenta: "#f4b8e4",
    cyan: "#81c8be",
    white: "#a5adce",
    foreground: "#c6d0f5",
    background: "#303446",
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
