import type {
  ResolvedSectionClass,
  SectionClassificationInput,
} from "../inputs";
import { computeChsSectionClassification } from "./sectionClassificationChs";
import { computeISectionClassification } from "./sectionClassificationI";
import { computeRhsSectionClassification } from "./sectionClassificationRhs";

export const computeSectionClassification = (
  input: SectionClassificationInput,
): ResolvedSectionClass => {
  switch (input.shape) {
    case "I":
      return computeISectionClassification(input);
    case "RHS":
      return computeRhsSectionClassification(input);
    case "CHS":
      return computeChsSectionClassification(input);
  }
};
