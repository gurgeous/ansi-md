import { describe, expect, it } from "vitest";
import * as Base from "@/lib/code/lang/base.ts";

describe("Code", function () {
  it("maxLength", function () {
    expect(Base.maxLength(["ansi", "terminal", "rgb"])).toBe(8);
    expect(Base.maxLength([])).toBe(0);
  });

  it("align", function () {
    expect(Base.align(["a: 1", "longer: 2", "mid: 3"], /\d+$/)).toBe(
      ["a:      1", "longer: 2", "mid:    3"].join("\n"),
    );
    expect(Base.align(["a: 1", "longer: 2"], /\d+$/)).toBe(["a: 1", "longer: 2"].join("\n"));
    expect(Base.align(["a: 1", "longer: 2", "mid: 3"], /\d+$/)).toBe(
      ["a:      1", "longer: 2", "mid:    3"].join("\n"),
    );
    expect(Base.align(["a: 1", "longer: 2", "mid: 3", "", "x: 4", "wide: 5", "z: 6"], /\d+$/)).toBe(
      ["a:      1", "longer: 2", "mid:    3", "", "x:    4", "wide: 5", "z:    6"].join("\n"),
    );
  });
});
