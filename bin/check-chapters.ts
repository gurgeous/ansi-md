// Check that chapter nav entries point at real pages with matching titles.
import { chapters } from "@/lib/chapters";
import Util from "@/lib/util";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));

for (const section of chapters) {
  for (const item of section.items) {
    if (item.url === "/") continue;

    const stem = join(root, "src", "pages", item.url.slice(1));
    const file = `${stem}.mdx`;
    const source = await Util.readFile(file);
    const title = source.match(/^title:\s*(.+)$/m)?.[1];

    if (title !== item.name) {
      Util.fatal(`${item.url}: expected "${item.name}", got "${title ?? "missing"}"`);
    }
  }
}
