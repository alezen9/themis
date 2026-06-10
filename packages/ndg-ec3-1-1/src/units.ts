import type { NDGValue } from "@ndg/ndg-core";

type DisplayUnit = { key: string; tex: string; factor: number };
type UnitEntry = { tex: string; family: readonly DisplayUnit[] };

const UNIT_TOKENS: Record<string, UnitEntry> = {
  N: {
    tex: "N",
    family: [
      { key: "N", tex: "N", factor: 1 },
      { key: "kN", tex: "kN", factor: 1e-3 },
      { key: "MN", tex: "MN", factor: 1e-6 },
    ],
  },
  Nmm: {
    tex: "N{\\cdot}mm",
    family: [
      { key: "Nmm", tex: "N{\\cdot}mm", factor: 1 },
      { key: "Nm", tex: "N{\\cdot}m", factor: 1e-3 },
      { key: "kNm", tex: "kN{\\cdot}m", factor: 1e-6 },
    ],
  },
  MPa: {
    tex: "MPa",
    family: [
      { key: "MPa", tex: "MPa", factor: 1 },
      { key: "GPa", tex: "GPa", factor: 1e-3 },
    ],
  },
  mm: {
    tex: "mm",
    family: [
      { key: "mm", tex: "mm", factor: 1 },
      { key: "cm", tex: "cm", factor: 1e-1 },
      { key: "m", tex: "m", factor: 1e-3 },
    ],
  },
  mm2: {
    tex: "mm^2",
    family: [
      { key: "mm2", tex: "mm^2", factor: 1 },
      { key: "cm2", tex: "cm^2", factor: 1e-2 },
      { key: "m2", tex: "m^2", factor: 1e-6 },
    ],
  },
  mm3: {
    tex: "mm^3",
    family: [
      { key: "mm3", tex: "mm^3", factor: 1 },
      { key: "cm3", tex: "cm^3", factor: 1e-3 },
    ],
  },
  mm4: {
    tex: "mm^4",
    family: [
      { key: "mm4", tex: "mm^4", factor: 1 },
      { key: "cm4", tex: "cm^4", factor: 1e-4 },
    ],
  },
  mm6: {
    tex: "mm^6",
    family: [
      { key: "mm6", tex: "mm^6", factor: 1 },
      { key: "cm6", tex: "cm^6", factor: 1e-6 },
    ],
  },
};

const entryOf = (key: string): UnitEntry | undefined =>
  UNIT_TOKENS[key.split("_").pop() ?? ""];

export const unitTex = (key: string): string | undefined => entryOf(key)?.tex;

export const getDisplayUnitOptionsByKey = (key: string) =>
  entryOf(key)?.family.map(unit => ({
    value: unit.key,
    label: unit.key,
    ctx: { tex: unit.tex },
  })) ?? [];

export const applyDisplayUnit = (
  value: NDGValue,
  key: string,
  displayUnit: string | undefined,
): { value: NDGValue; tex: string | undefined } => {
  const entry = entryOf(key);
  if (!entry) return { value, tex: undefined };
  const chosen = entry.family.find(unit => unit.key === displayUnit);
  const converted =
    typeof value === "number" && chosen ? value * chosen.factor : value;
  return { value: converted, tex: chosen?.tex ?? entry.tex };
};
