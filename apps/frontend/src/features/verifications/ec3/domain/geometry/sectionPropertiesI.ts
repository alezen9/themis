import { getBucklingCurves, getImperfectionFactor } from "../buckling/buckling";
import type { ISectionInput } from "../inputs";
import type { SectionProperties } from "./sectionProperties";

export const computeISectionProperties = (
  section: ISectionInput,
): SectionProperties => {
  const h = section.h;
  const b = section.b;
  const tw = section.tw; // web thickness
  const tf = section.tf; // flange thickness
  const r = section.r;

  const A = section.A ?? 2 * b * tf + (h - 2 * tf) * tw + 0.8584 * r ** 2;
  const Iy =
    section.Iy ??
    (b * h ** 3 - (b - tw) * (h - 2 * tf) ** 3) / 12 +
      0.8584 * r ** 2 * (h / 2 - tf) ** 2;
  const Iz =
    section.Iz ??
    (2 * tf * b ** 3 + (h - 2 * tf) * tw ** 3) / 12 +
      0.4292 * r ** 4 +
      0.8584 * r ** 2 * (tw / 2 + (4 * r) / (3 * Math.PI)) ** 2;
  const Wel_y = Iy / (h / 2);
  const Wel_z = Iz / (b / 2);
  const Wpl_y =
    section.Wpl_y ?? b * tf * (h - tf) + (tw * (h - 2 * tf) ** 2) / 4;
  const Wpl_z =
    section.Wpl_z ?? tf * b ** 2 * 0.5 + ((h - 2 * tf) * tw ** 2) / 4;
  const Av_y = A - 2 * b * tf + (tw + 2 * r) * tf;
  const Av_z = A - (h - tw) * tw;
  const It =
    section.It ??
    (2 * b * tf ** 3 + (h - 2 * tf) * tw ** 3) / 3 +
      2 *
        ((2 * tf + tw) / (4 * tf + tw)) *
        (0.145 + 0.1 * (r / tf)) *
        ((r + tw / 2) ** 4 - tw ** 4 / 16);
  const Iw = section.Iw ?? ((tf * b ** 3) / 24) * (h - tf) ** 2;
  const hw = h - 2 * tf;

  const curves = getBucklingCurves({
    shape: "I",
    fabricationType: section.fabricationType,
    hOverB: h / b,
    tf,
  });

  return {
    A,
    Iy,
    Iz,
    Wel_y,
    Wel_z,
    Wpl_y,
    Wpl_z,
    Av_y,
    Av_z,
    It,
    Iw,
    tw,
    hw,
    section_shape: "I",
    h,
    b,
    tf,
    t: 0, // wall thickness is not applicable to I-sections
    d: 0, // outer diameter is not applicable to I-sections
    bucklingY: curves.y,
    bucklingZ: curves.z,
    bucklingLT: curves.lt,
    alpha_y: getImperfectionFactor(curves.y),
    alpha_z: getImperfectionFactor(curves.z),
    alpha_LT: getImperfectionFactor(curves.lt),
  };
};
