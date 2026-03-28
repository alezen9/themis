import { getBucklingCurves, getImperfectionFactor } from "./buckling";
import type { RhsSectionInput, SectionProperties } from "./sectionProperties";

export const computeRhsSectionProperties = (
  section: RhsSectionInput,
): SectionProperties => {
  const { h, b, tw, ro, ri, fabricationType } = section;
  const hi = h - 2 * tw;
  const bi = b - 2 * tw;

  const cappedOuterRadius = Math.max(0, Math.min(ro, b / 2, h / 2));
  const cappedInnerRadius = Math.max(0, Math.min(ri, bi / 2, hi / 2));

  const calculatedA =
    b * h -
    (4 - Math.PI) * cappedOuterRadius ** 2 -
    (bi * hi - (4 - Math.PI) * cappedInnerRadius ** 2);
  const calculatedIy = (b * h ** 3 - bi * hi ** 3) / 12;
  const calculatedIz = (h * b ** 3 - hi * bi ** 3) / 12;
  const calculatedWplY = (b * h ** 2) / 4 - (bi * hi ** 2) / 4;
  const calculatedWplZ = (h * b ** 2) / 4 - (hi * bi ** 2) / 4;

  const middleRadius = (cappedOuterRadius + cappedInnerRadius) / 2;
  const middleHeight = h - 2 * middleRadius;
  const middleWidth = b - 2 * middleRadius;
  const middleArea =
    middleWidth * middleHeight - (4 - Math.PI) * middleRadius ** 2;
  const middlePerimeter =
    2 * (middleHeight + middleWidth) + (2 * Math.PI - 8) * middleRadius;
  const calculatedIt =
    middlePerimeter > 0 ? (4 * middleArea ** 2 * tw) / middlePerimeter : 0;

  const A = section.A ?? calculatedA;
  const Iy = section.Iy ?? calculatedIy;
  const Iz = section.Iz ?? calculatedIz;
  const WplY = section.Wpl_y ?? calculatedWplY;
  const WplZ = section.Wpl_z ?? calculatedWplZ;
  const It = section.It ?? calculatedIt;

  const WelY = Iy / (h / 2);
  const WelZ = Iz / (b / 2);
  const AvY = (A * b) / (b + h);
  const AvZ = (A * h) / (b + h);
  const curves = getBucklingCurves({ shape: "RHS", fabricationType });

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
    Iw: 0,
    tw, // wall thickness used in the flat web portions
    hw: h - 2 * tw, // flat web height between corner radii
    section_shape: "RHS",
    h, // overall section depth
    b, // overall section width
    tf: 0, // flange thickness (not applicable to RHS)
    t: 0, // circular wall thickness field (not applicable to RHS)
    d: 0, // outer diameter (not applicable to RHS)
    bucklingY: curves.y,
    bucklingZ: curves.z,
    bucklingLT: curves.lt,
    alpha_y: getImperfectionFactor(curves.y),
    alpha_z: getImperfectionFactor(curves.z),
    alpha_LT: getImperfectionFactor(curves.lt),
  };
};
