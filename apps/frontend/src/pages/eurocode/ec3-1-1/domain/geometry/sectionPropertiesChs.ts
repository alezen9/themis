import { circularSectionsMap } from "../../data/circularSections";
import type { Ec3FormValues } from "../../Form/schema";

type Geometry = Ec3FormValues["chs_geometry"];

export const computeChsSectionProperties = (
  section_id: string,
  geometry: Geometry,
) => {
  const existing = getExistingSectionProperties(section_id);
  const d = geometry.d; // outer diameter
  const t = geometry.t; // wall thickness
  const di = d - 2 * t;

  const A = existing?.A ?? (Math.PI / 4) * (d ** 2 - di ** 2);
  const Iy = existing?.Iy ?? (Math.PI / 64) * (d ** 4 - di ** 4);
  const Iz = Iy;
  const Wel_y = Iy / (d / 2);
  const Wel_z = Wel_y;
  const Wpl_y = existing?.Wpl_y ?? (d ** 3 - di ** 3) / 6;
  const Wpl_z = Wpl_y;
  const Av_y = (2 * A) / Math.PI;
  const Av_z = Av_y;
  const It = existing?.It ?? 2 * Iy;

  return { A, Iy, Iz, Wel_y, Wel_z, Wpl_y, Wpl_z, Av_y, Av_z, It, Iw: 0 };
};

const getExistingSectionProperties = (section_id: string) => {
  const section = circularSectionsMap.get(section_id);
  if (!section) return;
  const { A, Iy, Wpl_y, It } = section;
  return { A, Iy, Wpl_y, It };
};
