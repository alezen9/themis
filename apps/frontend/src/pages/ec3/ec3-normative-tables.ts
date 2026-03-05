export type SectionShape = "I" | "RHS" | "CHS";

const IMPERFECTION_FACTORS: Record<string, number> = {
  a0: 0.13,
  a: 0.21,
  b: 0.34,
  c: 0.49,
  d: 0.76,
};

export const getImperfectionFactor = (curve: string) => {
  const alpha = IMPERFECTION_FACTORS[curve];
  if (alpha === undefined) {
    throw new Error(`Unknown buckling curve: "${curve}"`);
  }
  return alpha;
};

export const getBucklingCurves = (
  shape: SectionShape,
  sectionType: "rolled" | "welded",
  hOverB: number,
  tf: number,
) => {
  if (shape === "CHS") {
    return { y: "a", z: "a" };
  }

  if (shape === "RHS") {
    return sectionType === "rolled" ? { y: "a", z: "a" } : { y: "b", z: "b" };
  }

  if (sectionType === "rolled") {
    if (hOverB > 1.2) {
      return tf <= 40 ? { y: "a", z: "b" } : { y: "b", z: "c" };
    }
    return tf <= 100 ? { y: "b", z: "c" } : { y: "d", z: "d" };
  }

  return tf <= 40 ? { y: "b", z: "c" } : { y: "c", z: "d" };
};
