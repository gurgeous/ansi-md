// Previous ANSI 256 palette generator kept for reference during rewrites.
// Active palette generators live under src/lib/code.
import { camelCase, snakeCase } from "es-toolkit/string";
import { type Language, headerComment, languageByKey, languages } from "./code.ts";
import { paddedRows } from "./util.ts";

// Source ANSI 256 color before adding its terminal code.
export type Ansi256Color = {
  name: string; // Name copied from the Vim reference table.
  hex: string; // Canonical value emitted in generated snippets.
};

// Source names: Vim Tips Wiki, "Xterm256 color names for console Vim".
// vim.fandom.com/wiki/Xterm256_color_names_for_console_Vim
// Omit ANSI 0-15 because those slots are terminal-theme colors.
export const ansi256 = [
  { name: "Black", hex: "#000000" },
  { name: "NavyBlue", hex: "#00005f" },
  { name: "DarkBlue", hex: "#000087" },
  { name: "Blue3", hex: "#0000af" },
  { name: "Blue3", hex: "#0000d7" },
  { name: "Blue1", hex: "#0000ff" },
  { name: "DarkGreen", hex: "#005f00" },
  { name: "DeepSkyBlue4", hex: "#005f5f" },
  { name: "DeepSkyBlue4", hex: "#005f87" },
  { name: "DeepSkyBlue4", hex: "#005faf" },
  { name: "DodgerBlue3", hex: "#005fd7" },
  { name: "DodgerBlue2", hex: "#005fff" },
  { name: "Green4", hex: "#008700" },
  { name: "SpringGreen4", hex: "#00875f" },
  { name: "Turquoise4", hex: "#008787" },
  { name: "DeepSkyBlue3", hex: "#0087af" },
  { name: "DeepSkyBlue3", hex: "#0087d7" },
  { name: "DodgerBlue1", hex: "#0087ff" },
  { name: "Green3", hex: "#00af00" },
  { name: "SpringGreen3", hex: "#00af5f" },
  { name: "DarkCyan", hex: "#00af87" },
  { name: "LightSeaGreen", hex: "#00afaf" },
  { name: "DeepSkyBlue2", hex: "#00afd7" },
  { name: "DeepSkyBlue1", hex: "#00afff" },
  { name: "Green3", hex: "#00d700" },
  { name: "SpringGreen3", hex: "#00d75f" },
  { name: "SpringGreen2", hex: "#00d787" },
  { name: "Cyan3", hex: "#00d7af" },
  { name: "DarkTurquoise", hex: "#00d7d7" },
  { name: "Turquoise2", hex: "#00d7ff" },
  { name: "Green1", hex: "#00ff00" },
  { name: "SpringGreen2", hex: "#00ff5f" },
  { name: "SpringGreen1", hex: "#00ff87" },
  { name: "MediumSpringGreen", hex: "#00ffaf" },
  { name: "Cyan2", hex: "#00ffd7" },
  { name: "Cyan1", hex: "#00ffff" },
  { name: "DarkRed", hex: "#5f0000" },
  { name: "DeepPink4", hex: "#5f005f" },
  { name: "Purple4", hex: "#5f0087" },
  { name: "Purple4", hex: "#5f00af" },
  { name: "Purple3", hex: "#5f00d7" },
  { name: "BlueViolet", hex: "#5f00ff" },
  { name: "Orange4", hex: "#5f5f00" },
  { name: "Grey37", hex: "#5f5f5f" },
  { name: "MediumPurple4", hex: "#5f5f87" },
  { name: "SlateBlue3", hex: "#5f5faf" },
  { name: "SlateBlue3", hex: "#5f5fd7" },
  { name: "RoyalBlue1", hex: "#5f5fff" },
  { name: "Chartreuse4", hex: "#5f8700" },
  { name: "DarkSeaGreen4", hex: "#5f875f" },
  { name: "PaleTurquoise4", hex: "#5f8787" },
  { name: "SteelBlue", hex: "#5f87af" },
  { name: "SteelBlue3", hex: "#5f87d7" },
  { name: "CornflowerBlue", hex: "#5f87ff" },
  { name: "Chartreuse3", hex: "#5faf00" },
  { name: "DarkSeaGreen4", hex: "#5faf5f" },
  { name: "CadetBlue", hex: "#5faf87" },
  { name: "CadetBlue", hex: "#5fafaf" },
  { name: "SkyBlue3", hex: "#5fafd7" },
  { name: "SteelBlue1", hex: "#5fafff" },
  { name: "Chartreuse3", hex: "#5fd700" },
  { name: "PaleGreen3", hex: "#5fd75f" },
  { name: "SeaGreen3", hex: "#5fd787" },
  { name: "Aquamarine3", hex: "#5fd7af" },
  { name: "MediumTurquoise", hex: "#5fd7d7" },
  { name: "SteelBlue1", hex: "#5fd7ff" },
  { name: "Chartreuse2", hex: "#5fff00" },
  { name: "SeaGreen2", hex: "#5fff5f" },
  { name: "SeaGreen1", hex: "#5fff87" },
  { name: "SeaGreen1", hex: "#5fffaf" },
  { name: "Aquamarine1", hex: "#5fffd7" },
  { name: "DarkSlateGray2", hex: "#5fffff" },
  { name: "DarkRed", hex: "#870000" },
  { name: "DeepPink4", hex: "#87005f" },
  { name: "DarkMagenta", hex: "#870087" },
  { name: "DarkMagenta", hex: "#8700af" },
  { name: "DarkViolet", hex: "#8700d7" },
  { name: "Purple", hex: "#8700ff" },
  { name: "Orange4", hex: "#875f00" },
  { name: "LightPink4", hex: "#875f5f" },
  { name: "Plum4", hex: "#875f87" },
  { name: "MediumPurple3", hex: "#875faf" },
  { name: "MediumPurple3", hex: "#875fd7" },
  { name: "SlateBlue1", hex: "#875fff" },
  { name: "Yellow4", hex: "#878700" },
  { name: "Wheat4", hex: "#87875f" },
  { name: "Grey53", hex: "#878787" },
  { name: "LightSlateGrey", hex: "#8787af" },
  { name: "MediumPurple", hex: "#8787d7" },
  { name: "LightSlateBlue", hex: "#8787ff" },
  { name: "Yellow4", hex: "#87af00" },
  { name: "DarkOliveGreen3", hex: "#87af5f" },
  { name: "DarkSeaGreen", hex: "#87af87" },
  { name: "LightSkyBlue3", hex: "#87afaf" },
  { name: "LightSkyBlue3", hex: "#87afd7" },
  { name: "SkyBlue2", hex: "#87afff" },
  { name: "Chartreuse2", hex: "#87d700" },
  { name: "DarkOliveGreen3", hex: "#87d75f" },
  { name: "PaleGreen3", hex: "#87d787" },
  { name: "DarkSeaGreen3", hex: "#87d7af" },
  { name: "DarkSlateGray3", hex: "#87d7d7" },
  { name: "SkyBlue1", hex: "#87d7ff" },
  { name: "Chartreuse1", hex: "#87ff00" },
  { name: "LightGreen", hex: "#87ff5f" },
  { name: "LightGreen", hex: "#87ff87" },
  { name: "PaleGreen1", hex: "#87ffaf" },
  { name: "Aquamarine1", hex: "#87ffd7" },
  { name: "DarkSlateGray1", hex: "#87ffff" },
  { name: "Red3", hex: "#af0000" },
  { name: "DeepPink4", hex: "#af005f" },
  { name: "MediumVioletRed", hex: "#af0087" },
  { name: "Magenta3", hex: "#af00af" },
  { name: "DarkViolet", hex: "#af00d7" },
  { name: "Purple", hex: "#af00ff" },
  { name: "DarkOrange3", hex: "#af5f00" },
  { name: "IndianRed", hex: "#af5f5f" },
  { name: "HotPink3", hex: "#af5f87" },
  { name: "MediumOrchid3", hex: "#af5faf" },
  { name: "MediumOrchid", hex: "#af5fd7" },
  { name: "MediumPurple2", hex: "#af5fff" },
  { name: "DarkGoldenrod", hex: "#af8700" },
  { name: "LightSalmon3", hex: "#af875f" },
  { name: "RosyBrown", hex: "#af8787" },
  { name: "Grey63", hex: "#af87af" },
  { name: "MediumPurple2", hex: "#af87d7" },
  { name: "MediumPurple1", hex: "#af87ff" },
  { name: "Gold3", hex: "#afaf00" },
  { name: "DarkKhaki", hex: "#afaf5f" },
  { name: "NavajoWhite3", hex: "#afaf87" },
  { name: "Grey69", hex: "#afafaf" },
  { name: "LightSteelBlue3", hex: "#afafd7" },
  { name: "LightSteelBlue", hex: "#afafff" },
  { name: "Yellow3", hex: "#afd700" },
  { name: "DarkOliveGreen3", hex: "#afd75f" },
  { name: "DarkSeaGreen3", hex: "#afd787" },
  { name: "DarkSeaGreen2", hex: "#afd7af" },
  { name: "LightCyan3", hex: "#afd7d7" },
  { name: "LightSkyBlue1", hex: "#afd7ff" },
  { name: "GreenYellow", hex: "#afff00" },
  { name: "DarkOliveGreen2", hex: "#afff5f" },
  { name: "PaleGreen1", hex: "#afff87" },
  { name: "DarkSeaGreen2", hex: "#afffaf" },
  { name: "DarkSeaGreen1", hex: "#afffd7" },
  { name: "PaleTurquoise1", hex: "#afffff" },
  { name: "Red3", hex: "#d70000" },
  { name: "DeepPink3", hex: "#d7005f" },
  { name: "DeepPink3", hex: "#d70087" },
  { name: "Magenta3", hex: "#d700af" },
  { name: "Magenta3", hex: "#d700d7" },
  { name: "Magenta2", hex: "#d700ff" },
  { name: "DarkOrange3", hex: "#d75f00" },
  { name: "IndianRed", hex: "#d75f5f" },
  { name: "HotPink3", hex: "#d75f87" },
  { name: "HotPink2", hex: "#d75faf" },
  { name: "Orchid", hex: "#d75fd7" },
  { name: "MediumOrchid1", hex: "#d75fff" },
  { name: "Orange3", hex: "#d78700" },
  { name: "LightSalmon3", hex: "#d7875f" },
  { name: "LightPink3", hex: "#d78787" },
  { name: "Pink3", hex: "#d787af" },
  { name: "Plum3", hex: "#d787d7" },
  { name: "Violet", hex: "#d787ff" },
  { name: "Gold3", hex: "#d7af00" },
  { name: "LightGoldenrod3", hex: "#d7af5f" },
  { name: "Tan", hex: "#d7af87" },
  { name: "MistyRose3", hex: "#d7afaf" },
  { name: "Thistle3", hex: "#d7afd7" },
  { name: "Plum2", hex: "#d7afff" },
  { name: "Yellow3", hex: "#d7d700" },
  { name: "Khaki3", hex: "#d7d75f" },
  { name: "LightGoldenrod2", hex: "#d7d787" },
  { name: "LightYellow3", hex: "#d7d7af" },
  { name: "Grey84", hex: "#d7d7d7" },
  { name: "LightSteelBlue1", hex: "#d7d7ff" },
  { name: "Yellow2", hex: "#d7ff00" },
  { name: "DarkOliveGreen1", hex: "#d7ff5f" },
  { name: "DarkOliveGreen1", hex: "#d7ff87" },
  { name: "DarkSeaGreen1", hex: "#d7ffaf" },
  { name: "Honeydew2", hex: "#d7ffd7" },
  { name: "LightCyan1", hex: "#d7ffff" },
  { name: "Red1", hex: "#ff0000" },
  { name: "DeepPink2", hex: "#ff005f" },
  { name: "DeepPink1", hex: "#ff0087" },
  { name: "DeepPink1", hex: "#ff00af" },
  { name: "Magenta2", hex: "#ff00d7" },
  { name: "Magenta1", hex: "#ff00ff" },
  { name: "OrangeRed1", hex: "#ff5f00" },
  { name: "IndianRed1", hex: "#ff5f5f" },
  { name: "IndianRed1", hex: "#ff5f87" },
  { name: "HotPink", hex: "#ff5faf" },
  { name: "HotPink", hex: "#ff5fd7" },
  { name: "MediumOrchid1", hex: "#ff5fff" },
  { name: "DarkOrange", hex: "#ff8700" },
  { name: "Salmon1", hex: "#ff875f" },
  { name: "LightCoral", hex: "#ff8787" },
  { name: "PaleVioletRed1", hex: "#ff87af" },
  { name: "Orchid2", hex: "#ff87d7" },
  { name: "Orchid1", hex: "#ff87ff" },
  { name: "Orange1", hex: "#ffaf00" },
  { name: "SandyBrown", hex: "#ffaf5f" },
  { name: "LightSalmon1", hex: "#ffaf87" },
  { name: "LightPink1", hex: "#ffafaf" },
  { name: "Pink1", hex: "#ffafd7" },
  { name: "Plum1", hex: "#ffafff" },
  { name: "Gold1", hex: "#ffd700" },
  { name: "LightGoldenrod2", hex: "#ffd75f" },
  { name: "LightGoldenrod2", hex: "#ffd787" },
  { name: "NavajoWhite1", hex: "#ffd7af" },
  { name: "MistyRose1", hex: "#ffd7d7" },
  { name: "Thistle1", hex: "#ffd7ff" },
  { name: "Yellow1", hex: "#ffff00" },
  { name: "LightGoldenrod1", hex: "#ffff5f" },
  { name: "Khaki1", hex: "#ffff87" },
  { name: "Wheat1", hex: "#ffffaf" },
  { name: "Cornsilk1", hex: "#ffffd7" },
  { name: "Grey100", hex: "#ffffff" },
  { name: "Grey3", hex: "#080808" },
  { name: "Grey7", hex: "#121212" },
  { name: "Grey11", hex: "#1c1c1c" },
  { name: "Grey15", hex: "#262626" },
  { name: "Grey19", hex: "#303030" },
  { name: "Grey23", hex: "#3a3a3a" },
  { name: "Grey27", hex: "#444444" },
  { name: "Grey30", hex: "#4e4e4e" },
  { name: "Grey35", hex: "#585858" },
  { name: "Grey39", hex: "#626262" },
  { name: "Grey42", hex: "#6c6c6c" },
  { name: "Grey46", hex: "#767676" },
  { name: "Grey50", hex: "#808080" },
  { name: "Grey54", hex: "#8a8a8a" },
  { name: "Grey58", hex: "#949494" },
  { name: "Grey62", hex: "#9e9e9e" },
  { name: "Grey66", hex: "#a8a8a8" },
  { name: "Grey70", hex: "#b2b2b2" },
  { name: "Grey74", hex: "#bcbcbc" },
  { name: "Grey78", hex: "#c6c6c6" },
  { name: "Grey82", hex: "#d0d0d0" },
  { name: "Grey85", hex: "#dadada" },
  { name: "Grey89", hex: "#e4e4e4" },
  { name: "Grey93", hex: "#eeeeee" },
] as const;

// Literal palette row inferred from the ANSI 256 source table.
export type Ansi256Entry = (typeof ansi256)[number];

// Convert zero-based palette index to xterm color code.
export function ansiCode(index: number): number {
  return index + 16;
}

export { languages };

// Language metadata type accepted by the ANSI 256 renderer.
export type Ansi256Language = Language;

// Palette row after adding code and language-ready key.
type NamedColor = Ansi256Entry & {
  code: number; // Xterm number shown in generated comments.
  key: string; // Collision-safe identifier for generated output.
};

// Build generated names and suffix duplicates with their xterm code.
function namedColors(
  format: (name: string) => string,
  duplicateKey = (key: string, code: number) => `${key}_${code}`,
): NamedColor[] {
  const seen = new Map<string, number>();
  return ansi256.map((color, index) => {
    const code = ansiCode(index);
    const key = format(displayName(color));
    const count = seen.get(key) ?? 0;
    seen.set(key, count + 1);
    return {
      ...color,
      code,
      key: count === 0 ? key : duplicateKey(key, code),
    };
  });
}

// Normalize source names that should have canonical generated keys.
function displayName(color: Ansi256Entry): string {
  if (color.hex === "#ffffff") return "White";
  return color.name;
}

// Render ANSI 256 colors as a Go map literal.
export function renderAnsi256Go(): string {
  const rows = paddedRows(
    namedColors(snakeCase),
    (color, widths) => {
      const key = `"${color.key}":`.padEnd(widths.key + 3);
      return `\t${key} "${color.hex}", // ${color.code}`;
    },
    (color) => ({ key: color.key, value: color.hex }),
  );
  return `${headerComment(languageByKey.go, "ANSI 256 colors 16-255")}
var ANSI256 = map[string]string{
${rows}
}
`;
}

// Render ANSI 256 colors as a typed Python dictionary.
export function renderAnsi256Python(): string {
  const rows = paddedRows(
    namedColors(snakeCase),
    (color, widths) => {
      const key = `"${color.key}":`.padEnd(widths.key + 3);
      const value = `"${color.hex}",`.padEnd(widths.value + 3);
      return `    ${key} ${value} # ${color.code}`;
    },
    (color) => ({ key: color.key, value: color.hex }),
  );
  return `${headerComment(languageByKey.python, "ANSI 256 colors 16-255")}
ANSI_256: dict[str, str] = {
${rows}
}
`;
}

// Render ANSI 256 colors as a frozen Ruby hash.
export function renderAnsi256Ruby(): string {
  const rows = paddedRows(
    namedColors(snakeCase),
    (color, widths) => {
      const key = `${color.key}:`.padEnd(widths.key + 1);
      const value = `"${color.hex}",`.padEnd(widths.value + 3);
      return `  ${key} ${value} # ${color.code}`;
    },
    (color) => ({ key: color.key, value: color.hex }),
  );
  return `${headerComment(languageByKey.ruby, "ANSI 256 colors 16-255")}
ANSI_256 = {
${rows}
}.freeze
`;
}

// Render ANSI 256 colors as a borrowed Rust tuple slice.
export function renderAnsi256Rust(): string {
  const colors = namedColors(snakeCase);
  const tupleRows = colors.map((color) => `    ("${color.key}", "${color.hex}"),`);
  const width = Math.max(...tupleRows.map((row) => row.length));
  const rows = tupleRows.map((row, index) => `${row.padEnd(width)} // ${colors[index].code}`).join("\n");
  return `${headerComment(languageByKey.rust, "ANSI 256 colors 16-255")}
pub const ANSI_256: &[(&str, &str)] = &[
${rows}
];
`;
}

// Render ANSI 256 colors as a TypeScript const object.
export function renderAnsi256Typescript(): string {
  const rows = paddedRows(
    namedColors(camelCase, (key, code) => `${key}${code}`),
    (color, widths) => {
      const key = `${color.key}:`.padEnd(widths.key + 1);
      const value = `"${color.hex}",`.padEnd(widths.value + 3);
      return `  ${key} ${value} // ${color.code}`;
    },
    (color) => ({ key: color.key, value: color.hex }),
  );
  return `${headerComment(languageByKey.ts, "ANSI 256 colors 16-255")}
export const ANSI_256 = {
${rows}
} as const;
`;
}

// Render ANSI 256 colors as a Zig StaticStringMap initializer.
export function renderAnsi256Zig(): string {
  const rows = namedColors(snakeCase)
    .map((color) => `    .{ "${color.key}", "${color.hex}" }, // ${color.code}`)
    .join("\n");
  return `${headerComment(languageByKey.zig, "ANSI 256 colors 16-255")}
pub const ANSI_256 = std.StaticStringMap([]const u8).initComptime(.{
${rows}
});
`;
}

// Dispatch ANSI 256 rendering by target language.
export function renderAnsi256(language: Ansi256Language): string {
  switch (language.key) {
    case "go":
      return renderAnsi256Go();
    case "python":
      return renderAnsi256Python();
    case "ruby":
      return renderAnsi256Ruby();
    case "rust":
      return renderAnsi256Rust();
    case "ts":
      return renderAnsi256Typescript();
    case "zig":
      return renderAnsi256Zig();
  }
}
