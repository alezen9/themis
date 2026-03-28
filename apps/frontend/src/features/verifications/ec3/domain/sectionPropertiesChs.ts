import { getBucklingCurves, getImperfectionFactor } from "./buckling";
import type { ChsSectionInput, SectionProperties } from "./sectionProperties";

export const computeChsSectionProperties = (
  section: ChsSectionInput,
): SectionProperties => {
  const { d, t, fabricationType } = section;
  const di = d - 2 * t;

  const calculatedA = (Math.PI / 4) * (d ** 2 - di ** 2);
  const calculatedI = (Math.PI / 64) * (d ** 4 - di ** 4);
  const calculatedWpl = (d ** 3 - di ** 3) / 6;
  const calculatedIt = 2 * calculatedI;

  const A = section.A ?? calculatedA;
  const Iy = section.Iy ?? calculatedI;
  const Iz = Iy;
  const WplY = section.Wpl_y ?? calculatedWpl;
  const WplZ = WplY;
  const It = section.It ?? calculatedIt;

  const Wel = Iy / (d / 2);
  const Av = (2 * A) / Math.PI;
  const curves = getBucklingCurves({ shape: "CHS", fabricationType });

  return {
    A,
    Iy,
    Iz,
    Wel_y: Wel,
    Wel_z: Wel,
    Wpl_y: WplY,
    Wpl_z: WplZ,
    Av_y: Av,
    Av_z: Av,
    It,
    Iw: 0,
    tw: 0, // web thickness (not applicable to CHS)
    hw: 0, // web height (not applicable to CHS)
    section_shape: "CHS",
    h: 0, // section depth (not applicable to CHS)
    b: 0, // section width (not applicable to CHS)
    tf: 0, // flange thickness (not applicable to CHS)
    t, // wall thickness
    d, // outer diameter
    bucklingY: curves.y,
    bucklingZ: curves.z,
    bucklingLT: curves.lt,
    alpha_y: getImperfectionFactor(curves.y),
    alpha_z: getImperfectionFactor(curves.z),
    alpha_LT: getImperfectionFactor(curves.lt),
  };
};
