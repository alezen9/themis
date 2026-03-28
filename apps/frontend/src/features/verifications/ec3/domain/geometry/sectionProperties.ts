import type { BucklingCurve } from "../buckling/buckling";
import type { SectionInput } from "../inputs";
import { computeChsSectionProperties } from "./sectionPropertiesChs";
import { computeISectionProperties } from "./sectionPropertiesI";
import { computeRhsSectionProperties } from "./sectionPropertiesRhs";

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
