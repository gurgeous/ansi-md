import { describe, expect, it } from "vitest";
import Ansi from "@/lib/ansi.ts";

describe("ansi", () => {
  it("formats ANSI 256 escape sequences", () => {
    expect(Ansi.fg256(40)).toBe("\\e[38;5;40m");
    expect(Ansi.bg256(40)).toBe("\\e[48;5;40m");
  });
});
