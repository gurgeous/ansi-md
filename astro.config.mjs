// Astro config for Ansi.md.
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import { defineConfig, fontProviders } from "astro/config";
import { fileURLToPath, URL } from "node:url";

// ALLOWED_HOSTS for remote access
const allowedHosts = ["pinky"];
const { ALLOWED_HOSTS } = process.env;
if (ALLOWED_HOSTS) {
  allowedHosts.push(
    ...ALLOWED_HOSTS.split(",")
      .map((host) => host.trim())
      .filter(Boolean),
  );
}

const src = fileURLToPath(new URL("./src", import.meta.url));

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
  outDir: "tmp/dist",
  vite: {
    plugins: [tailwindcss()],
    resolve: { alias: { "@": src } },
    server: {
      allowedHosts,
      watch: { ignored: ["**/tmp/**"] },
    },
  },
});
