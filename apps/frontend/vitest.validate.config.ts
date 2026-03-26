import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    passWithNoTests: true,
    include: [
      "src/features/verifications/ec3/**/*.test.ts",
      "src/features/verifications/ec3/**/*.test.tsx",
    ],
  },
});
