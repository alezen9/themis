import { defineConfig } from "vite";

export default defineConfig({
  build: { lib: { entry: "src/index.ts", formats: ["es"], fileName: "index" } },
  test: { environment: "jsdom", passWithNoTests: true },
});
