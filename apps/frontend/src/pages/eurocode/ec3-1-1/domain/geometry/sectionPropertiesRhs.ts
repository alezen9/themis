import { hollowSectionsMap } from "../../data/hollowSections";
import type { Ec3FormValues } from "../../Form/schema";

type Geometry = Ec3FormValues["rhs_geometry"];

export const computeRhsSectionProperties = (
  section_id: string,
  geometry: Geometry,
) => {
  const existing = getExistingSectionProperties(section_id);
  const h = geometry.h;
  const b = geometry.b;
  const tw = geometry.tw; // wall thickness
  const ro = geometry.ro;
  const ri = geometry.ri;

  const ho = h - 2 * ro;
  const bo = b - 2 * ro;
  const hi = h - 2 * tw;
  const bi = b - 2 * tw;

  const outerArea = 2 * ro * (ho + bo) + Math.PI * ro ** 2 + ho * bo;
  const innerArea =
    2 * ri * (hi - 2 * ri + bi - 2 * ri) +
    Math.PI * ri ** 2 +
    (hi - 2 * ri) * (bi - 2 * ri);
  const A = existing?.A ?? outerArea - innerArea;
  const Iy = existing?.Iy ?? (b * h ** 3 - bi * hi ** 3) / 12;
  const Iz = existing?.Iz ?? (h * b ** 3 - hi * bi ** 3) / 12;
  const Wel_y = Iy / (h / 2);
  const Wel_z = Iz / (b / 2);
  const Wpl_y = existing?.Wpl_y ?? (b * h ** 2 - bi * hi ** 2) / 4;
  const Wpl_z = existing?.Wpl_z ?? (h * b ** 2 - hi * bi ** 2) / 4;
  const Av_y = (A * b) / (b + h);
  const Av_z = (A * h) / (b + h);
  const p = 2 * (h - tw + (b - tw)) - 2 * ro * (4 - Math.PI);
  const Ap = A / p;
  const It = existing?.It ?? (4 * Ap ** 2 * (p - 2.8 * Ap)) / 3;

  return { A, Iy, Iz, Wel_y, Wel_z, Wpl_y, Wpl_z, Av_y, Av_z, It, Iw: 0 };
};

const getExistingSectionProperties = (section_id: string) => {
  const section = hollowSectionsMap.get(section_id);
  if (!section) return;
  const { A, Iy, Iz, Wpl_y, Wpl_z, It } = section;
  return { A, Iy, Iz, Wpl_y, Wpl_z, It };
};
