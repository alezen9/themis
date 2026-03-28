import type { Ec3InputValues, ResolvedSectionClass } from "../inputsSchema";
import type { SectionProperties } from "../geometry/sectionProperties";
import { computeChsSectionClassification } from "./sectionClassificationChs";
import { computeISectionClassification } from "./sectionClassificationI";
import { computeRhsSectionClassification } from "./sectionClassificationRhs";

export const computeSectionClassification = (
  input: Ec3InputValues,
  sectionProperties: SectionProperties,
): ResolvedSectionClass => {
  switch (input.shape) {
    case "I":
      return computeISectionClassification(input, sectionProperties);
    case "RHS":
      return computeRhsSectionClassification(input, sectionProperties);
    case "CHS":
      return computeChsSectionClassification(input);
  }
};
