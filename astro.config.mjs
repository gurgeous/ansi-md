// Astro config for Ansi.md.
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import { defineConfig, fontProviders } from "astro/config";
import { fileURLToPath, URL } from "node:url";

// ALLOWED_HOSTS for remote access
const { ALLOWED_HOSTS } = process.env;
const allowedHosts = (ALLOWED_HOSTS ?? "").split(",");

const src = fileURLToPath(new URL("./src", import.meta.url));

const tailwindReference = () => ({
  name: "tailwind-reference",
  enforce: "pre",
  transform(code, id) {
    if (!id.includes(".astro") || !id.includes("type=style")) return;
    if (!code.includes("@apply") || code.includes("@reference")) return;
    return { code: `@reference "@/main.css";\n\n${code}` };
  },
});

export default defineConfig({
  build: { inlineStylesheets: "always" },
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
  integrations: [mdx(), icon()],
  markdown: {
    smartypants: false,
  },
  outDir: "tmp/dist",
  vite: {
    plugins: [tailwindReference(), tailwindcss()],
    resolve: { alias: { "@": src } },
    server: {
      allowedHosts,
      watch: { ignored: ["**/tmp/**"] },
    },
  },
});
