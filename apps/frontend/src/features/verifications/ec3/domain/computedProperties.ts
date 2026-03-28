import { computeSectionClassification } from "./classification/sectionClassification";
import {
  computeSectionProperties,
  type SectionProperties,
} from "./geometry/sectionProperties";
import type { Ec3InputValues, ResolvedSectionClass } from "./inputsSchema";

type Ec3ComputedProperties = SectionProperties & {
  section_class: ResolvedSectionClass;
};

export const computeEc3ComputedProperties = (
  inputs: Ec3InputValues,
): Ec3ComputedProperties => {
  const { section_class_selection } = inputs;
  const sectionProperties = computeSectionProperties(inputs);

  if (section_class_selection !== "auto")
    return { ...sectionProperties, section_class: section_class_selection };

  const section_class = computeSectionClassification(inputs, sectionProperties);

  return { ...sectionProperties, section_class };
};
