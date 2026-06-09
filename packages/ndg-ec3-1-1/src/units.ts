import type { NDGValue } from "@ndg/ndg-core";

type DisplayUnit = { key: string; label: string; factor: number };
type UnitEntry = { label: string; family: readonly DisplayUnit[] };

const UNIT_TOKENS: Record<string, UnitEntry> = {
  N: {
    label: "N",
    family: [
      { key: "N", label: "N", factor: 1 },
      { key: "kN", label: "kN", factor: 1e-3 },
      { key: "MN", label: "MN", factor: 1e-6 },
    ],
  },
  Nmm: {
    label: "N{\\cdot}mm",
    family: [
      { key: "Nmm", label: "N{\\cdot}mm", factor: 1 },
      { key: "Nm", label: "N{\\cdot}m", factor: 1e-3 },
      { key: "kNm", label: "kN{\\cdot}m", factor: 1e-6 },
    ],
  },
  MPa: {
    label: "MPa",
    family: [
      { key: "MPa", label: "MPa", factor: 1 },
      { key: "GPa", label: "GPa", factor: 1e-3 },
    ],
  },
  mm: {
    label: "mm",
    family: [
      { key: "mm", label: "mm", factor: 1 },
      { key: "cm", label: "cm", factor: 1e-1 },
      { key: "m", label: "m", factor: 1e-3 },
    ],
  },
  mm2: {
    label: "mm^2",
    family: [
      { key: "mm2", label: "mm^2", factor: 1 },
      { key: "cm2", label: "cm^2", factor: 1e-2 },
      { key: "m2", label: "m^2", factor: 1e-6 },
    ],
  },
  mm3: {
    label: "mm^3",
    family: [
      { key: "mm3", label: "mm^3", factor: 1 },
      { key: "cm3", label: "cm^3", factor: 1e-3 },
    ],
  },
  mm4: {
    label: "mm^4",
    family: [
      { key: "mm4", label: "mm^4", factor: 1 },
      { key: "cm4", label: "cm^4", factor: 1e-4 },
    ],
  },
  mm6: {
    label: "mm^6",
    family: [
      { key: "mm6", label: "mm^6", factor: 1 },
      { key: "cm6", label: "cm^6", factor: 1e-6 },
    ],
  },
};

const entryOf = (key: string): UnitEntry | undefined =>
  UNIT_TOKENS[key.split("_").pop() ?? ""];

export const unitLabel = (key: string): string | undefined =>
  entryOf(key)?.label;

export const displayUnitOptions = (key: string): readonly DisplayUnit[] =>
  entryOf(key)?.family ?? [];

export const applyDisplayUnit = (
  value: NDGValue,
  key: string,
  displayUnit: string | undefined,
): { value: NDGValue; label: string | undefined } => {
  const entry = entryOf(key);
  if (!entry) return { value, label: undefined };
  const chosen = entry.family.find(unit => unit.key === displayUnit);
  const converted =
    typeof value === "number" && chosen ? value * chosen.factor : value;
  return { value: converted, label: chosen?.label ?? entry.label };
};
