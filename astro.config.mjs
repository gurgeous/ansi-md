// Astro config for ansi.md.
import icon from "astro-icon";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { fileURLToPath, URL } from "node:url";

// ALLOWED_HOSTS for remote access
const allowedHosts = [];
const { ALLOWED_HOSTS } = process.env;
if (ALLOWED_HOSTS) allowedHosts.push(ALLOWED_HOSTS);

const src = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
  build: { inlineStylesheets: "always" },
  cacheDir: "tmp/astro",
  devToolbar: { enabled: false },
  fonts: [
    { provider, name: "Figtree",       cssVariable: "--font-figtree0", weights: ["400 900"] } /* prettier-ignore */,
    { provider, name: "IBM Plex Mono", cssVariable: "--font-ibm0",     weights: ["400 900"] } /* prettier-ignore */,
    { provider, name: "Inter",         cssVariable: "--font-inter0",   weights: ["400 900"] } /* prettier-ignore */,
  ],
  integrations: [icon(), mdx()],
  outDir: "tmp/dist",
  vite: {
    plugins: [tailwindcss()],
    resolve: { alias: { "@": src } },
    server: {
      rollupOptions: { external: ["tmp"] },
      server: { allowedHosts }, // for remote access
    },
  },
});
