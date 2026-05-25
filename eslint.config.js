// ESLint policy checks for source imports and equality operators.
// Keep this narrow; TypeScript, Astro, and Prettier do the heavy lifting.
import { includeIgnoreFile } from "@eslint/compat";
import astro from "eslint-plugin-astro";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tseslint from "typescript-eslint";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const gitignore = path.join(__dirname, ".gitignore");

//
// our custom rules
//

const rules = {
  eqeqeq: ["error", "always"],
  "no-restricted-imports": [
    "error",
    {
      paths: ["es-toolkit", "es-toolkit/compat"],
      patterns: [{ group: ["../*"] }],
    },
  ],
};

//
// config
//

export default tseslint.config(
  includeIgnoreFile(gitignore),
  { ignores: ["src/auto-imports.d.ts"] },

  // all files
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      parser: tseslint.parser,
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { "@typescript-eslint": tseslint.plugin },
    rules,
  },

  // tests
  {
    files: ["test/**/*.{js,mjs,cjs,ts,mts,cts}"],
    rules: {
      "no-restricted-imports": "off",
    },
  },

  {
    files: ["bin/**/*.{js,mjs,cjs,ts,mts,cts}"],
    rules: {
      "no-restricted-imports": "off",
    },
  },

  // now astro stuff
  ...astro.configs["flat/base"],
  {
    files: ["**/*.astro"],
    languageOptions: { globals: globals.browser },
    rules,
  },
);
