import { describe, expect, it } from "vitest";

import { ansi256, ansiCode, renderAnsi256 } from "../src/lib/code/ansi256.ts";
import { type LanguageKey, languageByKey } from "../src/lib/code/code.ts";

// Expected duplicate-key behavior for one generated language.
type DuplicateNameCase = {
  language: LanguageKey; // Output variant to inspect.
  firstKey: string; // Base identifier assigned to the earliest duplicate.
  badKey: string; // Regression guard for the removed suffix style.
  secondKey: string; // Identifier expected after deduplication.
};

const duplicateNameCases: readonly DuplicateNameCase[] = [
  {
    language: "go",
    firstKey: '"blue_3":',
    badKey: '"blue_3_19":',
    secondKey: '"blue_3_20":',
  },
  {
    language: "python",
    firstKey: '"blue_3":',
    badKey: '"blue_3_19":',
    secondKey: '"blue_3_20":',
  },
  {
    language: "ruby",
    firstKey: "blue_3:",
    badKey: "blue_3_19:",
    secondKey: "blue_3_20:",
  },
  {
    language: "rust",
    firstKey: '("blue_3",',
    badKey: '("blue_3_19",',
    secondKey: '("blue_3_20",',
  },
  {
    language: "ts",
    firstKey: "blue3:",
    badKey: "blue319:",
    secondKey: "blue320:",
  },
  {
    language: "zig",
    firstKey: '.{ "blue_3",',
    badKey: '.{ "blue_3_19",',
    secondKey: '.{ "blue_3_20",',
  },
];

describe("ansi256", () => {
  it("maps palette rows to xterm color numbers 16-255", () => {
    expect(ansi256).toHaveLength(240);
    expect(ansiCode(0)).toBe(16);
    expect(ansiCode(239)).toBe(255);
  });

  it("normalizes black and white names for generated constants", () => {
    const ruby = renderAnsi256(languageByKey.ruby);

    expect(ruby).toContain("black:");
    expect(ruby).toContain("white:");
    expect(ruby).not.toContain("grey100:");
  });

  it.each(duplicateNameCases)(
    "deduplicates repeated names in $language",
    ({ language, firstKey, badKey, secondKey }) => {
      const source = renderAnsi256(languageByKey[language]);

      expect(source).toContain(firstKey);
      expect(source).not.toContain(badKey);
      expect(source).toContain(secondKey);
    },
  );
});
