import { circularSectionsMap } from "../../data/circularSections";
import type { Ec311FormValues } from "../../Form/schema/schema";

type Geometry = Ec311FormValues["chs_geometry"];

export const computeChsGeometryProperties = (
  section_id: string,
  geometry: Geometry,
) => {
  const existing = getExistingGeometryProperties(section_id);
  const d_mm = geometry.d_mm;
  const t_mm = geometry.t_mm;
  const di_mm = d_mm - 2 * t_mm;

  const A_mm2 = existing?.A_mm2 ?? (Math.PI / 4) * (d_mm ** 2 - di_mm ** 2);
  const Iy_mm4 = existing?.Iy_mm4 ?? (Math.PI / 64) * (d_mm ** 4 - di_mm ** 4);
  const Iz_mm4 = existing?.Iz_mm4 ?? Iy_mm4;
  const Wel_y_mm3 = existing?.Wel_y_mm3 ?? Iy_mm4 / (d_mm / 2);
  const Wel_z_mm3 = existing?.Wel_z_mm3 ?? Wel_y_mm3;
  const Wpl_y_mm3 = existing?.Wpl_y_mm3 ?? (d_mm ** 3 - di_mm ** 3) / 6;
  const Wpl_z_mm3 = existing?.Wpl_z_mm3 ?? Wpl_y_mm3;
  const Av_y_mm2 = (2 * A_mm2) / Math.PI;
  const Av_z_mm2 = Av_y_mm2;
  const S_y_mm3 = Wpl_y_mm3 / 2;
  const S_z_mm3 = S_y_mm3;
  const It_mm4 = existing?.It_mm4 ?? 2 * Iy_mm4;
  const Wt_mm3 = existing?.Wt_mm3 ?? It_mm4 / (d_mm / 2);
  const centroid = { y_mm: d_mm / 2, z_mm: d_mm / 2 };

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
  const section = circularSectionsMap.get(section_id);
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
