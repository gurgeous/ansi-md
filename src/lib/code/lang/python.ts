// Python palette renderer for generated code snippets.
// It emits a typed dictionary so users can paste it into strict codebases.
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
{{ value }}: {{ dict }} = {
{{ main }}
}
`;

class PythonLanguage extends Language {
  render0(name: string, palette: Palette) {
    const tab = "    ";
    const main = Object.entries(palette).map(([name, colors]) => {
      const fields = renderFields('{{id}}: "{{v}}",', { colors, id, tab });
      return indent(`"${name}": {\n${fields}\n},`, tab);
    });
    const dictkey = colorNames(palette).every(isNumberStr) ? "int" : "str";

    return mustache(TEMPLATE, {
      dict: `dict[str, dict[${dictkey}, str]]`,
      main: main.join("\n"),
      tagline: tagline(name),
      value: constantName(name),
    });
  }

  renderScales0(name: string, scales: Scales) {
    const tab = "    ";
    const main = Object.entries(scales).map(([name, scale]) => {
      const values = renderScale('"{{v}}",', scale, tab);
      return indent(`"${name}": [\n${values}\n],`, tab);
    });

    return mustache(TEMPLATE, {
      dict: "dict[str, list[str]]",
      main: main.join("\n"),
      tagline: tagline(name),
      value: constantName(name),
    });
  }
}

function id(name: string) {
  return JSON.stringify(name);
}

export default new PythonLanguage();
