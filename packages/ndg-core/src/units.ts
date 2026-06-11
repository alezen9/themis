import type { NDGValue } from "./types";

export type Unit = { key: string; tex: string; factor: number };

const UNIT_FAMILIES: Unit[][] = [
  [
    { key: "N", tex: "N", factor: 1 },
    { key: "kN", tex: "kN", factor: 1e-3 },
    { key: "MN", tex: "MN", factor: 1e-6 },
  ],
  [
    { key: "Nmm", tex: "N{\\cdot}mm", factor: 1 },
    { key: "Nm", tex: "N{\\cdot}m", factor: 1e-3 },
    { key: "kNm", tex: "kN{\\cdot}m", factor: 1e-6 },
  ],
  [
    { key: "MPa", tex: "MPa", factor: 1 },
    { key: "GPa", tex: "GPa", factor: 1e-3 },
  ],
  [
    { key: "mm", tex: "mm", factor: 1 },
    { key: "cm", tex: "cm", factor: 1e-1 },
    { key: "m", tex: "m", factor: 1e-3 },
  ],
  [
    { key: "mm2", tex: "mm^2", factor: 1 },
    { key: "cm2", tex: "cm^2", factor: 1e-2 },
    { key: "m2", tex: "m^2", factor: 1e-6 },
  ],
  [
    { key: "mm3", tex: "mm^3", factor: 1 },
    { key: "cm3", tex: "cm^3", factor: 1e-3 },
  ],
  [
    { key: "mm4", tex: "mm^4", factor: 1 },
    { key: "cm4", tex: "cm^4", factor: 1e-4 },
  ],
  [
    { key: "mm6", tex: "mm^6", factor: 1 },
    { key: "cm6", tex: "cm^6", factor: 1e-6 },
  ],
];

const familyByToken = new Map(
  UNIT_FAMILIES.map(family => [family[0].key, family]),
);

const findUnits = (key: string): Unit[] => {
  const unitToken = key.split("_").pop() ?? "";
  return familyByToken.get(unitToken) ?? [];
};

export const getBaseUnit = (key: string): Unit | undefined =>
  findUnits(key)[0];

export const getUnitOptions = (key: string) =>
  findUnits(key).map(unit => ({
    value: unit.key,
    label: unit.key,
    ctx: { tex: unit.tex },
  }));

export const scaleToUnit = (
  value: NDGValue,
  key: string,
  unit?: string,
): { value: NDGValue; tex: string | undefined } => {
  const units = findUnits(key);
  const target = units.find(candidate => candidate.key === unit) ?? units[0];
  if (!target) return { value, tex: undefined };
  const scaled = typeof value === "number" ? value * target.factor : value;
  return { value: scaled, tex: target.tex };
};
