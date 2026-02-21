import { expect, it } from "vitest";
import { VerificationSchema } from "@ndg/ndg-ec3";

const modules = import.meta.glob<{ default: unknown }>("./**/*.json", {
  eager: true,
});

for (const [path, module] of Object.entries(modules)) {
  it(`${path} matches Node schema`, () => {
    expect(() => VerificationSchema.parse(module.default)).not.toThrow();
  });
}
