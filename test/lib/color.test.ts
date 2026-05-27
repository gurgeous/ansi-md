import { describe, expect, it } from "vitest";
import { hexify, NamedColor, namedColors, nearestColor, normalizeHexInput, parseHex, rgbHex } from "@/lib/color.ts";

describe("color", () => {
  it("rehydrates named colors from serialized data", () => {
    const colors = NamedColor.fromData([{ name: "40", hex: "#00d700" }]);

    expect(colors).toHaveLength(1);
    expect(colors[0]).toBeInstanceOf(NamedColor);
    expect(colors[0]?.name).toBe("40");
    expect(colors[0]?.hex).toBe("#00d700");
  });

  it("flattens nested palettes into named colors", () => {
    const colors = namedColors({
      slate: { "500": "#64748b" },
      sky: { "400": "#38bdf8" },
    });

    expect(colors.map((color) => color.name)).toEqual(["slate-500", "sky-400"]);
    expect(colors.map((color) => color.hex)).toEqual(["#64748b", "#38bdf8"]);
  });

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

  it("lazily parses and memoizes Color.js state", () => {
    const color = new NamedColor("40", "#00d700");
    const first = color.color;
    const second = color.color;

    expect(first).toBe(second);
    expect(first.toString({ format: "hex", collapse: false })).toBe("#00d700");
  });

  it("normalizes Color.js input to full hex", () => {
    expect(hexify("rgb(140 170 238)")).toBe("#8caaee");
    expect(hexify("oklch(0.76 0.12 274)")).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("formats rgb bytes as canonical hex", () => {
    expect(rgbHex(0, 0, 0)).toBe("#000000");
    expect(rgbHex(140, 170, 238)).toBe("#8caaee");
    expect(rgbHex(255, 255, 255)).toBe("#ffffff");
  });
});
