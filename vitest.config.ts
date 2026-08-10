/// <reference types="vitest/config" />

// Vitest configuration for source tests and generated-code compiler checks.
// It mirrors Astro's Vite setup so test imports resolve like site code.
import { getViteConfig } from "astro/config";
import { fileURLToPath, URL } from "node:url";

const src = fileURLToPath(new URL("./src", import.meta.url));

export default getViteConfig({
  resolve: { alias: { "@": src } },
  test: {
    environment: "node",
    globals: true,
    include: ["test/**/*.test.ts"],
  },
});
