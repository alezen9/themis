export type SectionShape = "I" | "RHS" | "CHS";

export const EC3_IMPERFECTION_FACTORS = {
  a0: 0.13,
  a: 0.21,
  b: 0.34,
  c: 0.49,
  d: 0.76,
} as const;

export type BucklingCurve = keyof typeof EC3_IMPERFECTION_FACTORS;
export type BucklingCurvesYZ = { y: BucklingCurve; z: BucklingCurve };

export const EC3_HOLLOW_SECTION_BUCKLING_CURVES: Record<
  Exclude<SectionShape, "I">,
  Record<"rolled" | "welded", BucklingCurvesYZ>
> = {
  CHS: { rolled: { y: "a", z: "a" }, welded: { y: "a", z: "a" } },
  RHS: { rolled: { y: "a", z: "a" }, welded: { y: "b", z: "b" } },
};

export const getImperfectionFactor = (curve: BucklingCurve) => {
  const alpha = EC3_IMPERFECTION_FACTORS[curve];
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
): BucklingCurvesYZ => {
  if (shape === "CHS" || shape === "RHS") {
    return EC3_HOLLOW_SECTION_BUCKLING_CURVES[shape][sectionType];
  }

  if (sectionType === "rolled") {
    if (hOverB > 1.2) {
      return tf <= 40 ? { y: "a", z: "b" } : { y: "b", z: "c" };
    }
    return tf <= 100 ? { y: "b", z: "c" } : { y: "d", z: "d" };
  }

  return tf <= 40 ? { y: "b", z: "c" } : { y: "c", z: "d" };
};
