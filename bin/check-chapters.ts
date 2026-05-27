#!/usr/bin/env -S sh -c 'node --experimental-strip-types --import "$(dirname "$0")/preload.ts" "$0" "$@"'
// ^^ note magic shebang. this is how we run node w/ preload, no matte where we are

// Check that chapter nav entries point at real pages with matching titles.
import { chapters } from "@/lib/chapters";
import Util from "@/lib/util";
import { join } from "node:path";

for (const section of chapters) {
  for (const item of section.items) {
    if (item.url === "/") continue;

    const stem = join("src", "pages", item.url.slice(1));
    const file = `${stem}.mdx`;
    const source = await Util.readFile(file);
    const title = source.match(/^title:\s*(.+)$/m)?.[1];

    if (title !== item.name) {
      Util.fatal(`${item.url}: expected "${item.name}", got "${title ?? "missing"}"`);
    }
  }
}
