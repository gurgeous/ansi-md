// Shared palette data and types for pages, tools, and code generation.

// map of name => colors (record)
export type Palette = Record<string, Colors>;
export type Colors = Record<string, string>;

// map of name => integer
export type Table = Record<string, number>;
export type TableCommentFn = (value: number) => string;
export type TableSections = Record<string, string>;

// map of name => scale (array)
export type Scales = Record<string, Scale>;
export type Scale = readonly string[];

export { default as ansi256, ansi256Table, hex256 } from "@/lib/palettes/ansi256.ts";
export { default as catppuccin } from "@/lib/palettes/catppuccin.ts";
export { default as d3Ordinal } from "@/lib/palettes/d3-ordinal.ts";
export { default as tailwind } from "@/lib/palettes/tailwind.ts";
