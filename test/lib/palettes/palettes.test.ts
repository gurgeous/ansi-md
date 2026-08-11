import { languages, type Language } from "@/lib/code/code.ts";
import { ansi256Table, catppuccin, d3Ordinal, hex256, tailwind } from "@/lib/palettes";
import { describe, expect, it } from "vitest";

// Palette renderer function under test.
type RendererFn = (language: Language) => string;

const renderers: Record<string, RendererFn> = {
  ansi256(language) {
    return language.renderTable("ansi256", ansi256Table, hex256);
  },
  catppuccin(language) {
    return language.render("catppuccin", catppuccin);
  },
  d3Ordinal(language) {
    return language.renderScales("d3Ordinal", d3Ordinal);
  },
  tailwind(language) {
    return language.render("tailwind", tailwind);
  },
};

const languageByName = keyBy(languages, (language) => language.name);

describe("palette renderers", () => {
  for (const [name, render] of Object.entries(renderers)) {
    for (const language of languages) {
      it(`renders ${name} constants for ${language.name}`, () => {
        const source = render(language);

        expect(source.trim()).not.toHaveLength(0);
        if (language.name === "json") {
          expect(() => JSON.parse(source)).not.toThrow();
          return;
        }
        expect(source).toContain("see https://ansi.md.");
      });
    }
  }

  it("uses specific palette declarations", () => {
    expect(languageByName.typescript.render("tailwind", tailwind)).toContain("export const tailwind");
    expect(languageByName.typescript.render("catppuccin", catppuccin)).toContain("export const catppuccin");
    expect(languageByName.typescript.renderScales("d3Ordinal", d3Ordinal)).toContain("export const d3Ordinal");
    expect(languageByName.go.render("catppuccin", catppuccin)).toContain("var Catppuccin");
    expect(languageByName.rust.renderTable("ansi256", ansi256Table, hex256)).toContain(
      "pub enum Ansi256",
    );
  });

  it("covers every fixed ANSI 256 color", () => {
    expect(new Set(values(ansi256Table))).toEqual(new Set(range(16, 256)));
    expect(ansi256Table.gray11).toBe(ansi256Table.dimgray);
  });
});
