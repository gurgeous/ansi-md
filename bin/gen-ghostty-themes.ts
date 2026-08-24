#!/usr/bin/env -S sh -c 'node --experimental-strip-types --import "$(dirname "$0")/preload.ts" "$0" "$@"'
// Generate the vendored Ghostty ANSI theme palette CSV.
import Util from "@/lib/util.ts";
import { readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";

const OUT = "src/vendor/ghostty/themes.csv";
const COLORS = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"] as const;

const input = process.argv[2];
if (!input) Util.fatal("usage: gen-ghostty-themes.ts GHOSTTY_THEME_DIR");
const themeDir = resolve(input);
process.chdir(fileURLToPath(new URL("../", import.meta.url)));

const entries = (await readdir(themeDir, { withFileTypes: true }))
  .filter((entry) => (entry.isFile() || entry.isSymbolicLink()) && entry.name !== ".DS_Store")
  .toSorted((left, right) => left.name.localeCompare(right.name, "en", { sensitivity: "base" }));
const rows = await Promise.all(
  entries.map(async (entry) => {
    const source = await Util.readFile(join(themeDir, entry.name));
    const foreground = configColor(source, "foreground", entry.name);
    const background = configColor(source, "background", entry.name);
    const colors: string[] = [];

    for (const match of source.matchAll(/^palette\s*=\s*(\d+)\s*=\s*(#[\da-f]{6})\s*$/gim)) {
      const index = Number(match[1]);
      if (index >= COLORS.length) continue;
      if (colors[index]) throw new Error(`${entry.name}: duplicate palette index ${index}`);
      colors[index] = match[2].toLowerCase();
    }

    const missing = COLORS.flatMap((_, index) => (colors[index] ? [] : index));
    if (missing.length) throw new Error(`${entry.name}: missing palette indices ${missing.join(", ")}`);
    return [entry.name, foreground, background, ...colors];
  }),
);

const csv = [["name", "foreground", "background", ...COLORS], ...rows]
  .map((row) => row.map(csvCell).join(","))
  .join("\n");
await Util.writeFile(OUT, `${csv}\n`);
Util.banner(`generated ${OUT} (${rows.length} themes)`);

function configColor(source: string, key: string, theme: string) {
  const matches = [...source.matchAll(new RegExp(`^${key}\\s*=\\s*(#[\\da-f]{6})\\s*$`, "gim"))];
  if (matches.length !== 1) throw new Error(`${theme}: expected one ${key}, found ${matches.length}`);
  return matches[0][1].toLowerCase();
}

function csvCell(value: string) {
  if (!/[",\n\r]/.test(value)) return value;
  return `"${value.replaceAll('"', '""')}"`;
}
