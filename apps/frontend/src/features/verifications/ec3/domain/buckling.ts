export type SectionShape = "I" | "RHS" | "CHS";
type FabricationType = "rolled" | "welded";
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
  minHOverBExclusive?: number;
  maxHOverBInclusive?: number;
  maxTf: number;
  curves: BucklingCurvesYZ;
};

type LtBucklingRule = { minHOverBExclusive?: number; curve: BucklingCurve };

export const EC3_HOLLOW_SECTION_BUCKLING_CURVES: Record<
  HollowSectionShape,
  Record<FabricationType, BucklingCurvesYZ>
> = {
  CHS: { rolled: { y: "a", z: "a" }, welded: { y: "a", z: "a" } },
  RHS: { rolled: { y: "a", z: "a" }, welded: { y: "b", z: "b" } },
};

export const EC3_HOLLOW_SECTION_LT_CURVES: Record<
  HollowSectionShape,
  BucklingCurve
> = { CHS: "a", RHS: "a" };

export const EC3_I_SECTION_BUCKLING_RULES: Record<
  FabricationType,
  readonly ISectionBucklingRule[]
> = {
  rolled: [
    { minHOverBExclusive: 1.2, maxTf: 40, curves: { y: "a", z: "b" } },
    { minHOverBExclusive: 1.2, maxTf: Infinity, curves: { y: "b", z: "c" } },
    { maxHOverBInclusive: 1.2, maxTf: 100, curves: { y: "b", z: "c" } },
    { maxHOverBInclusive: 1.2, maxTf: Infinity, curves: { y: "d", z: "d" } },
  ],
  welded: [
    { maxTf: 40, curves: { y: "b", z: "c" } },
    { maxTf: Infinity, curves: { y: "c", z: "d" } },
  ],
};

export const EC3_I_SECTION_LT_CURVE_RULES: readonly LtBucklingRule[] = [
  { minHOverBExclusive: 2, curve: "a" },
  { curve: "b" },
];

export type BucklingSelectionInput =
  | { shape: "I"; fabricationType: FabricationType; hOverB: number; tf: number }
  | { shape: HollowSectionShape; fabricationType: FabricationType };

export const getImperfectionFactor = (curve: BucklingCurve) => {
  const alpha = EC3_IMPERFECTION_FACTORS[curve];
  if (alpha === undefined) {
    throw new Error(`Unknown buckling curve: "${curve}"`);
  }
  return alpha;
};

const matchesISectionRule = (
  rule: ISectionBucklingRule,
  hOverB: number,
  tf: number,
) => {
  if (
    rule.minHOverBExclusive !== undefined &&
    !(hOverB > rule.minHOverBExclusive)
  ) {
    return false;
  }
  if (
    rule.maxHOverBInclusive !== undefined &&
    hOverB > rule.maxHOverBInclusive
  ) {
    return false;
  }
  return tf <= rule.maxTf;
};

const resolveISectionBucklingCurves = ({
  fabricationType,
  hOverB,
  tf,
}: Extract<BucklingSelectionInput, { shape: "I" }>): BucklingCurves => {
  const yzRule = EC3_I_SECTION_BUCKLING_RULES[fabricationType].find((rule) =>
    matchesISectionRule(rule, hOverB, tf),
  );
  if (!yzRule) {
    throw new Error(
      `No EC3 I-section buckling rule matches h/b=${hOverB} and tf=${tf}`,
    );
  }

  const ltRule = EC3_I_SECTION_LT_CURVE_RULES.find(
    (rule) =>
      rule.minHOverBExclusive === undefined || hOverB > rule.minHOverBExclusive,
  );
  if (!ltRule) {
    throw new Error(`No EC3 I-section LT buckling rule matches h/b=${hOverB}`);
  }

  return { ...yzRule.curves, lt: ltRule.curve };
};

export const getBucklingCurves = (
  input: BucklingSelectionInput,
): BucklingCurves => {
  if (input.shape === "I") {
    return resolveISectionBucklingCurves(input);
  }

  return {
    ...EC3_HOLLOW_SECTION_BUCKLING_CURVES[input.shape][input.fabricationType],
    lt: EC3_HOLLOW_SECTION_LT_CURVES[input.shape],
  };
};
