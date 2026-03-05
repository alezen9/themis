import {
  getBucklingCurves,
  getImperfectionFactor,
} from "./ec3-normative-tables";

export type FabricationType = "rolled" | "welded";

type ISectionInput = {
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

type RhsSectionInput = {
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

type ChsSectionInput = {
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

type SectionProperties = {
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
  section_shape: SectionInput["shape"];
  h: number;
  b: number;
  tf: number;
  t: number;
  d: number;
  bucklingY: string;
  bucklingZ: string;
  bucklingLT: string;
  alpha_y: number;
  alpha_z: number;
  alpha_LT: number;
};

export const computeSectionProperties = (
  section: SectionInput,
): SectionProperties => {
  switch (section.shape) {
    case "I": {
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
      const bucklingLT = hOverB > 2 ? "a" : "b";
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
        tw,
        hw,
        section_shape: "I",
        h,
        b,
        tf,
        t: tw,
        d: 0,
        bucklingY: curves.y,
        bucklingZ: curves.z,
        bucklingLT,
        alpha_y: getImperfectionFactor(curves.y),
        alpha_z: getImperfectionFactor(curves.z),
        alpha_LT: getImperfectionFactor(bucklingLT),
      };
    }

    case "RHS": {
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
        tw,
        hw: h - 2 * tw,
        section_shape: "RHS",
        h,
        b,
        tf: tw,
        t: tw,
        d: 0,
        bucklingY: curves.y,
        bucklingZ: curves.z,
        bucklingLT: "a",
        alpha_y: getImperfectionFactor(curves.y),
        alpha_z: getImperfectionFactor(curves.z),
        alpha_LT: getImperfectionFactor("a"),
      };
    }

    case "CHS": {
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
        tw: t,
        hw: d - 2 * t,
        section_shape: "CHS",
        h: d,
        b: d,
        tf: t,
        t,
        d,
        bucklingY: curves.y,
        bucklingZ: curves.z,
        bucklingLT: "a",
        alpha_y: getImperfectionFactor(curves.y),
        alpha_z: getImperfectionFactor(curves.z),
        alpha_LT: getImperfectionFactor("a"),
      };
    }
  }
};
