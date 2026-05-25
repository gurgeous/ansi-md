// Shared language registry and palette types.

export { languages } from "@/lib/code/lang";
export { Language } from "@/lib/code/lang/base.ts";

// palette (map from string => map of colors>
export type Palette = Record<string, Colors>;
export type Colors = Record<string, string>;

// scale (map from string => array of colors>
export type Scales = Record<string, Scale>;
export type Scale = readonly string[];

export type LangKey = "go" | "json" | "python" | "ruby" | "rust" | "typescript" | "zig";
export const extByName: Record<LangKey, string> = {
  go: "go",
  json: "json",
  python: "py",
  ruby: "rb",
  rust: "rs",
  typescript: "ts",
  zig: "zig",
};
