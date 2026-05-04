import { flangedSectionsMap } from "../../data/flangedSections";
import type { Ec3FormValues } from "../../Form/schema";

type Geometry = Ec3FormValues["i_geometry"];

export const computeISectionProperties = (
  section_id: string,
  geometry: Geometry,
) => {
  const existing = getExistingSectionProperties(section_id);
  const h = geometry.h;
  const b = geometry.b;
  const tw = geometry.tw; // web thickness
  const tf = geometry.tf; // flange thickness
  const r = geometry.r;

  const A = existing?.A ?? 2 * b * tf + (h - 2 * tf) * tw + 0.8584 * r ** 2;
  const Iy =
    existing?.Iy ??
    (b * h ** 3 - (b - tw) * (h - 2 * tf) ** 3) / 12 +
      0.8584 * r ** 2 * (h / 2 - tf) ** 2;
  const Iz =
    existing?.Iz ??
    (2 * tf * b ** 3 + (h - 2 * tf) * tw ** 3) / 12 +
      0.4292 * r ** 4 +
      0.8584 * r ** 2 * (tw / 2 + (4 * r) / (3 * Math.PI)) ** 2;
  const Wel_y = Iy / (h / 2);
  const Wel_z = Iz / (b / 2);
  const Wpl_y =
    existing?.Wpl_y ?? b * tf * (h - tf) + (tw * (h - 2 * tf) ** 2) / 4;
  const Wpl_z =
    existing?.Wpl_z ?? tf * b ** 2 * 0.5 + ((h - 2 * tf) * tw ** 2) / 4;
  const Av_y = A - 2 * b * tf + (tw + 2 * r) * tf;
  const Av_z = A - (h - tw) * tw;
  const It =
    existing?.It ??
    (2 * b * tf ** 3 + (h - 2 * tf) * tw ** 3) / 3 +
      2 *
        ((2 * tf + tw) / (4 * tf + tw)) *
        (0.145 + 0.1 * (r / tf)) *
        ((r + tw / 2) ** 4 - tw ** 4 / 16);
  const Iw = existing?.Iw ?? ((tf * b ** 3) / 24) * (h - tf) ** 2;

  return { A, Iy, Iz, Wel_y, Wel_z, Wpl_y, Wpl_z, Av_y, Av_z, It, Iw };
};

const getExistingSectionProperties = (section_id: string) => {
  const section = flangedSectionsMap.get(section_id);
  if (!section) return;
  const { A, Iy, Iz, Wpl_y, Wpl_z, It, Iw } = section;
  return { A, Iy, Iz, Wpl_y, Wpl_z, It, Iw };
};
