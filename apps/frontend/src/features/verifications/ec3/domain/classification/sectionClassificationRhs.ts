import type {
  ResolvedSectionClass,
  RhsSectionClassificationInput,
} from "../inputs";
import { resolveInternalPartClass } from "./internalPartClassification";

const maxSectionClass = (
  ...classes: ResolvedSectionClass[]
): ResolvedSectionClass => Math.max(...classes) as ResolvedSectionClass;

export const computeRhsSectionClassification = (
  input: RhsSectionClassificationInput,
): ResolvedSectionClass => {
  const {
    yieldStrength,
    depth,
    width,
    wallThickness,
    innerRadius,
    crossSectionArea = 0,
    elasticSectionModulusY = 0,
    elasticSectionModulusZ = 0,
    axialForceEd = 0,
    bendingMomentYEd = 0,
    bendingMomentZEd = 0,
  } = input;

  const epsilon = Math.sqrt(235 / yieldStrength);
  const wallDepth = Math.max(depth - 2 * (innerRadius + wallThickness), 0);
  const wallWidth = Math.max(width - 2 * (innerRadius + wallThickness), 0);
  const depthSlenderness = wallDepth / wallThickness;
  const widthSlenderness = wallWidth / wallThickness;

  const compressionFromAxialForce =
    crossSectionArea > 0 ? -axialForceEd / crossSectionArea : 0;
  const compressionFromBendingY =
    elasticSectionModulusY > 0 ? -bendingMomentYEd / elasticSectionModulusY : 0;
  const compressionFromBendingZ =
    elasticSectionModulusZ > 0 ? -bendingMomentZEd / elasticSectionModulusZ : 0;

  const topLeftStress =
    compressionFromAxialForce +
    compressionFromBendingY -
    compressionFromBendingZ;
  const topRightStress =
    compressionFromAxialForce +
    compressionFromBendingY +
    compressionFromBendingZ;
  const bottomLeftStress =
    compressionFromAxialForce -
    compressionFromBendingY -
    compressionFromBendingZ;
  const bottomRightStress =
    compressionFromAxialForce -
    compressionFromBendingY +
    compressionFromBendingZ;

  return maxSectionClass(
    resolveInternalPartClass(
      widthSlenderness,
      epsilon,
      yieldStrength,
      topLeftStress,
      topRightStress,
    ),
    resolveInternalPartClass(
      widthSlenderness,
      epsilon,
      yieldStrength,
      bottomLeftStress,
      bottomRightStress,
    ),
    resolveInternalPartClass(
      depthSlenderness,
      epsilon,
      yieldStrength,
      topLeftStress,
      bottomLeftStress,
    ),
    resolveInternalPartClass(
      depthSlenderness,
      epsilon,
      yieldStrength,
      topRightStress,
      bottomRightStress,
    ),
  );
};
