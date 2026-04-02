import { FABRICATION_TYPE_OPTIONS, SHAPE_OPTIONS } from "../../options";
import type { Ec3FormValues } from "../formSchema";

type FabricationType = (typeof FABRICATION_TYPE_OPTIONS)[number];
type SectionShape = (typeof SHAPE_OPTIONS)[number];
type HollowSectionShape = Exclude<SectionShape, "I">;

const BUCKLING_CURVE_OPTIONS = ["a0", "a", "b", "c", "d"] as const;

const EC3_IMPERFECTION_FACTORS = {
  a0: 0.13,
  a: 0.21,
  b: 0.34,
  c: 0.49,
  d: 0.76,
} satisfies Record<(typeof BUCKLING_CURVE_OPTIONS)[number], number>;

type BucklingCurve = (typeof BUCKLING_CURVE_OPTIONS)[number];
type BucklingCurvesYZ = { y: BucklingCurve; z: BucklingCurve };
type BucklingCurves = BucklingCurvesYZ & { lt: BucklingCurve };

type ISectionBucklingInput = Pick<
  Extract<Ec3FormValues, { shape: "I" }>,
  "shape" | "fabricationType" | "h" | "b" | "tf"
>;

type RhsSectionBucklingInput = Pick<
  Extract<Ec3FormValues, { shape: "RHS" }>,
  "shape" | "fabricationType"
>;

type ChsSectionBucklingInput = Pick<
  Extract<Ec3FormValues, { shape: "CHS" }>,
  "shape" | "fabricationType"
>;

type SectionBucklingInput =
  | ISectionBucklingInput
  | RhsSectionBucklingInput
  | ChsSectionBucklingInput;

const EC3_HOLLOW_SECTION_BUCKLING_CURVES: Record<
  HollowSectionShape,
  Record<FabricationType, BucklingCurvesYZ>
> = {
  RHS: { rolled: { y: "a", z: "a" }, welded: { y: "b", z: "b" } },
  CHS: { rolled: { y: "a", z: "a" }, welded: { y: "a", z: "a" } },
};

const EC3_HOLLOW_SECTION_LT_CURVES: Record<
  HollowSectionShape,
  Record<FabricationType, BucklingCurve>
> = { RHS: { rolled: "a", welded: "a" }, CHS: { rolled: "a", welded: "a" } };

type BucklingSelectionInput =
  | { shape: "I"; fabricationType: FabricationType; hOverB: number; tf: number }
  | { shape: HollowSectionShape; fabricationType: FabricationType };

export const getImperfectionFactor = (curve: BucklingCurve) =>
  EC3_IMPERFECTION_FACTORS[curve];

const computeISectionBucklingCurves = (
  fabricationType: FabricationType,
  hOverB: number,
  tf: number,
): BucklingCurves => ({
  ...(fabricationType === "rolled"
    ? hOverB > 1.2
      ? tf <= 40
        ? { y: "a", z: "b" }
        : { y: "b", z: "c" }
      : tf <= 100
        ? { y: "b", z: "c" }
        : { y: "d", z: "d" }
    : tf <= 40
      ? { y: "b", z: "c" }
      : { y: "c", z: "d" }),
  lt: hOverB > 2 ? "a" : "b",
});

export const getBucklingCurves = (
  input: BucklingSelectionInput,
): BucklingCurves => {
  if (input.shape === "I") {
    return computeISectionBucklingCurves(
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

export const computeBucklingProperties = (
  inputs: SectionBucklingInput | Ec3FormValues,
) => {
  const curves =
    inputs.shape === "I"
      ? getBucklingCurves({
          shape: "I",
          fabricationType: inputs.fabricationType,
          hOverB: inputs.h / inputs.b,
          tf: inputs.tf,
        })
      : getBucklingCurves({
          shape: inputs.shape,
          fabricationType: inputs.fabricationType,
        });

  return {
    section_shape: inputs.shape,
    buckling_curve_y: curves.y,
    buckling_curve_z: curves.z,
    buckling_curve_LT: curves.lt,
    alpha_y: getImperfectionFactor(curves.y),
    alpha_z: getImperfectionFactor(curves.z),
    alpha_LT: getImperfectionFactor(curves.lt),
  };
};
