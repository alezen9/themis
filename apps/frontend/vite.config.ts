import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

export default defineConfig({
  base: "/themis/",
  resolve: { conditions: ["development"], tsconfigPaths: true },
  build: { chunkSizeWarningLimit: 1536 },
  plugins: [
    tanstackRouter({
      routesDirectory: "./src/pages",
      generatedRouteTree: "./src/routeTree.gen.ts",
      routeFileIgnorePattern:
        "^(?!(__root|route)(\\.|$))(?!.*\\.route\\.(tsx?|jsx?)$).*\\.(tsx?|jsx?)$",
    }),
    react(),
    tailwindcss(),
  ],
  test: {
    environment: "jsdom",
    reporters: ["tree"],
    setupFiles: ["./src/vitest.setup.ts"],
    passWithNoTests: true,
    exclude: ["**/node_modules/**", "**/dist/**", "src/verifications/**"],
  },
});
