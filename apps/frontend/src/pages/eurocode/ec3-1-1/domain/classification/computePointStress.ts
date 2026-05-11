import { Context, Point } from "./types";

export const computePointStress = (point: Point, ctx: Context) => {
  const { A_mm2, Iy_mm4, Iz_mm4 } = ctx;
  const N_Ed_kN = ctx.N_Ed_kN ?? 0;
  const M_y_Ed_kNm = ctx.M_y_Ed_kNm ?? 0;
  const M_z_Ed_kNm = ctx.M_z_Ed_kNm ?? 0;

  const sigmaN_MPa = (N_Ed_kN * 1_000) / A_mm2;
  const sigmaMy_MPa = ((M_y_Ed_kNm * 1_000_000) / Iy_mm4) * point.y_mm;
  const sigmaMz_MPa = ((M_z_Ed_kNm * 1_000_000) / Iz_mm4) * point.z_mm;
  return sigmaN_MPa + sigmaMy_MPa + sigmaMz_MPa;
};
