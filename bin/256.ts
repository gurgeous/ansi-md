#!/usr/bin/env -S sh -c 'node --experimental-strip-types --import "$(dirname "$0")/preload.ts" "$0" "$@"'
// ^^ note magic shebang. this is how we run node w/ preload, no matte where we are

// Generate the ANSI 256 color-name research CSV under tmp/.
import Color from "colorjs.io";
import { nearestColor } from "@/lib/color.ts";
import { hex256 } from "@/lib/palettes/ansi256.ts";
import Util from "@/lib/util.ts";
import { fileURLToPath, URL } from "node:url";

type NamedColor = { name: string; hex: string };
type MatchColor = Color & { name: string; sourceHex: string };

const VENDOR = "src/vendor/256";
const OUT = "tmp/256.csv";
const COLUMNS = [
  "idx",
  "rgb",
  "hex",
  "winner",
  "hexdocs1",
  "hexdocs2",
  "hexdocs3",
  "hexdocs4",
  "ditig",
  "wowsignal1",
  "wowsignal2",
  "wowsignal3",
  "wowsignal4",
  "wowsignal5",
  "css",
  "css_hex",
  "css_deltae",
  "rgb_txt",
  "rgb_txt_hex",
  "rgb_txt_deltae",
] as const;

process.chdir(fileURLToPath(new URL("../", import.meta.url))); // repo root

function splitCsvLine(line: string) {
  const cells: string[] = [];
  let cell = "";
  let quoted = false;

  for (let ii = 0; ii < line.length; ii++) {
    const char = line[ii];
    if (char === '"' && quoted && line[ii + 1] === '"') {
      cell += '"';
      ii++;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      cells.push(cell);
      cell = "";
    } else {
      cell += char;
    }
  }

  cells.push(cell);
  return cells;
}

async function readCsv(file: string) {
  const [header, ...lines] = (await Util.readFile(file)).trimEnd().split("\n");
  const columns = splitCsvLine(header);
  return lines.map((line) => Object.fromEntries(splitCsvLine(line).map((cell, ii) => [columns[ii], cell])));
}

function csvCell(value: string | number) {
  const str = String(value);
  if (!/[",\n]/.test(str)) return str;
  return `"${str.replaceAll('"', '""')}"`;
}

function normalizeName(name: string) {
  return name.toLowerCase().replaceAll(/[^a-z0-9]/g, "");
}

function colorFromHex({ name, hex }: NamedColor): MatchColor {
  return Object.assign(new Color(hex), { name, sourceHex: hex });
}

function nearestName(needle: Color, haystack: MatchColor[]) {
  const match = nearestColor(needle, haystack) as MatchColor;
  return { delta: needle.deltaEOK(match), hex: match.sourceHex, name: normalizeName(match.name) };
}

function indexed(rows: Record<string, string>[], key: string) {
  return Object.fromEntries(rows.map((row) => [row.idx, row[key]]));
}

const hexdocs = indexed(await readCsv(`${VENDOR}/hexdocs.csv`), "names");
const ditig = indexed(await readCsv(`${VENDOR}/ditig.csv`), "name");
const wowsignal = Object.fromEntries((await readCsv(`${VENDOR}/wowsignal.csv`)).map((row) => [row.idx, row]));
const cssHaystack = (await readCsv(`${VENDOR}/css.csv`)).map((row) => colorFromHex(row as NamedColor));
const rgbTxtHaystack = (await readCsv(`${VENDOR}/rgb.txt.csv`)).map((row) => colorFromHex(row as NamedColor));

const rows = range(16, 256).map((idx) => {
  const hex = hex256(idx);
  const color = new Color(hex);
  const css = nearestName(color, cssHaystack);
  const rgb = nearestName(color, rgbTxtHaystack);
  const wow = wowsignal[idx] ?? {};
  const hexdoc = (hexdocs[idx] ?? "").split("; ").map(normalizeName);

  return {
    idx,
    rgb: hex
      .slice(1)
      .match(/../g)!
      .map((part) => Number.parseInt(part, 16))
      .join(","),
    hex,
    winner: "",
    hexdocs1: hexdoc[0] ?? "",
    hexdocs2: hexdoc[1] ?? "",
    hexdocs3: hexdoc[2] ?? "",
    hexdocs4: hexdoc[3] ?? "",
    ditig: normalizeName(ditig[idx] ?? ""),
    wowsignal1: normalizeName(wow.name1 ?? ""),
    wowsignal2: normalizeName(wow.name2 ?? ""),
    wowsignal3: normalizeName(wow.name3 ?? ""),
    wowsignal4: normalizeName(wow.name4 ?? ""),
    wowsignal5: normalizeName(wow.name5 ?? ""),
    css: css.name,
    css_hex: css.hex,
    css_deltae: css.delta.toFixed(2),
    cssDistance: css.delta,
    rgb_txt: rgb.name,
    rgb_txt_hex: rgb.hex,
    rgb_txt_deltae: rgb.delta.toFixed(2),
    rgbDistance: rgb.delta,
  };
});

const usedNames = new Set<string>();
for (const row of rows.toSorted((aa, bb) => aa.cssDistance - bb.cssDistance)) {
  if (usedNames.has(row.css)) continue;
  row.winner = row.css;
  usedNames.add(row.winner);
}
for (const row of rows.toSorted((aa, bb) => aa.rgbDistance - bb.rgbDistance)) {
  if (row.winner || /\d/.test(row.rgb_txt) || usedNames.has(row.rgb_txt)) continue;
  row.winner = row.rgb_txt;
  usedNames.add(row.winner);
}

const csv = [COLUMNS.join(","), ...rows.map((row) => COLUMNS.map((column) => csvCell(row[column])).join(","))];
await Util.writeFile(OUT, `${csv.join("\n")}\n`);
Util.banner(`generated ${OUT}`);
