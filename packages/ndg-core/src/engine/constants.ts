import { mapValues } from "lodash-es";

export type ConstantEntry = { value: number; symbol?: string; unit?: string };

export const constantCatalog: Record<string, ConstantEntry> = {
  pi: { value: Math.PI, symbol: "\\pi" },
  E: { value: 210000, symbol: "E", unit: "MPa" },
};

export const constantValues: Record<string, number> = mapValues(
  constantCatalog,
  entry => entry.value,
);
