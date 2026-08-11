// Go palette renderer for generated code snippets.
// It emits a value first, then struct types for easy scanning.
import type { Palette, Scales, Table, TableCommentFn, TableSections } from "@/lib/palettes";
import {
  align,
  colorNames,
  indent,
  isNumberStr,
  Language,
  mustache,
  renderFields,
  renderScale,
  renderTableFields,
  tagline,
} from "./base.ts";

const TEMPLATE = `
// {{ tagline }}
var {{ value }} = {{ paletteType }}{
{{ main }}
}

type {{ paletteType }} struct {
{{ paletteFields }}
}

type Palette struct {
{{ colorFields }}
}
`;

const SCALE_TEMPLATE = `
// {{ tagline }}
var {{ value }} = map[string][]string{
{{ main }}
}
`;

const TABLE_TEMPLATE = `
// {{ tagline }}
var {{ value }} = map[string]uint8{
{{ main }}
}
`;

class GoLanguage extends Language {
  render0(name: string, palette: Palette) {
    const names = colorNames(palette).map(id);
    const tab = "\t";
    const main = Object.entries(palette).map(([name, colors]) => {
      const fields = renderFields('{{id}}: "{{v}}",', { colors, id, tab });
      return indent(`${id(name)}: Palette{\n${fields}\n},`, tab);
    });

    return mustache(TEMPLATE, {
      colorFields: align(names.map((s) => `${tab}${s} string`)),
      paletteFields: align(keys(palette).map((s) => `${tab}${id(s)} Palette`)),
      main: main.join("\n"),
      paletteType: id(`${name}Colors`),
      tagline: tagline(name),
      value: id(name),
    });
  }

  renderScales0(name: string, scales: Scales) {
    const tab = "\t";
    const main = Object.entries(scales).map(([name, scale]) => {
      const values = renderScale('"{{v}}",', scale, `${tab}${tab}`);
      return `${tab}${JSON.stringify(name)}: []string{\n${values}\n${tab}},`;
    });

    return mustache(SCALE_TEMPLATE, {
      main: main.join("\n"),
      tagline: tagline(name),
      value: id(name),
    });
  }

  renderTable0(name: string, table: Table, comment?: TableCommentFn, sections?: TableSections) {
    const tab = "\t";
    return mustache(TABLE_TEMPLATE, {
      main: renderTableFields("{{id}}: {{v}},", {
        table,
        comment,
        id: JSON.stringify,
        marker: "//",
        sections,
        tab,
        align: /\d+,/,
      }),
      tagline: tagline(name),
      value: id(name),
    });
  }
}

function id(name: string) {
  return pascalCase(isNumberStr(name) ? `C${name}` : name);
}

export default new GoLanguage();
