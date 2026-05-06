import { hollowSectionsMap } from "../../data/hollowSections";
import type { Ec3FormValues } from "../../Form/schema";

type Geometry = Ec3FormValues["rhs_geometry"];

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
  const Iy_mm4 =
    existing?.Iy_mm4 ?? (b_mm * h_mm ** 3 - bi_mm * hi_mm ** 3) / 12;
  const Iz_mm4 =
    existing?.Iz_mm4 ?? (h_mm * b_mm ** 3 - hi_mm * bi_mm ** 3) / 12;
  const Wel_y_mm3 = Iy_mm4 / (h_mm / 2);
  const Wel_z_mm3 = Iz_mm4 / (b_mm / 2);
  const Wpl_y_mm3 =
    existing?.Wpl_y_mm3 ?? (b_mm * h_mm ** 2 - bi_mm * hi_mm ** 2) / 4;
  const Wpl_z_mm3 =
    existing?.Wpl_z_mm3 ?? (h_mm * b_mm ** 2 - hi_mm * bi_mm ** 2) / 4;
  const Av_y_mm2 = (A_mm2 * b_mm) / (b_mm + h_mm);
  const Av_z_mm2 = (A_mm2 * h_mm) / (b_mm + h_mm);
  const p_mm = 2 * (h_mm - tw_mm + (b_mm - tw_mm)) - 2 * ro_mm * (4 - Math.PI);
  const Ap_mm = A_mm2 / p_mm;
  const It_mm4 =
    existing?.It_mm4 ?? (4 * Ap_mm ** 2 * (p_mm - 2.8 * Ap_mm)) / 3;

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
    It_mm4,
    Iw_mm6: 0,
  };
};

const getExistingGeometryProperties = (section_id: string) => {
  const section = hollowSectionsMap.get(section_id);
  if (!section) return;
  const { A_mm2, Iy_mm4, Iz_mm4, Wpl_y_mm3, Wpl_z_mm3, It_mm4 } = section;
  return { A_mm2, Iy_mm4, Iz_mm4, Wpl_y_mm3, Wpl_z_mm3, It_mm4 };
};
