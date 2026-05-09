import { steelGradesMap } from "../../data/steelGrades";
import { Ec3FormValues } from "../../Form/schema";

type Geometry = Ec3FormValues["i_geometry"];

export const getISteelDesignStrength = (
  geometry: Geometry,
  steel_grade_id: Ec3FormValues["steel_grade_id"],
) => {
  const steelGrade = steelGradesMap.get(steel_grade_id);
  if (!steelGrade) throw new Error("Steel grade not found");

  const { fy_MPa, fy_above_40_MPa } = steelGrade;
  const thickness_mm = Math.max(geometry.tw_mm, geometry.tf_mm);

  return thickness_mm > 40 ? (fy_above_40_MPa ?? fy_MPa) : fy_MPa;
};
