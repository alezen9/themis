import { steelGradesMap } from "../data/steelGrades";
import { additionalPropertiesSchema } from "./additionalPropertiesSchema";
import { computeBucklingProperties } from "./buckling/buckling";
import { computeClassificationProperties } from "./classification/sectionClassification";
import type { Ec3FormValues } from "../Form/schema";
import { computeGeometryProperties } from "./geometry/computeGeometryProperties";

const computeYieldStrength = (gradeId: Ec3FormValues["gradeId"]) =>
  steelGradesMap.get(gradeId)?.fy ?? Number.NaN;

export const computeAdditionalProperties = (inputs: Ec3FormValues) => {
  const fy = computeYieldStrength(inputs.gradeId);
  const computedGeometryProperties = computeGeometryProperties(inputs);
  const computedBucklingProperties = computeBucklingProperties(inputs);
  const computedClassificationProperties = computeClassificationProperties(
    inputs,
    computedGeometryProperties,
    fy,
  );

  return additionalPropertiesSchema.parse({
    fy,
    ...computedGeometryProperties,
    ...computedBucklingProperties,
    ...computedClassificationProperties,
  });
};
