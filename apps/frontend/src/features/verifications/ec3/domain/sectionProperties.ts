import {
  type BucklingCurve,
  getBucklingCurves,
  getImperfectionFactor,
} from "./buckling";

export type FabricationType = "rolled" | "welded";

export type ISectionInput = {
  shape: "I";
  fabricationType: FabricationType;
  h: number;
  b: number;
  tw: number;
  tf: number;
  r: number;
  A?: number;
  Iy?: number;
  Iz?: number;
  Wpl_y?: number;
  Wpl_z?: number;
  It?: number;
  Iw?: number;
};

export type RhsSectionInput = {
  shape: "RHS";
  fabricationType: FabricationType;
  h: number;
  b: number;
  tw: number;
  ro: number;
  ri: number;
  A?: number;
  Iy?: number;
  Iz?: number;
  Wpl_y?: number;
  Wpl_z?: number;
  It?: number;
};

export type ChsSectionInput = {
  shape: "CHS";
  fabricationType: FabricationType;
  d: number;
  t: number;
  A?: number;
  Iy?: number;
  Wpl_y?: number;
  It?: number;
};

export type SectionInput = ISectionInput | RhsSectionInput | ChsSectionInput;

export type SectionProperties = {
  A: number;
  Iy: number;
  Iz: number;
  Wel_y: number;
  Wel_z: number;
  Wpl_y: number;
  Wpl_z: number;
  Av_y: number;
  Av_z: number;
  It: number;
  Iw: number;
  tw: number; // web thickness
  hw: number; // web height
  section_shape: SectionInput["shape"];
  h: number; // section height
  b: number; // section width
  tf: number; // flange thickness
  t: number; // wall thickness
  d: number; // outer diameter
  bucklingY: BucklingCurve;
  bucklingZ: BucklingCurve;
  bucklingLT: BucklingCurve;
  alpha_y: number;
  alpha_z: number;
  alpha_LT: number;
};

const computeISectionProperties = (
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
  const bucklingLT: BucklingCurve = hOverB > 2 ? "a" : "b";
  const curves = getBucklingCurves("I", fabricationType, hOverB, tf);

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
    bucklingLT,
    alpha_y: getImperfectionFactor(curves.y),
    alpha_z: getImperfectionFactor(curves.z),
    alpha_LT: getImperfectionFactor(bucklingLT),
  };
};

const computeRhsSectionProperties = (
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
  const bucklingLT: BucklingCurve = "a";
  const curves = getBucklingCurves("RHS", fabricationType, h / b, tw);

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
    bucklingLT,
    alpha_y: getImperfectionFactor(curves.y),
    alpha_z: getImperfectionFactor(curves.z),
    alpha_LT: getImperfectionFactor(bucklingLT),
  };
};

const computeChsSectionProperties = (
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
  const bucklingLT: BucklingCurve = "a";
  const curves = getBucklingCurves("CHS", fabricationType, 1, t);

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
    bucklingLT,
    alpha_y: getImperfectionFactor(curves.y),
    alpha_z: getImperfectionFactor(curves.z),
    alpha_LT: getImperfectionFactor(bucklingLT),
  };
};

export const computeSectionProperties = (
  section: SectionInput,
): SectionProperties => {
  switch (section.shape) {
    case "I":
      return computeISectionProperties(section);
    case "RHS":
      return computeRhsSectionProperties(section);
    case "CHS":
      return computeChsSectionProperties(section);
  }
};
