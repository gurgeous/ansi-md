import { describe, expect, it } from "vitest";
import { ansi256, colors256, hex256 } from "@/lib/palettes";

describe("ansi256 palette", () => {
  it("exports only ANSI 256 colors 16-255", () => {
    expect(colors256).toHaveLength(240);
    expect(colors256[0]?.name).toBe("16");
    expect(colors256.at(-1)?.name).toBe("255");
    const numbers = colors256.map((color) => Number(color.name));
    expect(numbers.every((number) => number >= 16)).toBe(true);
    expect(numbers.every((number) => number <= 255)).toBe(true);
    expect(keys(ansi256)).not.toContain("15");
    expect(keys(ansi256)).not.toContain("0");
  });

  it("matches well-known ANSI 256 cube colors", () => {
    expect(hex256(16)).toBe("#000000");
    expect(hex256(17)).toBe("#00005f");
    expect(hex256(21)).toBe("#0000ff");
    expect(hex256(40)).toBe("#00d700");
    expect(hex256(46)).toBe("#00ff00");
    expect(hex256(196)).toBe("#ff0000");
    expect(hex256(231)).toBe("#ffffff");
  });

  it("matches well-known ANSI 256 grayscale colors", () => {
    expect(hex256(232)).toBe("#080808");
    expect(hex256(233)).toBe("#121212");
    expect(hex256(254)).toBe("#e4e4e4");
    expect(hex256(255)).toBe("#eeeeee");
  });
});
