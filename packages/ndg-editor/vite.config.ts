import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    lib: {
      entry: { index: "src/index.ts", styles: "src/styles.ts" },
      formats: ["es"],
      fileName: (_, entryName) => `${entryName}.js`,
    },
  },
});
