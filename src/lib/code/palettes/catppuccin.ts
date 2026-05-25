// Adapt Catppuccin into a Palette
import { flavors } from "@catppuccin/palette";

// Convert from the upstream package shape into our palette template shape.
const palette = mapValues(flavors, (flavor) => mapValues(flavor.colors, (c) => c.hex));
export default palette;
