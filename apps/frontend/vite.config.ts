import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

export default defineConfig({
  base: "/themis/",
  resolve: { conditions: ["development"], tsconfigPaths: true },
  build: { chunkSizeWarningLimit: 1536 },
  plugins: [
    tanstackRouter({
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
    }),
    react(),
    tailwindcss(),
  ],
  test: {
    environment: "jsdom",
    passWithNoTests: true,
    exclude: ["**/node_modules/**", "**/dist/**", "src/verifications/**"],
  },
});
