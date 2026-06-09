import { flangedSectionsMap } from "../../data/flangedSections";
import type { Ec311FormValues } from "../../Form/schema/schema";

type Geometry = Ec311FormValues["i_geometry"];

export const computeIGeometryProperties = (
  section_id: string,
  geometry: Geometry,
  fabrication_type: string,
  eta: number,
) => {
  const existing = getExistingGeometryProperties(section_id);
  const h_mm = geometry.h_mm;
  const b_mm = geometry.b_mm;
  const tw_mm = geometry.tw_mm;
  const tf_mm = geometry.tf_mm;
  const r_mm = geometry.r_mm;

  const A_mm2 =
    existing?.A_mm2 ??
    2 * b_mm * tf_mm + (h_mm - 2 * tf_mm) * tw_mm + (4 - Math.PI) * r_mm ** 2;
  const fillet_area_mm2 = (1 - Math.PI / 4) * r_mm ** 2;
  const d_fillet_y_mm = h_mm / 2 - tf_mm - (1 - 4 / (3 * Math.PI)) * r_mm;
  const Iy_mm4 =
    existing?.Iy_mm4 ??
    (b_mm * h_mm ** 3 - (b_mm - tw_mm) * (h_mm - 2 * tf_mm) ** 3) / 12 +
      4 * fillet_area_mm2 * d_fillet_y_mm ** 2;
  const d_fillet_z_mm = tw_mm / 2 + (4 * r_mm) / (3 * Math.PI);
  const Iz_mm4 =
    existing?.Iz_mm4 ??
    (2 * tf_mm * b_mm ** 3 + (h_mm - 2 * tf_mm) * tw_mm ** 3) / 12 +
      4 * fillet_area_mm2 * d_fillet_z_mm ** 2;
  const Wel_y_mm3 = existing?.Wel_y_mm3 ?? Iy_mm4 / (h_mm / 2);
  const Wel_z_mm3 = existing?.Wel_z_mm3 ?? Iz_mm4 / (b_mm / 2);
  const Wpl_y_mm3 =
    existing?.Wpl_y_mm3 ??
    b_mm * tf_mm * (h_mm - tf_mm) +
      (tw_mm * (h_mm - 2 * tf_mm) ** 2) / 4 +
      4 * fillet_area_mm2 * d_fillet_y_mm;
  const Wpl_z_mm3 =
    existing?.Wpl_z_mm3 ??
    tf_mm * b_mm ** 2 * 0.5 +
      ((h_mm - 2 * tf_mm) * tw_mm ** 2) / 4 +
      4 * fillet_area_mm2 * d_fillet_z_mm;
  const hw_mm = h_mm;
  const weldedShearArea_mm2 = eta * hw_mm * tw_mm;
  const rolledShearArea_mm2 =
    A_mm2 - 2 * b_mm * tf_mm + (tw_mm + 2 * r_mm) * tf_mm;
  const Av_z_mm2 =
    fabrication_type === "welded"
      ? weldedShearArea_mm2
      : Math.max(rolledShearArea_mm2, weldedShearArea_mm2);
  const Av_y_mm2 = A_mm2 - hw_mm * tw_mm;
  const S_y_mm3 = Wpl_y_mm3 / 2;
  const S_z_mm3 = Wpl_z_mm3 / 2;
  const It_mm4 =
    existing?.It_mm4 ??
    (2 * b_mm * tf_mm ** 3 + (h_mm - 2 * tf_mm) * tw_mm ** 3) / 3 +
      2 *
        ((2 * tf_mm + tw_mm) / (4 * tf_mm + tw_mm)) *
        (0.145 + 0.1 * (r_mm / tf_mm)) *
        ((r_mm + tw_mm / 2) ** 4 - tw_mm ** 4 / 16);
  const Wt_mm3 = existing?.Wt_mm3 ?? It_mm4 / Math.max(tw_mm, tf_mm);
  const Iw_mm6 =
    existing?.Iw_mm6 ?? ((tf_mm * b_mm ** 3) / 24) * (h_mm - tf_mm) ** 2;
  const centroid = { y_mm: b_mm / 2, z_mm: h_mm / 2 };

  console.log({ Av_y_mm2, Av_z_mm2 });

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
    Iw_mm6,
    centroid,
  };
};

const getExistingGeometryProperties = (section_id: string) => {
  const section = flangedSectionsMap.get(section_id);
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
    Iw_mm6,
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
    Iw_mm6,
  };
};
