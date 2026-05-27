import { hexify, nearestColor, normalizeHexInput, parseHex, rgbHex } from "@/lib/color.ts";
import Color from "colorjs.io";
import { describe, expect, it } from "vitest";

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

  it("finds the exact nearest color", () => {
    const needle = new Color("#ff0000");
    const haystack = [new Color("#ff0000"), new Color("#00ff00")];

    expect(nearestColor(needle, haystack)).toBe(haystack[0]);
  });

  it("returns the nearest parsed color", () => {
    const haystack = [new Color("#000000"), new Color("#ffffff")];

    expect(nearestColor(new Color("#111111"), haystack)).toBe(haystack[0]);
    expect(nearestColor(new Color("#eeeeee"), haystack)).toBe(haystack[1]);
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
