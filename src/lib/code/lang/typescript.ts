// TypeScript palette renderer for generated code snippets.
// It emits a const object that preserves literal color values.
import type { Palette, Scales, Table, TableCommentFn } from "@/lib/palettes";
import {
  Language,
  indent,
  isNumberStr,
  mustache,
  renderFields,
  renderScale,
  renderTableFields,
  tagline,
} from "./base.ts";

const TEMPLATE = `
// {{ tagline }}
export const {{ value }} = {
{{ main }}
} as const;
`;

class TypescriptLanguage extends Language {
  render0(name: string, palette: Palette) {
    const tab = "  ";
    const main = Object.entries(palette).map(([name, colors]) => {
      const fields = renderFields('{{id}}: "{{v}}",', { colors, id, tab });
      return indent(`${name}: {\n${fields}\n},`, tab);
    });
    return mustache(TEMPLATE, {
      main: main.join("\n"),
      tagline: tagline(name),
      value: camelCase(name),
    });
  }

  renderScales0(name: string, scales: Scales) {
    const tab = "  ";
    const main = Object.entries(scales).map(([name, scale]) => {
      const values = renderScale('"{{v}}",', scale, tab);
      return indent(`${name}: [\n${values}\n],`, tab);
    });
    return mustache(TEMPLATE, {
      main: main.join("\n"),
      tagline: tagline(name),
      value: camelCase(name),
    });
  }

  renderTable0(name: string, table: Table, comment?: TableCommentFn) {
    return mustache(TEMPLATE, {
      main: renderTableFields("{{id}}: {{v}},", { table, comment, id, marker: "//", tab: "  " }),
      tagline: tagline(name),
      value: camelCase(name),
    });
  }
}

function id(name: string) {
  return isNumberStr(name) ? `c${name}` : name;
}

export default new TypescriptLanguage();
