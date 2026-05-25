// Verify the published-style plugin aligns trailing line comments inside
// TypeScript type members without disturbing unrelated cases.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import prettier from "prettier";
import { describe, expect, test } from "vitest";

const root = fileURLToPath(new URL("../../../", import.meta.url));
const plugin = new URL("../../../src/lib/plugins/prettier-plugin-align-type-comments.mjs", import.meta.url).href;

async function format(source: string) {
  return prettier.format(source, {
    filepath: "sample.ts",
    plugins: [plugin],
  });
}

describe("prettier-plugin-align-type-comments", () => {
  test("aligns suffix comments inside a type literal", async () => {
    const input = [
      "type LanguageSpec = {",
      "  key: LanguageKey; // Short tab id and generated path segment.",
      "  name?: string; // Display label when capitalization is wrong.",
      "  ext?: string; // Generated file extension override.",
      "};",
      "",
    ].join("\n");

    const output = await format(input);

    expect(output).toContain("  key: LanguageKey; // Short tab id and generated path segment.");
    expect(output).toContain("  name?: string;    // Display label when capitalization is wrong.");
    expect(output).toContain("  ext?: string;     // Generated file extension override.");
  });

  test("aligns interface bodies too", async () => {
    const input = [
      "interface LanguageSpec {",
      "  key: LanguageKey; // Short tab id and generated path segment.",
      "  name?: string; // Display label when capitalization is wrong.",
      "  ext?: string; // Generated file extension override.",
      "}",
      "",
    ].join("\n");

    const output = await format(input);

    expect(output).toContain("  key: LanguageKey; // Short tab id and generated path segment.");
    expect(output).toContain("  name?: string;    // Display label when capitalization is wrong.");
    expect(output).toContain("  ext?: string;     // Generated file extension override.");
  });

  test("leaves isolated comments alone", async () => {
    const input = ["type One = {", "  key: string; // lone comment", "  value: string;", "};", ""].join("\n");

    expect(await format(input)).toBe(input);
  });

  test("starts a new alignment group after blank lines", async () => {
    const input = [
      "type Split = {",
      "  key: string; // one",
      "",
      "  much_longer_name?: number; // two",
      "  tiny: boolean; // three",
      "};",
      "",
    ].join("\n");

    const output = await format(input);

    expect(output).toContain("  key: string; // one");
    expect(output).toContain("  much_longer_name?: number; // two");
    expect(output).toContain("  tiny: boolean;             // three");
  });

  test("aligns nested type literals independently", async () => {
    const input = [
      "type Nested = {",
      "  outer: {",
      "    key: string; // one",
      "    longer_name?: number; // two",
      "  };",
      "  tiny: boolean; // three",
      "  wider_name: string; // four",
      "};",
      "",
    ].join("\n");

    const output = await format(input);

    expect(output).toContain("    key: string;          // one");
    expect(output).toContain("    longer_name?: number; // two");
    expect(output).toContain("  tiny: boolean;      // three");
    expect(output).toContain("  wider_name: string; // four");
  });

  test("formats the palette type block in code.ts", async () => {
    const source = readFileSync(join(root, "src", "lib", "code", "code.ts"), "utf8");
    const output = await format(source);

    expect(output).toContain("export type Palette = Record<string, Colors>;");
    expect(output).toContain("export type Colors = Record<string, string>;");
    expect(output).not.toContain("export type PaletteTemplate");
  });
});
