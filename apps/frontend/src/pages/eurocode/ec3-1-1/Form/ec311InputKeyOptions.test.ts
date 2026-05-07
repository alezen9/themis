import { describe, expect, it } from "vitest";
import { defaultValues } from "./defaultValues";
import { ec311InputKeyOptions } from "./ec311InputKeyOptions";

const hasPath = (record: unknown, path: string) => {
  let currentValue = record;

  for (const part of path.split(".")) {
    if (typeof currentValue !== "object" || currentValue === null) {
      return false;
    }

    if (!(part in currentValue)) return false;
    currentValue = currentValue[part as keyof typeof currentValue];
  }

  return true;
};

describe("EC311 input key options", () => {
  it("only exposes keys present in the EC311 form defaults", () => {
    expect(ec311InputKeyOptions.length).toBeGreaterThan(0);

    for (const option of ec311InputKeyOptions) {
      const value = String(option.value);
      expect(hasPath(defaultValues, value), value).toBe(true);
    }
  });
});
