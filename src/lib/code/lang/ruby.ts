// Ruby palette renderer for generated code snippets.
// It uses Data.define for compact immutable-ish palette records.
import type { Palette, Scales } from "@/lib/palettes";
import {
    Language,
    colorNames,
    constantName,
    indent,
    isNumberStr,
    mustache,
    renderFields,
    renderScale,
    tagline,
} from "./base.ts";

const TEMPLATE = `
# {{ tagline }}
{{ define }}

{{ value }} = {
{{ main }}
}.freeze
`;

const SCALE_TEMPLATE = `
# {{ tagline }}
{{ value }} = {
{{ main }}
}.freeze
`;

class RubyLanguage extends Language {
  render0(name: string, palette: Palette) {
    const tab = "  ";
    const main = Object.entries(palette).map(([name, colors]) => {
      const fields = renderFields('{{id}}: "{{v}}",', { colors, id, tab });
      return indent(`${name}: Palette.new(\n${fields}\n),`, tab);
    });
    return mustache(TEMPLATE, {
      main: main.join("\n"),
      define: define(colorNames(palette).map(id)),
      tagline: tagline(name),
      value: constantName(name),
    });
  }

  renderScales0(name: string, scales: Scales) {
    const tab = "  ";
    const main = Object.entries(scales).map(([name, scale]) => {
      const values = renderScale('"{{v}}",', scale, tab);
      return indent(`${name}: [\n${values}\n],`, tab);
    });

    return mustache(SCALE_TEMPLATE, {
      main: main.join("\n"),
      tagline: tagline(name),
      value: constantName(name),
    });
  }
}

function id(name: string) {
  return isNumberStr(name) ? `c${name}` : name;
}

function define(symbols: string[]) {
  const inline = `Palette = Data.define(*%i[${symbols.join(" ")}])`;
  if (inline.length <= 84) return inline;
  return `Palette = Data.define(*%i[\n${wrapSymbols(symbols)}\n])`;
}

function wrapSymbols(symbols: string[]) {
  const lines: string[] = [];
  let line = "";

  for (const symbol of symbols) {
    const next = line ? `${line} ${symbol}` : symbol;
    if (next.length > 70 && line) {
      lines.push(line);
      line = symbol;
      continue;
    }
    line = next;
  }

  if (line) lines.push(line);
  return indent(lines, "  ");
}

export default new RubyLanguage();
