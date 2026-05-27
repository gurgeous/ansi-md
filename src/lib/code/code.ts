// Shared language registry and file extensions for code generation.

export { languages } from "@/lib/code/lang";
export { Language } from "@/lib/code/lang/base.ts";

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
