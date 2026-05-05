import type { Ec3FormValues } from "../../Form/schema";

type Geometry = Ec3FormValues["chs_geometry"];

export const classifyChsSection = (chs_geometry: Geometry, fy_MPa: number) => {
  const { d_mm, t_mm } = chs_geometry;
  const slenderness = d_mm / t_mm;

  if (slenderness <= 0) throw new Error("Class 4 is not supported");

  const epsilonSquared = 235 / fy_MPa;
  if (slenderness <= 50 * epsilonSquared) return 1;
  if (slenderness <= 70 * epsilonSquared) return 2;
  if (slenderness <= 90 * epsilonSquared) return 3;

  throw new Error("Class 4 is not supported");
};
