import { Prettify } from "../../../../../utils";
import { steelGradesMap } from "../../data/steelGrades";
import type { Ec311FormValues } from "../../Form/schema/schema";

type BucklingCurve = "a0" | "a" | "b" | "c" | "d";
type FlexuralBucklingCurves = { y: BucklingCurve; z: BucklingCurve };

type Input = Prettify<
  Pick<
    Ec311FormValues,
    | "shape"
    | "fabrication_type"
    | "steel_grade_id"
    | "i_geometry"
    | "buckling_curves_LT_policy"
  >
>;

type ISectionBucklingInput = {
  fabrication_type: Ec311FormValues["fabrication_type"];
  hOverB: number;
  tf_mm: number;
  isS460: boolean;
};

type HollowSectionBucklingInput = {
  fabrication_type: Ec311FormValues["fabrication_type"];
  isS460: boolean;
};

type LateralTorsionalBucklingInput = {
  fabrication_type: Ec311FormValues["fabrication_type"];
  hOverB: number;
  policy: Ec311FormValues["buckling_curves_LT_policy"];
};

const getIFlexuralBucklingCurves = (
  input: ISectionBucklingInput,
): FlexuralBucklingCurves => {
  const { fabrication_type, tf_mm, isS460, hOverB } = input;
  if (fabrication_type !== "welded" && fabrication_type !== "rolled")
    throw new Error(
      `Received fabrication_type ${fabrication_type} but expected either "rolled" or "welded`,
    );
  if (fabrication_type === "welded") {
    if (tf_mm <= 40) return { y: "b", z: "c" };
    return { y: "c", z: "d" };
  }

  if (hOverB > 1.2) {
    if (tf_mm <= 40) {
      if (isS460) return { y: "a0", z: "a0" };
      return { y: "a", z: "b" };
    }

    if (isS460) return { y: "a", z: "a" };
    return { y: "b", z: "c" };
  }

  if (tf_mm <= 100) {
    if (isS460) return { y: "a", z: "a" };
    return { y: "b", z: "c" };
  }

  if (isS460) return { y: "c", z: "c" };

  return { y: "d", z: "d" };
};

const getHollowFlexuralBucklingCurves = (
  input: HollowSectionBucklingInput,
): FlexuralBucklingCurves => {
  const { fabrication_type, isS460 } = input;
  if (fabrication_type === "cold-formed") return { y: "c", z: "c" };
  if (isS460) return { y: "a0", z: "a0" };
  return { y: "a", z: "a" };
};

const getILateralTorsionalBucklingCurve = (
  input: LateralTorsionalBucklingInput,
): BucklingCurve => {
  const { hOverB, policy, fabrication_type } = input;
  const isSlender = hOverB > 2;

  if (policy === "general") {
    if (fabrication_type === "rolled") return isSlender ? "b" : "a";
    return isSlender ? "d" : "c";
  }

  if (fabrication_type === "rolled") return isSlender ? "c" : "b";
  return isSlender ? "d" : "c";
};

export const getBucklingCurves = (input: Input) => {
  const {
    steel_grade_id,
    shape,
    fabrication_type,
    i_geometry,
    buckling_curves_LT_policy,
  } = input;

  const steelGrade = steelGradesMap.get(steel_grade_id);
  if (!steelGrade) throw new Error(`Unknown steel grade: ${steel_grade_id}`);
  const isS460 = steelGrade.fy_MPa === 460;

  if (shape === "I") {
    const hOverB = i_geometry.h_mm / i_geometry.b_mm;

    return {
      ...getIFlexuralBucklingCurves({
        fabrication_type,
        hOverB,
        tf_mm: i_geometry.tf_mm,
        isS460,
      }),
      lt: getILateralTorsionalBucklingCurve({
        fabrication_type,
        hOverB,
        policy: buckling_curves_LT_policy,
      }),
    };
  }

  return {
    ...getHollowFlexuralBucklingCurves({ fabrication_type, isS460 }),
    lt: "d",
  };
};
