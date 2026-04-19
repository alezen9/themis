import { eurocodeAnnex, italianAnnex } from "@ndg/ndg-ec3";
import { FABRICATION_TYPE_OPTIONS, SHAPE_OPTIONS } from "../../../features/verifications/ec3/options";
import {
  circularSections,
  type CircularSection,
} from "../../../features/verifications/ec3/data/circularSections";
import {
  flangedSections,
  type FlangedSection,
} from "../../../features/verifications/ec3/data/flangedSections";
import {
  hollowSections,
  type HollowSection,
} from "../../../features/verifications/ec3/data/hollowSections";
import { steelGrades } from "../../../features/verifications/ec3/data/steelGrades";

export type FabricationType = (typeof FABRICATION_TYPE_OPTIONS)[number];
export type ShapeKey = (typeof SHAPE_OPTIONS)[number];
export type CatalogSection = FlangedSection | HollowSection | CircularSection;

export type AnnexOption = {
  id: string;
  name: string;
  coefficients: Record<string, number>;
};

export const ANNEXES: readonly AnnexOption[] = [italianAnnex, eurocodeAnnex];

export const CUSTOM_SECTION_ID = "custom";

export const getSectionsByShape = (
  shape: ShapeKey,
): readonly CatalogSection[] => {
  if (shape === "I") return flangedSections;
  if (shape === "CHS") return circularSections;
  return hollowSections;
};

export const DEFAULT_SHAPE: ShapeKey = "I";
export const DEFAULT_I_SECTION = flangedSections.find(
  (section) => section.id === "IPE300",
)!;
export const DEFAULT_RHS_SECTION = hollowSections[0]!;
export const DEFAULT_CHS_SECTION = circularSections[0]!;
export const DEFAULT_SECTION = DEFAULT_I_SECTION;
export const DEFAULT_GRADE = steelGrades.find(
  (grade) => grade.id === "S235" && grade.norm === "EN10025-2",
)!;
export const DEFAULT_ANNEX: AnnexOption = italianAnnex;

export type CustomISectionGeometry = {
  h: number;
  b: number;
  tw: number;
  tf: number;
  r: number;
};

export type CustomRhsSectionGeometry = {
  h: number;
  b: number;
  t: number;
  ro: number;
  ri: number;
};

export type CustomChsSectionGeometry = { d: number; t: number };

export const INITIAL_CUSTOM_I_GEOMETRY: CustomISectionGeometry = {
  h: DEFAULT_I_SECTION.h,
  b: DEFAULT_I_SECTION.b,
  tw: DEFAULT_I_SECTION.tw,
  tf: DEFAULT_I_SECTION.tf,
  r: DEFAULT_I_SECTION.r,
};

export const INITIAL_CUSTOM_RHS_GEOMETRY: CustomRhsSectionGeometry = {
  h: DEFAULT_RHS_SECTION.h,
  b: DEFAULT_RHS_SECTION.b,
  t: DEFAULT_RHS_SECTION.tw,
  ro: DEFAULT_RHS_SECTION.ro,
  ri: DEFAULT_RHS_SECTION.ri,
};

export const INITIAL_CUSTOM_CHS_GEOMETRY: CustomChsSectionGeometry = {
  d: DEFAULT_CHS_SECTION.d,
  t: DEFAULT_CHS_SECTION.t,
};
