import type { Ec3FormValues } from "../../Form/schema";
import { computeSectionProperties } from "../geometry/sectionProperties";
import { computeChsSectionClassification } from "./sectionClassificationChs";
import { computeISectionClassification } from "./sectionClassificationI";
import { computeRhsSectionClassification } from "./sectionClassificationRhs";

type ComputedSectionClass = 1 | 2 | 3 | 4;

const computeSectionClass = (
  inputs: Ec3FormValues,
  sectionProperties: ReturnType<typeof computeSectionProperties>,
  fy: number,
): ComputedSectionClass => {
  if (inputs.section_class !== "auto") return inputs.section_class;

  switch (inputs.shape) {
    case "I":
      return computeISectionClassification(
        { ...inputs, fy },
        sectionProperties,
      );
    case "RHS":
      return computeRhsSectionClassification(
        { ...inputs, fy },
        sectionProperties,
      );
    case "CHS":
      return computeChsSectionClassification({ ...inputs, fy });
  }
};

export const computeClassificationProperties = (
  inputs: Ec3FormValues,
  sectionProperties: ReturnType<typeof computeSectionProperties>,
  fy: number,
): { section_class: ComputedSectionClass } => ({
  section_class: computeSectionClass(inputs, sectionProperties, fy),
});
