import type { Ec311FormValues } from "../../Form/schema/schema";
import type { SteelGrade } from "../../data/steelGrades";

type SteelInputs = Pick<
  Ec311FormValues,
  "shape" | "i_geometry" | "rhs_geometry" | "chs_geometry"
>;

export const getSteelProperties = (
  steelGrade: SteelGrade,
  inputs: SteelInputs,
) => {
  let thickness_mm = Math.max(inputs.i_geometry.tf_mm, inputs.i_geometry.tw_mm);
  if (inputs.shape === "RHS") thickness_mm = inputs.rhs_geometry.tw_mm;
  if (inputs.shape === "CHS") thickness_mm = inputs.chs_geometry.t_mm;

  let fy_MPa = steelGrade.fy_above_40_MPa ?? steelGrade.fy_MPa;
  if (thickness_mm <= 40) fy_MPa = steelGrade.fy_MPa;

  let fu_MPa = steelGrade.fu_above_40_MPa ?? steelGrade.fu_MPa;
  if (thickness_mm <= 40) fu_MPa = steelGrade.fu_MPa;

  return { fy_MPa, fu_MPa };
};
