// Shared palette data and types for pages, tools, and code generation.

export type Palette = Record<string, Colors>;
export type Colors = Record<string, string>;

export type Scales = Record<string, Scale>;
export type Scale = readonly string[];

export { default as ansi256 } from "@/lib/palettes/ansi256.ts";
export { default as catppuccin, ghostty16 } from "@/lib/palettes/catppuccin.ts";
export { default as d3Ordinal } from "@/lib/palettes/d3-ordinal.ts";
export { hex256 } from "@/lib/palettes/ansi256.ts";
export { default as tailwind } from "@/lib/palettes/tailwind.ts";
