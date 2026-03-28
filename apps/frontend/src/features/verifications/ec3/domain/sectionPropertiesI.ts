import { getBucklingCurves, getImperfectionFactor } from "./buckling";
import type { ISectionInput, SectionProperties } from "./sectionProperties";

export const computeISectionProperties = (
  section: ISectionInput,
): SectionProperties => {
  const { h, b, tw, tf, r, fabricationType } = section;
  const hw = h - 2 * tf;
  const hOverB = h / b;

  const calculatedA = 2 * b * tf + hw * tw + (4 - Math.PI) * r * r;
  const calculatedIy = (b * h ** 3 - (b - tw) * hw ** 3) / 12;
  const calculatedIz = (2 * tf * b ** 3 + hw * tw ** 3) / 12;
  const calculatedWplY = b * tf * (h - tf) + (tw * hw ** 2) / 4;
  const calculatedWplZ = (tf * b ** 2) / 2 + (hw * tw ** 2) / 4;
  const calculatedIt = (2 * b * tf ** 3 + hw * tw ** 3) / 3;

  const A = section.A ?? calculatedA;
  const Iy = section.Iy ?? calculatedIy;
  const Iz = section.Iz ?? calculatedIz;
  const WplY = section.Wpl_y ?? calculatedWplY;
  const WplZ = section.Wpl_z ?? calculatedWplZ;
  const It = section.It ?? calculatedIt;
  const Iw = section.Iw ?? (Iz * hw ** 2) / 4;

  const WelY = Iy / (h / 2);
  const WelZ = Iz / (b / 2);
  const AvY = 2 * b * tf;
  const AvZ = A - 2 * b * tf + (tw + 2 * r) * tf;
  const curves = getBucklingCurves({ shape: "I", fabricationType, hOverB, tf });

  return {
    A,
    Iy,
    Iz,
    Wel_y: WelY,
    Wel_z: WelZ,
    Wpl_y: WplY,
    Wpl_z: WplZ,
    Av_y: AvY,
    Av_z: AvZ,
    It,
    Iw,
    tw, // web thickness
    hw, // clear web height between flanges
    section_shape: "I",
    h, // overall section depth
    b, // flange width / section width
    tf, // flange thickness
    t: 0, // wall thickness (not applicable to I-sections)
    d: 0, // outer diameter (not applicable to I-sections)
    bucklingY: curves.y,
    bucklingZ: curves.z,
    bucklingLT: curves.lt,
    alpha_y: getImperfectionFactor(curves.y),
    alpha_z: getImperfectionFactor(curves.z),
    alpha_LT: getImperfectionFactor(curves.lt),
  };
};
