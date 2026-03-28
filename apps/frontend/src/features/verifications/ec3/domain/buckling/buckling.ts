import type { FabricationType, SectionShape } from "../inputs";

type HollowSectionShape = Exclude<SectionShape, "I">;

export const EC3_IMPERFECTION_FACTORS = {
  a0: 0.13,
  a: 0.21,
  b: 0.34,
  c: 0.49,
  d: 0.76,
} as const;

export type BucklingCurve = keyof typeof EC3_IMPERFECTION_FACTORS;
export type BucklingCurvesYZ = { y: BucklingCurve; z: BucklingCurve };
export type BucklingCurves = BucklingCurvesYZ & { lt: BucklingCurve };

type ISectionBucklingRule = {
  hOverBMinExclusive?: number;
  hOverBMaxInclusive?: number;
  tfMaxInclusive?: number;
  curves: BucklingCurvesYZ;
};

type LtBucklingRule = {
  hOverBMinExclusive?: number;
  hOverBMaxInclusive?: number;
  curve: BucklingCurve;
};

export const EC3_HOLLOW_SECTION_BUCKLING_CURVES: Record<
  HollowSectionShape,
  Record<FabricationType, BucklingCurvesYZ>
> = {
  RHS: { rolled: { y: "a", z: "a" }, welded: { y: "b", z: "b" } },
  CHS: { rolled: { y: "a", z: "a" }, welded: { y: "a", z: "a" } },
};

export const EC3_HOLLOW_SECTION_LT_CURVES: Record<
  HollowSectionShape,
  Record<FabricationType, BucklingCurve>
> = { RHS: { rolled: "a", welded: "a" }, CHS: { rolled: "a", welded: "a" } };

export const EC3_I_SECTION_BUCKLING_RULES: Record<
  FabricationType,
  readonly ISectionBucklingRule[]
> = {
  rolled: [
    { hOverBMinExclusive: 1.2, tfMaxInclusive: 40, curves: { y: "a", z: "b" } },
    { hOverBMinExclusive: 1.2, curves: { y: "b", z: "c" } },
    {
      hOverBMaxInclusive: 1.2,
      tfMaxInclusive: 100,
      curves: { y: "b", z: "c" },
    },
    { hOverBMaxInclusive: 1.2, curves: { y: "d", z: "d" } },
  ],
  welded: [
    { tfMaxInclusive: 40, curves: { y: "b", z: "c" } },
    { curves: { y: "c", z: "d" } },
  ],
};

export const EC3_I_SECTION_LT_CURVE_RULES: readonly LtBucklingRule[] = [
  { hOverBMinExclusive: 2, curve: "a" },
  { curve: "b" },
];

export type BucklingSelectionInput =
  | { shape: "I"; fabricationType: FabricationType; hOverB: number; tf: number }
  | { shape: HollowSectionShape; fabricationType: FabricationType };

export const getImperfectionFactor = (curve: BucklingCurve) =>
  EC3_IMPERFECTION_FACTORS[curve];

const matchesISectionRule = (
  rule: ISectionBucklingRule | LtBucklingRule,
  hOverB: number,
  tf?: number,
): boolean => {
  if (
    rule.hOverBMinExclusive !== undefined &&
    !(hOverB > rule.hOverBMinExclusive)
  ) {
    return false;
  }

  if (
    rule.hOverBMaxInclusive !== undefined &&
    !(hOverB <= rule.hOverBMaxInclusive)
  ) {
    return false;
  }

  if (
    tf !== undefined &&
    "tfMaxInclusive" in rule &&
    rule.tfMaxInclusive !== undefined &&
    !(tf <= rule.tfMaxInclusive)
  ) {
    return false;
  }

  return true;
};

const resolveISectionBucklingCurves = (
  fabricationType: FabricationType,
  hOverB: number,
  tf: number,
): BucklingCurves => {
  const yzRule = EC3_I_SECTION_BUCKLING_RULES[fabricationType].find((rule) =>
    matchesISectionRule(rule, hOverB, tf),
  );
  const ltRule = EC3_I_SECTION_LT_CURVE_RULES.find((rule) =>
    matchesISectionRule(rule, hOverB),
  );

  if (!yzRule || !ltRule) {
    throw new Error("Unsupported I-section buckling rule");
  }

  return { ...yzRule.curves, lt: ltRule.curve };
};

export const getBucklingCurves = (
  input: BucklingSelectionInput,
): BucklingCurves => {
  if (input.shape === "I") {
    return resolveISectionBucklingCurves(
      input.fabricationType,
      input.hOverB,
      input.tf,
    );
  }

  return {
    ...EC3_HOLLOW_SECTION_BUCKLING_CURVES[input.shape][input.fabricationType],
    lt: EC3_HOLLOW_SECTION_LT_CURVES[input.shape][input.fabricationType],
  };
};
