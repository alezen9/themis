import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

export default defineConfig({
  base: "/themis/",
  resolve: {
    conditions: ["development"],
  },
  plugins: [
    TanStackRouterVite({
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
