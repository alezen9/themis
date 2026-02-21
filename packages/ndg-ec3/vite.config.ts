import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    conditions: ["development"],
  },
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: "index",
    },
  },
  test: {
    environment: "node",
    passWithNoTests: true,
  },
});
