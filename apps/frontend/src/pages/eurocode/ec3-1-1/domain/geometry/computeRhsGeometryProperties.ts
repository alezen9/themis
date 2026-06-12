import { hollowSectionsMap } from "../../data/hollowSections";
import type { Ec311FormValues } from "../../Form/schema/schema";

type Geometry = Ec311FormValues["rhs_geometry"];

export const computeRhsGeometryProperties = (
  section_id: string,
  geometry: Geometry,
) => {
  const existing = getExistingGeometryProperties(section_id);
  const h_mm = geometry.h_mm;
  const b_mm = geometry.b_mm;
  const tw_mm = geometry.tw_mm;
  const ro_mm = geometry.ro_mm;
  const ri_mm = geometry.ri_mm;

  const ho_mm = h_mm - 2 * ro_mm;
  const bo_mm = b_mm - 2 * ro_mm;
  const hi_mm = h_mm - 2 * tw_mm;
  const bi_mm = b_mm - 2 * tw_mm;

  const outerArea_mm2 =
    2 * ro_mm * (ho_mm + bo_mm) + Math.PI * ro_mm ** 2 + ho_mm * bo_mm;
  const innerArea_mm2 =
    2 * ri_mm * (hi_mm - 2 * ri_mm + bi_mm - 2 * ri_mm) +
    Math.PI * ri_mm ** 2 +
    (hi_mm - 2 * ri_mm) * (bi_mm - 2 * ri_mm);
  const A_mm2 = existing?.A_mm2 ?? outerArea_mm2 - innerArea_mm2;
  const iy_outer_corner_mm4 =
    ((4 - Math.PI) / 4) * ro_mm ** 2 * (h_mm / 2 - ro_mm) ** 2 +
    (ro_mm ** 3 / 3) * (h_mm / 2 - ro_mm) +
    ((16 - 3 * Math.PI) / 48) * ro_mm ** 4;
  const iy_inner_corner_mm4 =
    ((4 - Math.PI) / 4) * ri_mm ** 2 * (h_mm / 2 - tw_mm - ri_mm) ** 2 +
    (ri_mm ** 3 / 3) * (h_mm / 2 - tw_mm - ri_mm) +
    ((16 - 3 * Math.PI) / 48) * ri_mm ** 4;
  const Iy_mm4 =
    existing?.Iy_mm4 ??
    (b_mm * h_mm ** 3 - bi_mm * hi_mm ** 3) / 12 -
      4 * iy_outer_corner_mm4 +
      4 * iy_inner_corner_mm4;

  const iz_outer_corner_mm4 =
    ((4 - Math.PI) / 4) * ro_mm ** 2 * (b_mm / 2 - ro_mm) ** 2 +
    (ro_mm ** 3 / 3) * (b_mm / 2 - ro_mm) +
    ((16 - 3 * Math.PI) / 48) * ro_mm ** 4;
  const iz_inner_corner_mm4 =
    ((4 - Math.PI) / 4) * ri_mm ** 2 * (b_mm / 2 - tw_mm - ri_mm) ** 2 +
    (ri_mm ** 3 / 3) * (b_mm / 2 - tw_mm - ri_mm) +
    ((16 - 3 * Math.PI) / 48) * ri_mm ** 4;
  const Iz_mm4 =
    existing?.Iz_mm4 ??
    (h_mm * b_mm ** 3 - hi_mm * bi_mm ** 3) / 12 -
      4 * iz_outer_corner_mm4 +
      4 * iz_inner_corner_mm4;

  const Wel_y_mm3 = existing?.Wel_y_mm3 ?? Iy_mm4 / (h_mm / 2);
  const Wel_z_mm3 = existing?.Wel_z_mm3 ?? Iz_mm4 / (b_mm / 2);

  const wpl_y_outer_corner_mm3 =
    ((4 - Math.PI) / 4) * ro_mm ** 2 * (h_mm / 2 - ro_mm) + ro_mm ** 3 / 6;
  const wpl_y_inner_corner_mm3 =
    ((4 - Math.PI) / 4) * ri_mm ** 2 * (h_mm / 2 - tw_mm - ri_mm) + ri_mm ** 3 / 6;
  const Wpl_y_mm3 =
    existing?.Wpl_y_mm3 ??
    (b_mm * h_mm ** 2 - bi_mm * hi_mm ** 2) / 4 -
      4 * wpl_y_outer_corner_mm3 +
      4 * wpl_y_inner_corner_mm3;

  const wpl_z_outer_corner_mm3 =
    ((4 - Math.PI) / 4) * ro_mm ** 2 * (b_mm / 2 - ro_mm) + ro_mm ** 3 / 6;
  const wpl_z_inner_corner_mm3 =
    ((4 - Math.PI) / 4) * ri_mm ** 2 * (b_mm / 2 - tw_mm - ri_mm) + ri_mm ** 3 / 6;
  const Wpl_z_mm3 =
    existing?.Wpl_z_mm3 ??
    (h_mm * b_mm ** 2 - hi_mm * bi_mm ** 2) / 4 -
      4 * wpl_z_outer_corner_mm3 +
      4 * wpl_z_inner_corner_mm3;

  const Av_y_mm2 = (A_mm2 * b_mm) / (b_mm + h_mm);
  const Av_z_mm2 = (A_mm2 * h_mm) / (b_mm + h_mm);
  const S_y_mm3 = Wpl_y_mm3 / 2;
  const S_z_mm3 = Wpl_z_mm3 / 2;

  const rc_mm = (ro_mm + ri_mm) / 2;
  const mean_perimeter_mm =
    2 * (b_mm - tw_mm + (h_mm - tw_mm)) - 2 * rc_mm * (4 - Math.PI);
  const enclosed_area_mm2 =
    (b_mm - tw_mm) * (h_mm - tw_mm) - rc_mm ** 2 * (4 - Math.PI);
  const It_mm4 =
    existing?.It_mm4 ??
    (tw_mm ** 3 * mean_perimeter_mm) / 3 +
      (4 * enclosed_area_mm2 ** 2 * tw_mm) / mean_perimeter_mm;
  const Wt_mm3 =
    existing?.Wt_mm3 ??
    It_mm4 / (tw_mm + (2 * enclosed_area_mm2) / mean_perimeter_mm);
  const centroid = { y_mm: b_mm / 2, z_mm: h_mm / 2 };

  return {
    A_mm2,
    Iy_mm4,
    Iz_mm4,
    Wel_y_mm3,
    Wel_z_mm3,
    Wpl_y_mm3,
    Wpl_z_mm3,
    Av_y_mm2,
    Av_z_mm2,
    S_y_mm3,
    S_z_mm3,
    It_mm4,
    Wt_mm3,
    Iw_mm6: 0,
    centroid,
  };
};

const getExistingGeometryProperties = (section_id: string) => {
  const section = hollowSectionsMap.get(section_id);
  if (!section) return;
  const {
    A_mm2,
    Iy_mm4,
    Iz_mm4,
    Wel_y_mm3,
    Wel_z_mm3,
    Wpl_y_mm3,
    Wpl_z_mm3,
    It_mm4,
    Wt_mm3,
  } = section;
  return {
    A_mm2,
    Iy_mm4,
    Iz_mm4,
    Wel_y_mm3,
    Wel_z_mm3,
    Wpl_y_mm3,
    Wpl_z_mm3,
    It_mm4,
    Wt_mm3,
  };
};
