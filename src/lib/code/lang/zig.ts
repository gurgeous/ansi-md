// Zig palette renderer for generated code snippets.
// It emits comptime-friendly structs with string slice fields.
import type { Palette, Scales, Table, TableCommentFn } from "@/lib/palettes";
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
pub const {{ value }} = {{ paletteType }}{
{{ main }}
};

pub const Palette = struct {
{{ colorFields }}
};

pub const {{ paletteType }} = struct {
{{ paletteFields }}
};
`;

const SCALE_TEMPLATE = `
// {{ tagline }}
pub const {{ value }} = {{ scaleType }}{
{{ main }}
};

pub const {{ scaleType }} = struct {
{{ scaleFields }}
};
`;

const TABLE_TEMPLATE = `
// {{ tagline }}
pub const {{ value }} = {{ tableType }}{
{{ main }}
};

pub const {{ tableType }} = struct {
{{ fields }}
};
`;

class ZigLanguage extends Language {
  render0(name: string, palette: Palette) {
    const tab = "    ";
    const colorFields = align(
      colorNames(palette).map((name) => `${tab}${id(name)}: []const u8,`),
      /\[\]const u8,$/,
    );
    const main = Object.entries(palette).map(([name, colors]) => {
      const fields = renderFields('.{{id}} = "{{v}}",', { colors, id, tab });
      return indent(`.${name} = .{\n${fields}\n},`, tab);
    });
    const paletteFields = align(
      keys(palette).map((name) => `${tab}${name}: Palette,`),
      /Palette,$/,
    );

    return mustache(TEMPLATE, {
      colorFields,
      main: main.join("\n"),
      paletteFields,
      paletteType: `${pascalCase(name)}Colors`,
      tagline: tagline(name),
      value: camelCase(name),
    });
  }

  renderScales0(name: string, scales: Scales) {
    const tab = "    ";
    const scaleFields = align(
      keys(scales).map((name) => `${tab}${name}: []const []const u8,`),
      /\[\]const \[\]const u8,$/,
    );
    const main = Object.entries(scales).map(([name, scale]) => {
      const values = renderScale('"{{v}}",', scale, `${tab}${tab}`);
      return `${tab}.${name} = &.{\n${values}\n${tab}},`;
    });

    return mustache(SCALE_TEMPLATE, {
      main: main.join("\n"),
      scaleFields,
      scaleType: `${pascalCase(name)}Scales`,
      tagline: tagline(name),
      value: camelCase(name),
    });
  }

  renderTable0(name: string, table: Table, comment?: TableCommentFn) {
    const tab = "    ";
    return mustache(TABLE_TEMPLATE, {
      fields: align(
        keys(table).map((name) => `${tab}${id(name)}: u8,`),
        /u8,$/,
      ),
      main: renderTableFields(".{{id}} = {{v}},", { table, comment, id, marker: "//", tab }),
      tableType: `${pascalCase(name)}Table`,
      tagline: tagline(name),
      value: camelCase(name),
    });
  }
}

function id(name: string) {
  return isNumberStr(name) ? `c${name}` : name;
}

export default new ZigLanguage();
