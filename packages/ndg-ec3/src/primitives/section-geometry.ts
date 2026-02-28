import { getBucklingCurves } from "../tables/ec3-table-6.2";
import { getImperfectionFactor } from "../tables/ec3-table-6.1";

export type SectionShape = "I" | "RHS" | "CHS";

export type DerivedSectionProperties = {
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
  tw: number;
  hw: number;
  section_shape: SectionShape;
  bucklingY: string;
  bucklingZ: string;
  bucklingLT: string;
  alpha_y: number;
  alpha_z: number;
  alpha_LT: number;
};

export type ISectionInput = {
  h: number;
  b: number;
  tw: number;
  tf: number;
  r: number;
  rolled: boolean;
};

export type RhsSectionInput = {
  h: number;
  b: number;
  tw: number;
};

export type ChsSectionInput = {
  d: number;
  t: number;
};

export const computeISectionProperties = ({
  h,
  b,
  tw,
  tf,
  r,
  rolled,
}: ISectionInput): DerivedSectionProperties => {
  const hw = h - 2 * tf;

  const A = 2 * b * tf + hw * tw + (4 - Math.PI) * r ** 2;
  const Iy = (b * h ** 3 - (b - tw) * hw ** 3) / 12;
  const Iz = (2 * tf * b ** 3 + hw * tw ** 3) / 12;
  const Wpl_y = b * tf * (h - tf) + (tw * hw ** 2) / 4;
  const Wpl_z = (tf * b ** 2) / 2 + (hw * tw ** 2) / 4;
  const Wel_y = Iy / (h / 2);
  const Wel_z = Iz / (b / 2);

  // EC3 §6.2.6 convention for I-sections.
  const Av_z = A - 2 * b * tf + (tw + 2 * r) * tf;
  const Av_y = 2 * b * tf;

  const It = (2 * b * tf ** 3 + hw * tw ** 3) / 3;
  const Iw = (Iz * hw ** 2) / 4;

  const hOverB = h / b;
  const curves = getBucklingCurves("I", rolled ? "rolled" : "welded", hOverB, tf);
  const bucklingLT = hOverB > 2 ? "a" : "b";

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
    bucklingY: curves.y,
    bucklingZ: curves.z,
    bucklingLT,
    alpha_y: getImperfectionFactor(curves.y),
    alpha_z: getImperfectionFactor(curves.z),
    alpha_LT: getImperfectionFactor(bucklingLT),
  };
};

export const computeRhsSectionProperties = ({
  h,
  b,
  tw,
}: RhsSectionInput): DerivedSectionProperties => {
  const hi = h - 2 * tw;
  const bi = b - 2 * tw;

  const A = 2 * tw * (h + b - 2 * tw);
  const Iy = (b * h ** 3 - bi * hi ** 3) / 12;
  const Iz = (h * b ** 3 - hi * bi ** 3) / 12;
  const Wel_y = Iy / (h / 2);
  const Wel_z = Iz / (b / 2);
  const Wpl_y = (b * h ** 2) / 4 - (bi * hi ** 2) / 4;
  const Wpl_z = (h * b ** 2) / 4 - (hi * bi ** 2) / 4;

  const Av_z = A * h / (b + h);
  const Av_y = A * b / (b + h);

  const Am = (h - tw) * (b - tw);
  const p = 2 * ((h - tw) + (b - tw));
  const It = (4 * Am ** 2 * tw) / p;

  const curves = getBucklingCurves("RHS", "rolled", h / b, tw);
  const bucklingLT = "a";

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
    Iw: 0,
    tw,
    hw: h - 2 * tw,
    section_shape: "RHS",
    bucklingY: curves.y,
    bucklingZ: curves.z,
    bucklingLT,
    alpha_y: getImperfectionFactor(curves.y),
    alpha_z: getImperfectionFactor(curves.z),
    alpha_LT: getImperfectionFactor(bucklingLT),
  };
};

export const computeChsSectionProperties = ({
  d,
  t,
}: ChsSectionInput): DerivedSectionProperties => {
  const di = d - 2 * t;

  const A = (Math.PI / 4) * (d ** 2 - di ** 2);
  const I = (Math.PI / 64) * (d ** 4 - di ** 4);
  const Wel = I / (d / 2);
  const Wpl = (d ** 3 - di ** 3) / 6;
  const Av = (2 * A) / Math.PI;

  const curves = getBucklingCurves("CHS", "rolled", 1, t);

  return {
    A,
    Iy: I,
    Iz: I,
    Wel_y: Wel,
    Wel_z: Wel,
    Wpl_y: Wpl,
    Wpl_z: Wpl,
    Av_y: Av,
    Av_z: Av,
    It: 2 * I,
    Iw: 0,
    tw: t,
    hw: d - 2 * t,
    section_shape: "CHS",
    bucklingY: curves.y,
    bucklingZ: curves.z,
    bucklingLT: "a",
    alpha_y: getImperfectionFactor(curves.y),
    alpha_z: getImperfectionFactor(curves.z),
    alpha_LT: getImperfectionFactor("a"),
  };
};
