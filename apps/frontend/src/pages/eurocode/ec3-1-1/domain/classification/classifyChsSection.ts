import { steelGradesMap } from "../../data/steelGrades";
import { Ec3FormValues } from "../../Form/schema";
import { getEpsilon2 } from "./utils";

type Geometry = Ec3FormValues["chs_geometry"];

export const classifyChsSection = (
  geometry: Geometry,
  steel_grade_id: Ec3FormValues["steel_grade_id"],
) => {
  const { d_mm, t_mm } = geometry;
  const ratio = d_mm / t_mm;

  const steelGrade = steelGradesMap.get(steel_grade_id);
  if (!steelGrade) throw new Error("Steel grade not found");
  const { fy_MPa, fy_above_40_MPa } = steelGrade;
  const fy = t_mm > 40 ? (fy_above_40_MPa ?? fy_MPa) : fy_MPa;

  const epsilon2 = getEpsilon2(fy);

  if (ratio <= 50 * epsilon2) return 1;
  if (ratio <= 70 * epsilon2) return 2;
  if (ratio <= 90 * epsilon2) return 3;

  throw new Error("Class 4 is not supported");
};
