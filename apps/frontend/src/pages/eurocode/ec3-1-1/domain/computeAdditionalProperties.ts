import { steelGradesMap } from "../data/steelGrades";
import { additionalPropertiesSchema } from "./additionalPropertiesSchema";
import { computeBucklingProperties } from "./buckling/buckling";
import { computeClassificationProperties } from "./classification/sectionClassification";
import type { Ec3FormValues } from "../Form/schema";
import { computeSectionProperties } from "./geometry/sectionProperties";

const computeYieldStrength = (gradeId: Ec3FormValues["gradeId"]) =>
  steelGradesMap.get(gradeId)?.fy ?? Number.NaN;

export const computeAdditionalProperties = (inputs: Ec3FormValues) => {
  const fy = computeYieldStrength(inputs.gradeId);
  const computedSectionProperties = computeSectionProperties(inputs);
  const computedBucklingProperties = computeBucklingProperties(inputs);
  const computedClassificationProperties = computeClassificationProperties(
    inputs,
    computedSectionProperties,
    fy,
  );

  return additionalPropertiesSchema.parse({
    fy,
    ...computedSectionProperties,
    ...computedBucklingProperties,
    ...computedClassificationProperties,
  });
};
