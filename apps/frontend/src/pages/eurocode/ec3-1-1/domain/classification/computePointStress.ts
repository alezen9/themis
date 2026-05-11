import { Context, Point } from "./types";

export const computePointStress = (point: Point, ctx: Context) => {
  const { A_mm2, Iy_mm4, Iz_mm4, N_Ed_kN, M_y_Ed_kNm, M_z_Ed_kNm } = ctx;

  const sigmaN_MPa = (N_Ed_kN * 1_000) / A_mm2; // compression negative
  const sigmaMy_MPa = ((M_y_Ed_kNm * 1_000_000) / Iy_mm4) * point.z_mm; // compression negative
  const sigmaMz_MPa = ((M_z_Ed_kNm * 1_000_000) / Iz_mm4) * point.y_mm; // compression negative
  return sigmaN_MPa - sigmaMy_MPa + sigmaMz_MPa;
};
