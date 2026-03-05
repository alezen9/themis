import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    passWithNoTests: true,
    include: ["src/pages/ec3/**/*.test.ts"],
  },
});
