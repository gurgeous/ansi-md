// Astro config for Ansi.md.
import mdx from "@astrojs/mdx";
import catppuccin from "@shikijs/themes/catppuccin-latte";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import { defineConfig, fontProviders } from "astro/config";
import { fileURLToPath, URL } from "node:url";
import rehypeExternalLinks from "rehype-external-links";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";
import AutoImportVite from "unplugin-auto-import/astro";
import AutoImportMDX from "astro-auto-import";

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
  "charmbracelet/bubbletea": "bubbletea",
  "charmbracelet/gum": "gum",
  "charmbracelet/lipgloss": "lipgloss",
  "crossterm-rs/crossterm": "crossterm",
  "dalance/termbg": "termbg",
  "gurgeous/table_tennis": "table_tennis",
  "gurgeous/tennis": "tennis",
  "muesli/termenv": "termenv",
};

function repoPath(href) {
  let url;
  try {
    url = new URL(href);
  } catch {
    return;
  }
  if (!["github.com", "www.github.com"].includes(url.hostname)) return;
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
      console.log(frontmatter);
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
    ],
    "es-toolkit/compat": ["isObject", "keys", "template", "values"],
  },
];
const autoImportMdx = AutoImportMDX({
  imports: autoImports,
});

const autoImportVite = AutoImportVite({
  dts: "src/auto-imports.d.ts",
  include: [/\.(astro|ts)$/],
  imports: autoImports,
});

//
// defineConfig
//

const src = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
  cacheDir: "tmp/astro",
  devToolbar: { enabled: false },
  fonts: [
    {
      provider: fontProviders.google(),
      name: "IBM Plex Mono",
      cssVariable: "--font-ibm-plex-mono",
      weights: [400, 700],
      styles: ["normal", "italic"],
      subsets: ["latin"],
      fallbacks: ["monospace"],
    },
  ],
  integrations: [autoImportMdx, autoImportVite, mdx(), icon()],
  markdown: {
    rehypePlugins: [[rehypeExternalLinks, { rel: ["noopener", "noreferrer"], target: "_blank" }]],
    remarkPlugins: [remarkDefaultLayout, remarkGfm, remarkGitHubRepoLinks],
    shikiConfig: { theme: catppuccin },
    smartypants: false,
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
