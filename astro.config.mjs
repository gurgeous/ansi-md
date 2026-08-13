// Astro config for Ansi.md.
import { parse as parseJs } from "acorn";
import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import catppuccin from "@shikijs/themes/catppuccin-frappe";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import { defineConfig, fontProviders } from "astro/config";
import { parse as parsePath, resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import rehypeExternalLinks from "rehype-external-links";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";
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
// handle github repo urls
//

const repoLabelOverrides = {
  "alecthomas/kong": "kong",
  "chalk/supports-color": "supports-color",
  "charmbracelet/bubbletea": "bubbletea",
  "charmbracelet/colorprofile": "colorprofile",
  "charmbracelet/gum": "gum",
  "charmbracelet/lipgloss": "lipgloss",
  "crigler/dtach": "dtach",
  "crossterm-rs/crossterm": "crossterm",
  "dalance/termbg": "termbg",
  "eza-community/eza": "eza",
  "ghostty-org/ghostty": "ghostty",
  "gurgeous/table_tennis": "table_tennis",
  "gurgeous/tennis": "tennis",
  "muesli/termenv": "termenv",
  "neurosnap/zmx": "zmx",
  "rust-cli/anstyle": "anstyle",
  "tautropfli/terminal-colorsaurus": "terminal-colorsaurus",
  "Textualize/rich": "rich",
  "Textualize/textual": "Textual",
};

function repoPath(href) {
  let url;
  try {
    url = new URL(href);
  } catch {
    return;
  }
  if (url.hostname !== "github.com") return;
  const [owner, repo] = url.pathname.split("/").filter(Boolean);
  if (!owner || !repo) return;
  return `${owner}/${repo}`;
}

function rawHref(node) {
  if (node.children.length !== 1) return;
  const [child] = node.children;
  if (child.type !== "text") return;
  if (child.value !== node.url) return;
  return child;
}

function remarkGitHubRepoLinks() {
  return (tree) => {
    visit(tree, "link", (node) => {
      const child = rawHref(node);
      if (!child) return;
      const repo = repoPath(node.url);
      if (!repo) return;
      child.value = repoLabelOverrides[repo] ?? repo;
    });
  };
}

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
    },
  ],
  integrations: [autoImportVite, mdx(), icon()],
  markdown: {
    processor: unified({
      rehypePlugins: [[rehypeExternalLinks, { rel: ["noopener", "noreferrer"], target: "_blank" }]],
      remarkPlugins: [remarkDefaultLayout, remarkGfm, remarkGitHubRepoLinks, mdxAutoImports(autoImports)],
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
