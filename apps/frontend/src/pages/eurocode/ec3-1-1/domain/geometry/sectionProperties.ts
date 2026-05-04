import type { Ec3FormValues } from "../../Form/schema";
import { computeChsSectionProperties } from "./sectionPropertiesChs";
import { computeISectionProperties } from "./sectionPropertiesI";
import { computeRhsSectionProperties } from "./sectionPropertiesRhs";

export type Inputs = Pick<
  Ec3FormValues,
  "shape" | "section_id" | "i_geometry" | "rhs_geometry" | "chs_geometry"
>;

export const computeSectionProperties = (inputs: Inputs) => {
  const { shape, section_id, i_geometry, rhs_geometry, chs_geometry } = inputs;
  switch (shape) {
    case "I":
      return computeISectionProperties(section_id, i_geometry);
    case "RHS":
      return computeRhsSectionProperties(section_id, rhs_geometry);
    case "CHS":
      return computeChsSectionProperties(section_id, chs_geometry);
  }
};
