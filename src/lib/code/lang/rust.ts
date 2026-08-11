// Rust palette renderer for generated code snippets.
// It emits const structs with borrowed string fields and no runtime setup.
import type { Palette, Scales, Table, TableCommentFn, TableSections } from "@/lib/palettes";
import {
  align,
  colorNames,
  constantName,
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
pub const {{ value }}: {{ paletteType }} = {{ paletteType }} {
{{ main }}
};

pub struct Palette {
{{ colorFields }}
}

pub struct {{ paletteType }} {
{{ paletteFields }}
}
`;

const SCALE_TEMPLATE = `
// {{ tagline }}
pub const {{ value }}: {{ scaleType }} = {{ scaleType }} {
{{ main }}
};

pub struct {{ scaleType }} {
{{ scaleFields }}
}
`;

const TABLE_TEMPLATE = `
// {{ tagline }}
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum {{ tableType }} {
{{ variants }}
}

impl {{ tableType }} {
    pub const fn index(self) -> u8 {
        match self {
{{ main }}
        }
    }
}
`;

class RustLanguage extends Language {
  render0(name: string, palette: Palette) {
    const tab = "    ";
    const colorFields = align(
      colorNames(palette).map((name) => {
        return `${tab}pub ${id(name)}: &'static str,`;
      }),
      /&'static str,$/,
    );
    const main = Object.entries(palette).map(([name, colors]) => {
      const fields = renderFields('{{id}}: "{{v}}",', { colors, id, tab });
      return indent(`${name}: Palette {\n${fields}\n},`, tab);
    });
    const paletteFields = align(
      keys(palette).map((name) => `${tab}pub ${name}: Palette,`),
      /Palette,$/,
    );

    return mustache(TEMPLATE, {
      colorFields,
      main: main.join("\n"),
      paletteFields,
      paletteType: `${pascalCase(name)}Colors`,
      tagline: tagline(name),
      value: constantName(name),
    });
  }

  renderScales0(name: string, scales: Scales) {
    const tab = "    ";
    const scaleFields = align(
      keys(scales).map((name) => `${tab}pub ${name}: &'static [&'static str],`),
      /&'static \[&'static str\],$/,
    );

    return mustache(SCALE_TEMPLATE, {
      main: Object.entries(scales)
        .map(([name, scale]) => {
          const values = renderScale('"{{v}}",', scale, `${tab}${tab}`);
          return `${tab}${name}: &[\n${values}\n${tab}],`;
        })
        .join("\n"),
      scaleFields,
      scaleType: `${pascalCase(name)}Scales`,
      tagline: tagline(name),
      value: constantName(name),
    });
  }

  renderTable0(name: string, table: Table, comment?: TableCommentFn, sections?: TableSections) {
    const tab = "    ";
    return mustache(TABLE_TEMPLATE, {
      main: indent(
        renderTableFields("Self::{{id}} => {{v}},", {
          table,
          comment,
          id: pascalCase,
          marker: "//",
          sections,
          tab,
        }),
        tab,
      ),
      tableType: pascalCase(name),
      tagline: tagline(name),
      variants: indent(keys(table).map((name) => `${pascalCase(name)},`), tab),
    });
  }
}

function id(name: string) {
  return isNumberStr(name) ? `c${name}` : name;
}

export default new RustLanguage();
