import { Context } from "./types";

export const getStressDistribution = (
  sigma_a_MPa: number,
  sigma_b_MPa: number,
  ctx: Context,
) => {
  const { N_Ed_kN = 0, M_y_Ed_kNm = 0, M_z_Ed_kNm = 0 } = ctx;

  const hasCompression = N_Ed_kN < 0;
  const hasBending = M_y_Ed_kNm !== 0 || M_z_Ed_kNm !== 0;

  const areBothZero = sigma_a_MPa === 0 && sigma_b_MPa === 0;
  const areBothPositive = sigma_a_MPa >= 0 && sigma_b_MPa >= 0;
  const areBothNegative = sigma_a_MPa < 0 && sigma_b_MPa < 0;

  if (areBothZero) return "no-stress";
  if (areBothPositive) return "tension";
  if (areBothNegative && hasBending) return "compression-bending";
  if (areBothNegative && !hasBending) return "compression";
  if (hasCompression) return "compression-bending";
  return "bending";
};
