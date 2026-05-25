import { existsSync, statSync } from "node:fs";
import { registerHooks } from "node:module";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const root = resolve(here, "..");
const src = resolve(root, "src");

//
// add hook to node so that we can resolve '@/xxxxx.' imports
//

function resolveAlias(specifier) {
  const stem = resolve(src, specifier.slice(2));
  const candidates = [stem, `${stem}.ts`, `${stem}.js`, resolve(stem, "index.ts"), resolve(stem, "index.js")];

  for (const candidate of candidates) {
    if (existsSync(candidate) && statSync(candidate).isFile()) {
      return pathToFileURL(candidate).href;
    }
  }
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      const url = resolveAlias(specifier);
      if (url) return { shortCircuit: true, url };
    }
    return nextResolve(specifier, context);
  },
});
