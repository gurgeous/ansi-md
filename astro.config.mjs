// Astro config for Ansi.md.
import { parse as parseJs } from "acorn";
import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import catppuccin from "@shikijs/themes/catppuccin-frappe";
import { remarkGitHubRepoLinks } from "./src/lib/plugins/github.mjs";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import { defineConfig, fontProviders } from "astro/config";
import { parse as parsePath, resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import rehypeExternalLinks from "rehype-external-links";
import remarkGfm from "remark-gfm";
import AutoImportVite from "unplugin-auto-import/astro";

//
// ALLOWED_HOSTS for remote access
//

const { ALLOWED_HOSTS } = process.env;
const allowedHosts = (ALLOWED_HOSTS ?? "").split(",");

//
// add @reference to <style>
//

const tailwindReference = () => ({
  name: "tailwind-reference",
  enforce: "pre",
  transform(code, id) {
    if (!id.includes(".astro") || !id.includes("type=style")) return;
    if (!code.includes("@apply") || code.includes("@reference")) return;
    return { code: `@reference "@/main.css";\n\n${code}` };
  },
});

//
// github repo labels
//

const repoLabelOverrides = {};

//
// default layout
//

function remarkDefaultLayout() {
  return function (_, file) {
    const { frontmatter } = file.data.astro;
    if (frontmatter.title) {
      frontmatter.layout ??= "../components/ArticleLayout.astro";
    }
  };
}

//
// auto import
//
const autoImports = [
  {
    "es-toolkit": [
      "camelCase",
      "capitalize",
      "compact",
      "constantCase",
      "difference",
      "groupBy",
      "identity",
      "keyBy",
      "mapKeys",
      "mapValues",
      "maxBy",
      "minBy",
      "partition",
      "pascalCase",
      "pickBy",
      "range",
      "uniq",
      "zip",
    ],
    "es-toolkit/compat": ["isObject", "keys", "template", "values"],
  },
];

const autoImportVite = AutoImportVite({
  dts: "src/auto-imports.d.ts",
  include: [/\.(astro|ts)$/],
  imports: autoImports,
});

function importPath(path) {
  return path.startsWith(".") ? resolve(path) : path;
}

function importName(path) {
  return parsePath(path).name.replaceAll(/[^\w\d]/g, "");
}

function namedImports(imports) {
  return imports.map((item) => (typeof item === "string" ? item : `${item[0]} as ${item[1]}`)).join(", ");
}

function importStatements(config) {
  return config.flatMap((option) => {
    if (typeof option === "string") {
      return `import ${importName(option)} from ${JSON.stringify(importPath(option))};`;
    }
    return Object.entries(option).map(([path, imports]) => {
      const imported = typeof imports === "string" ? `* as ${imports}` : `{ ${namedImports(imports)} }`;
      return `import ${imported} from ${JSON.stringify(importPath(path))};`;
    });
  });
}

function mdxAutoImports(config) {
  const imports = importStatements(config).join("\n");
  const importsNode = {
    type: "mdxjsEsm",
    value: "",
    data: {
      estree: {
        ...parseJs(imports, { ecmaVersion: "latest", sourceType: "module" }),
        type: "Program",
        sourceType: "module",
      },
    },
  };

  return function mdxAutoImportPlugin() {
    return function injectMdxImports(tree, file) {
      if (file.basename?.endsWith(".md")) return;
      tree.children.unshift(importsNode);
    };
  };
}

//
// defineConfig
//

const src = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
  cacheDir: "tmp/astro",
  devToolbar: { enabled: false },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "IBM Plex Mono",
      cssVariable: "--font-ibm-plex-mono",
      weights: ["400 700"],
      styles: ["normal"],
    },
  ],
  integrations: [autoImportVite, mdx(), icon()],
  markdown: {
    processor: unified({
      rehypePlugins: [[rehypeExternalLinks, { rel: ["noopener", "noreferrer"], target: "_blank" }]],
      remarkPlugins: [
        remarkDefaultLayout,
        remarkGfm,
        [remarkGitHubRepoLinks, { overrides: repoLabelOverrides }],
        mdxAutoImports(autoImports),
      ],
      smartypants: false,
    }),
    shikiConfig: { theme: catppuccin },
  },
  vite: {
    plugins: [tailwindReference(), tailwindcss()],
    resolve: { alias: { "@": src } },
    server: {
      allowedHosts,
      watch: { ignored: ["**/tmp/**"] },
    },
  },
});
