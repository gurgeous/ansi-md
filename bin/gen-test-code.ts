#!/usr/bin/env -S sh -c 'node --experimental-strip-types --import "$(dirname "$0")/preload.ts" "$0" "$@"'
// ^^ note magic shebang. this is how we run node w/ preload, no matte where we are

// Generate language fixtures under tmp/ for the static codegen test
import { extByName, languages } from "@/lib/code/code.ts";
import { ansi256Table, catppuccin, d3Ordinal, hex256, tailwind } from "@/lib/palettes";
import Util from "@/lib/util.ts";
import { join } from "node:path";
import { fileURLToPath, URL } from "node:url";

//
// generate code for each template & language, we will test against this later
//

process.chdir(fileURLToPath(new URL("../", import.meta.url))); // repo root
const out = join("tmp", "gen-test-code");
await Util.shEx(`rm -rf '${out}'`);

const palettes = { catppuccin, tailwind };
const scales = { d3Ordinal };
const tables = { ansi256: ansi256Table };

for (const [name, palette] of Object.entries(palettes)) {
  for (const language of languages) {
    let source = language.render(name, palette);
    if (language.name === "go") {
      source = `package ${name}\n\n${source}`;
    }
    const file = join(out, name, language.name, `colors.${extByName[language.name]}`);
    await Util.writeFile(file, source);
  }
}

for (const [name, scale] of Object.entries(scales)) {
  for (const language of languages) {
    let source = language.renderScales(name, scale);
    if (language.name === "go") {
      source = `package ${name}\n\n${source}`;
    }
    const file = join(out, name, language.name, `colors.${extByName[language.name]}`);
    await Util.writeFile(file, source);
  }
}

for (const [name, table] of Object.entries(tables)) {
  for (const language of languages) {
    let source = language.renderTable(name, table, hex256);
    if (language.name === "go") {
      source = `package ${name}\n\n${source}`;
    }
    const file = join(out, name, language.name, `colors.${extByName[language.name]}`);
    await Util.writeFile(file, source);
  }
}
