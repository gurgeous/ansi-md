// JSON palette renderer for generated code snippets.
// It emits plain nested objects for copy-paste into data files.
import { Language, indent, mustache, renderFields, renderScale, renderTableFields } from "@/lib/code/lang/base.ts";
import type { Palette, Scales, Table, TableCommentFn, TableSections } from "@/lib/palettes";

const TEMPLATE = `
{
{{ main }}
}
`;

class JsonLanguage extends Language {
  render0(_name: string, palette: Palette): string {
    const tab = "  ";
    const main = Object.entries(palette).map(([name, colors]) => {
      let fields = renderFields('"{{id}}": "{{v}}",', { colors, tab });
      fields = fields.replace(/,$/, "");
      return indent(`"${name}": {\n${fields}\n}`, tab);
    });
    return mustache(TEMPLATE, { main: main.join(",\n") });
  }

  renderScales0(_name: string, scales: Scales): string {
    const tab = "  ";
    const main = Object.entries(scales).map(([name, scale]) => {
      let values = renderScale('"{{v}}",', scale, tab);
      values = values.replace(/,$/, "");
      return indent(`"${name}": [\n${values}\n]`, tab);
    });
    return mustache(TEMPLATE, { main: main.join(",\n") });
  }

  renderTable0(_name: string, table: Table, _comment?: TableCommentFn, sections?: TableSections): string {
    let main = renderTableFields("{{id}}: {{v}},", { table, id: JSON.stringify, sections, tab: "  " });
    main = main.replace(/,$/, "");
    return mustache(TEMPLATE, { main });
  }
}

export default new JsonLanguage();
