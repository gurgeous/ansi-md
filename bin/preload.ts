// Sorry. This preload exists so tiny local TS scripts can behave like repo
// code. Node needs help with "@/..." imports and our auto-import globals, so
// this file keeps that runtime glue in one place instead of spreading it
// through every script or shell command.

import {
    camelCase,
    capitalize,
    compact,
    constantCase,
    difference,
    groupBy,
    identity,
    keyBy,
    mapKeys,
    mapValues,
    maxBy,
    minBy,
    partition,
    pascalCase,
    pickBy,
    range,
    uniq,
    zip,
} from "es-toolkit";
import { isObject, keys, template, values } from "es-toolkit/compat";
import { existsSync, statSync } from "node:fs";
import { registerHooks } from "node:module";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

//
// auto-imports
//

Object.assign(globalThis, {
  camelCase,
  capitalize,
  compact,
  constantCase,
  difference,
  groupBy,
  identity,
  isObject,
  keyBy,
  keys,
  mapKeys,
  mapValues,
  maxBy,
  minBy,
  partition,
  pascalCase,
  pickBy,
  range,
  template,
  uniq,
  values,
  zip,
});

//
// resolve @/...
//

const __dirname = fileURLToPath(new URL(".", import.meta.url));

function resolveAlias(specifier: string) {
  const stem = resolve(__dirname, "../src", specifier.slice(2));
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
