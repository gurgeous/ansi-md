import Ansi from "@/lib/ansi.ts";

describe("ansi", () => {
  it("exports only ANSI 256 colors 16-255", () => {
    expect(Ansi.colors256).toHaveLength(240);
    expect(Ansi.colors256[0]?.name).toBe("16");
    expect(Ansi.colors256.at(-1)?.name).toBe("255");
    const numbers = Ansi.colors256.map((color) => Number(color.name));
    expect(numbers.every((number) => number >= 16)).toBe(true);
    expect(numbers.every((number) => number <= 255)).toBe(true);
  });

  it("formats ANSI 256 escape sequences", () => {
    expect(Ansi.fg256(40)).toBe("\\e[38;5;40m");
    expect(Ansi.bg256(40)).toBe("\\e[48;5;40m");
  });

  it("matches well-known ANSI 256 cube colors", () => {
    expect(Ansi.hex256(16)).toBe("#000000");
    expect(Ansi.hex256(17)).toBe("#00005f");
    expect(Ansi.hex256(21)).toBe("#0000ff");
    expect(Ansi.hex256(40)).toBe("#00d700");
    expect(Ansi.hex256(46)).toBe("#00ff00");
    expect(Ansi.hex256(196)).toBe("#ff0000");
    expect(Ansi.hex256(231)).toBe("#ffffff");
  });

  it("matches well-known ANSI 256 grayscale colors", () => {
    expect(Ansi.hex256(232)).toBe("#080808");
    expect(Ansi.hex256(233)).toBe("#121212");
    expect(Ansi.hex256(254)).toBe("#e4e4e4");
    expect(Ansi.hex256(255)).toBe("#eeeeee");
  });
});
