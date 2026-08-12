// Arrange ANSI 256 names into readable generated-code sections.
import { ansi256Table, hex256 } from "@/lib/palettes/ansi256.ts";
import type { TableSections } from "@/lib/palettes/index.ts";

const primary: [string, number][] = [];
const aliases: [string, number][] = [];
const seen = new Set<number>();

for (const entry of Object.entries(ansi256Table)) {
  (seen.has(entry[1]) ? aliases : primary).push(entry);
  seen.add(entry[1]);
}

export const ansi256View = Object.fromEntries([...primary, ...aliases]);
export const ansi256Sections: TableSections = {};

for (const [name, index] of primary) {
  if (index === 232) {
    ansi256Sections[name] = "grayscale";
  } else if ((index - 16) % 36 === 0) {
    ansi256Sections[name] = `red = 0x${hex256(index).slice(1, 3)}`;
  }
}
ansi256Sections[aliases[0][0]] = "gray aliases";
