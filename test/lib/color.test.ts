import { NamedColor, nearestColor, normalizeHexInput, parseHex } from "@/lib/color.ts";

describe("color", () => {
  it("normalizes display input while preserving a typed hash", () => {
    expect(normalizeHexInput("")).toBe("");
    expect(normalizeHexInput("#")).toBe("#");
    expect(normalizeHexInput("a")).toBe("#a");
    expect(normalizeHexInput("#a")).toBe("#a");
    expect(normalizeHexInput("#AaBbCc")).toBe("#aabbcc");
    expect(normalizeHexInput("#00ff00ff")).toBe("#00ff00");
    expect(normalizeHexInput("ff000000")).toBe("#ff0000");
    expect(normalizeHexInput("zz#")).toBe("#");
  });

  it("parses full hex colors", () => {
    expect(parseHex("#fff")).toBeNull();
    expect(parseHex("8caaee")).toBe("#8caaee");
    expect(parseHex("#8c")).toBeNull();
    expect(parseHex("#")).toBeNull();
  });

  it("finds exact named colors", () => {
    const colors = [new NamedColor("red", "#ff0000"), new NamedColor("green", "#00ff00")];

    expect(nearestColor("#ff0000", colors).name).toBe("red");
  });

  it("finds nearest named colors without exact matches", () => {
    const colors = [new NamedColor("black", "#000000"), new NamedColor("white", "#ffffff")];

    expect(nearestColor("#111111", colors).name).toBe("black");
    expect(nearestColor("#eeeeee", colors).name).toBe("white");
  });

  it("handles one-color and empty nearest palettes", () => {
    const only = new NamedColor("only", "#123456");

    expect(nearestColor("#ffffff", [only])).toBe(only);
    expect(() => nearestColor("#ffffff", [])).toThrow("impossible");
  });

  it("serializes named colors without parser state", () => {
    const color = new NamedColor("40", "#00d700");
    void color.color;

    expect(color.toJSON()).toEqual({ hex: "#00d700", name: "40" });
  });
});
