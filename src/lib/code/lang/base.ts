// Base class for generated-code languages.
// Each subclass owns one target language's naming and file layout.
import type { LangKey } from "@/lib/code/code.ts";
import type { Colors, Palette, Scale, Scales } from "@/lib/palettes";

export abstract class Language {
  name: LangKey;

  constructor() {
    this.name = this.constructor.name.replace(/Language$/, "").toLowerCase() as LangKey;
  }

  render(name: string, palette: Palette): string {
    return this.render0(name, palette).trim() + "\n";
  }
  renderScales(name: string, scales: Scales): string {
    return this.renderScales0(name, scales).trim() + "\n";
  }

  // for subclasses
  abstract render0(name: string, palette: Palette): string;
  abstract renderScales0(name: string, scales: Scales): string;
}

//
// helpers
//

// Return the first palette's color keys so type fields stay consistent.
export function colorNames(palette: Palette): string[] {
  const first = Object.entries(palette)[0];
  if (!first) throw "impossible";
  return keys(first[1]);
}

// Prefix each non-empty line with the given indentation string.
export function indent(text: string | string[], prefix = "  "): string {
  const lines = typeof text === "string" ? text.split("\n") : [...text];
  return lines.map((line) => (line ? `${prefix}${line}` : line)).join("\n");
}

// Check whether a string is made only of decimal digits.
export function isNumberStr(value: string): boolean {
  return /^\d+$/.test(value);
}

// Return the maximum string length in a list, or 0 when empty.
export function maxLength(values: string[]): number {
  return Math.max(0, ...values.map((value) => value.length));
}

const MUSTACHE = {
  escape: null,
  evaluate: null,
  interpolate: /{{\s*([\s\S]+?)\s*}}/g,
};

// Expand a small mustache-style template for a generated file.
export function mustache(source: string, vars: Record<string, string>): string {
  return template(source, MUSTACHE)(vars);
}

// Return the one-line provenance text for generated files.
export function tagline(name: string): string {
  return `${capitalize(name)} colors, see https://ansi.md.`;
}

// Build a CONSTANT_CASE name without splitting simple digit suffixes.
export function constantName(name: string): string {
  return constantCase(name).replace(/([A-Z])_(\d)/g, "$1$2");
}

//
// longer ones here
//

// Align contiguous runs of 3+ lines by the first regex match in each line.
export function align(text: string | string[], pattern: RegExp = /\b\w+$/): string {
  const regex = new RegExp(pattern.source, pattern.flags);
  let lines: string[];
  if (typeof text === "string") {
    lines = text.split("\n");
  } else {
    lines = [...text];
  }
  const aligned: string[] = [];
  let run: string[] = [];

  function flush() {
    if (run.length < 3) {
      aligned.push(...run);
      run = [];
      return;
    }

    const matches = run.map((line) => line.match(regex));
    const widths = run.map((line, index) => {
      const wall = matches[index]?.[0] ?? "";
      return wall ? line.indexOf(wall) : -1;
    });
    const width = Math.max(0, ...widths);

    aligned.push(
      ...run.map((line, index) => {
        const wall = matches[index]?.[0];
        if (wall === undefined) return line;
        const wallIndex = line.indexOf(wall);
        if (wallIndex < 0) return line;
        const left = line.slice(0, wallIndex);
        const right = line.slice(wallIndex + wall.length);
        return `${left.padEnd(width, " ")}${wall}${right}`;
      }),
    );
    run = [];
  }

  for (const line of lines) {
    if (regex.test(line)) {
      run.push(line);
      continue;
    }
    flush();
    aligned.push(line);
  }
  flush();
  return aligned.join("\n");
}

// Render one line per color using a mustache row template.
export function renderFields(
  line: string,
  options: {
    colors: Colors;
    tab: string;
    id?: (name: string) => string;
    align?: boolean | RegExp;
  },
): string {
  const id = options.id ?? identity;
  const re = line.includes("=") ? /=/ : / "/;
  const fields = Object.entries(options.colors).map(([k, v]) => mustache(line, { id: id(k), v }));
  return indent(align(fields, re), options.tab);
}

// Render one line per scale item using a mustache row template.
export function renderScale(line: string, scale: Scale, tab: string): string {
  return indent(
    scale.map((v) => mustache(line, { v })),
    tab,
  );
}
