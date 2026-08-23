import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { extByName, languages, type LangKey, type Language } from "@/lib/code/code.ts";
import { ansi256Table, catppuccin, d3Ordinal, tailwind } from "@/lib/palettes";
import Util from "@/lib/util.ts";

//
// fixtures
//

const repo = join(fileURLToPath(new URL("../../../", import.meta.url)));
const out = join(repo, "tmp", "gen-test-code");

type Check = {
  language: LangKey;
  value: string;
};

const palettes = {
  tailwind,
  catppuccin,
} as const;

const scales = {
  d3Ordinal,
} as const;

const tables = {
  ansi256: ansi256Table,
} as const;

type CompileFn = (file: string, artifact: string) => Promise<void>;

//
// compilers
//

const compile: Record<(typeof languages)[number]["name"], CompileFn> = {
  async go(file) {
    await Util.writeFile(join(dirname(file), "go.mod"), "module generatedtest\n\ngo 1.22\n");
    const diff = await Util.shellEx("gofmt", "-d", file);
    if (diff.length > 0) {
      throw new Error(`${file} is not gofmt-formatted\n${diff}`);
    }
    await Util.shEx(`cd ${JSON.stringify(dirname(file))} && go build .`);
  },

  async json(file) {
    await Util.readJson(file);
  },

  async python(file) {
    await Util.shellEx("python3", "-m", "py_compile", file);
  },

  async ruby(file) {
    await Util.shellEx("ruby", "-c", file);
    await Util.shellEx("ruby", file);
  },

  async rust(file, artifact) {
    const outFile = join(dirname(file), `lib${artifact}.rlib`);
    await Util.shellEx("rustc", "--crate-type", "lib", file, "-o", outFile);
  },

  async typescript(file) {
    await Util.shellEx("tsc", [
      "--noEmit",
      "--ignoreConfig",
      "--strict",
      "--target",
      "ES2022",
      "--module",
      "ESNext",
      "--moduleResolution",
      "Bundler",
      "--skipLibCheck",
      file,
    ]);
  },

  async zig(file) {
    const outFile = join(dirname(file), "libcolors.a");
    await Util.shellEx("zig", "build-lib", file, `-femit-bin=${outFile}`);
  },
};

//
// tests
//

describe("generated code", () => {
  it("writes every language fixture", async () => {
    for (const [name] of Object.entries(palettes)) {
      const source = await renderedSource(name);
      if (name === "tailwind") {
        assertLanguageIncludes("tailwind", source, [
          { language: "go", value: "var Tailwind = TailwindColors{" },
          { language: "json", value: '"slate": {' },
          { language: "python", value: "TAILWIND: dict" },
          { language: "ruby", value: "Palette = Data.define(" },
          { language: "rust", value: "pub const TAILWIND" },
          { language: "typescript", value: "export const tailwind = {" },
          { language: "zig", value: "pub const tailwind = TailwindColors{" },
        ]);
        assertBefore("tailwind go value", source.go, "var Tailwind", "type TailwindColors struct");
        assertBefore("tailwind rust value", source.rust, "pub const TAILWIND", "pub struct Palette");
        assertBefore("tailwind zig value", source.zig, "pub const tailwind", "pub const Palette");
        assertIncludes("tailwind ruby", source.ruby, "Palette = Data.define(*%i[c50");
        assertIncludes("tailwind typescript shade", source.typescript, "c50:");
      }

      if (name === "catppuccin") {
        assertLanguageIncludes("catppuccin", source, [
          { language: "go", value: "var Catppuccin = CatppuccinColors{" },
          { language: "json", value: '"mocha": {' },
          { language: "python", value: "CATPPUCCIN: dict" },
          { language: "ruby", value: "Palette = Data.define(" },
          { language: "rust", value: "pub const CATPPUCCIN" },
          { language: "typescript", value: "export const catppuccin = {" },
          { language: "zig", value: "pub const catppuccin = CatppuccinColors{" },
        ]);
        assertBefore("catppuccin go value", source.go, "var Catppuccin", "type CatppuccinColors struct");
        assertBefore("catppuccin rust value", source.rust, "pub const CATPPUCCIN", "pub struct Palette");
        assertBefore("catppuccin zig value", source.zig, "pub const catppuccin", "pub const Palette");
        assertIncludes("catppuccin ruby", source.ruby, "Palette = Data.define(*%i[\n  rosewater");
        assertIncludes("catppuccin ruby", source.ruby, "mocha:");
        assertIncludes("catppuccin ruby", source.ruby, "rosewater:");
        assertIncludes("catppuccin typescript mocha", source.typescript, "mocha");
        assertIncludes("catppuccin go rosewater", source.go, "Rosewater");
      }
    }

    for (const [name] of Object.entries(scales)) {
      const source = await renderedSource(name);
      assertLanguageIncludes("d3Ordinal", source, [
        { language: "go", value: "var D3Ordinal = map[string][]string{" },
        { language: "json", value: '"accent": [' },
        { language: "python", value: "D3_ORDINAL: dict[str, list[str]]" },
        { language: "ruby", value: "D3_ORDINAL = {" },
        { language: "rust", value: "pub const D3_ORDINAL: D3OrdinalScales" },
        { language: "typescript", value: "export const d3Ordinal = {" },
        { language: "zig", value: "pub const d3Ordinal = D3OrdinalScales{" },
      ]);
      assertIncludes("d3Ordinal typescript accent", source.typescript, "accent: [");
      assertIncludes("d3Ordinal typescript first color", source.typescript, '"#a6cee3"');
      assertIncludes("d3Ordinal json array", source.json, '"paired": [');
      assertIncludes("d3Ordinal ruby array", source.ruby, "paired: [");
      assertIncludes("d3Ordinal go slice", source.go, '"paired": []string{');
      assertIncludes("d3Ordinal rust slice", source.rust, "paired: &[");
      assertIncludes("d3Ordinal zig slice", source.zig, ".paired = &.{");
    }

    for (const [name] of Object.entries(tables)) {
      const source = await renderedSource(name);
      assertLanguageIncludes("ansi256", source, [
        { language: "go", value: "var Ansi256 = map[string]uint8{" },
        { language: "json", value: '"black": 16' },
        { language: "python", value: "ANSI256: dict[str, int]" },
        { language: "ruby", value: "ANSI256 = {" },
        { language: "rust", value: "pub enum Ansi256" },
        { language: "typescript", value: "export const ansi256 = {" },
        { language: "zig", value: "pub const ansi256 = Ansi256Table{" },
      ]);
      assertIncludes("ansi256 numeric value", source.typescript, "black: 16,");
      expect(source.go).toMatch(/"darkblue":\s+18,/);
      assertIncludes("ansi256 gray alias", source.rust, "Self::Dimgray => 242,");
      assertIncludes("ansi256 red section", source.go, "// red = 0x5f");
      assertIncludes("ansi256 grayscale section", source.python, "# grayscale");
      assertIncludes("ansi256 alias section", source.ruby, "# gray aliases from css");
      assertBefore("ansi256 aliases", source.typescript, "gray24: 255", "dimgray: 242");
      expect(source.json).toContain('"aqua": 51,\n\n  "rosewood": 52');
      for (const language of languages.filter((language) => language.name !== "json")) {
        assertIncludes(`ansi256 ${language.name} rgb`, source[language.name], "#000000");
      }
      expect(source.json).not.toContain("#000000");
    }
  });

  it("compiles every generated file", async () => {
    const compileLanguages = keys(compile).sort().join(",");
    const languageKeys = languages
      .map((language) => language.name)
      .sort()
      .join(",");
    expect(compileLanguages).toBe(languageKeys);

    for (const [name] of Object.entries(palettes)) {
      for (const language of languages) {
        await compile[language.name](fileFor(name, language), name);
      }
    }

    for (const [name] of Object.entries(scales)) {
      for (const language of languages) {
        await compile[language.name](fileFor(name, language), name);
      }
    }

    for (const [name] of Object.entries(tables)) {
      for (const language of languages) {
        await compile[language.name](fileFor(name, language), name);
      }
    }
  }, 60_000);
});

//
// assertions
//

type SourceByLanguage = Record<LangKey, string>;

function assertBefore(label: string, source: string, first: string, second: string) {
  const firstIndex = source.indexOf(first);
  const secondIndex = source.indexOf(second);
  if (firstIndex < 0 || secondIndex < 0 || firstIndex > secondIndex) {
    throw new Error(`${label} did not place ${first} before ${second}`);
  }
}

function assertIncludes(label: string, source: string, value: string) {
  if (!source.includes(value)) {
    throw new Error(`${label} is missing ${value}`);
  }
}

function assertLanguageIncludes(prefix: string, source: SourceByLanguage, checks: Check[]) {
  for (const check of checks) {
    assertIncludes(`${prefix} ${check.language}`, source[check.language], check.value);
  }
}

//
// helpers
//

function fileFor(name: string, language: Language) {
  return join(out, name, language.name, `colors.${extByName[language.name]}`);
}

async function renderedSource(name: string) {
  return Object.fromEntries(
    await Promise.all(
      languages.map(async (language) => {
        return [language.name, await readFixture(name, language.name)];
      }),
    ),
  ) as SourceByLanguage;
}

async function readFixture(name: string, language: (typeof languages)[number]["name"]) {
  return await Util.readFile(join(out, name, language, `colors.${extByName[language]}`));
}
