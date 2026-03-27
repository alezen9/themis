import type { RhsClassInput, SectionClass } from "./";

const computeClass1Limit = (alpha: number, epsilon: number) => {
  if (alpha <= 0.5) return (36 * epsilon) / alpha;
  return (396 * epsilon) / (13 * alpha - 1);
};

const computeClass2Limit = (alpha: number, epsilon: number) => {
  if (alpha <= 0.5) return (41.5 * epsilon) / alpha;
  return (456 * epsilon) / (13 * alpha - 1);
};

const computeClass3Limit = (
  stressRatio: number,
  epsilon: number,
  canUsePsiLowerBranch: boolean,
) => {
  if (!canUsePsiLowerBranch || stressRatio > -1) {
    return (42 * epsilon) / (0.67 + 0.33 * Math.max(stressRatio, -1));
  }

  return 62 * epsilon * (1 - stressRatio) * Math.sqrt(-stressRatio);
};

const resolveInternalPartClass = (
  slenderness: number,
  epsilon: number,
  yieldStrength: number,
  stressEdgeA: number,
  stressEdgeB: number,
): SectionClass => {
  if (!Number.isFinite(slenderness) || slenderness <= 0) return 4;

  const maxCompressionStress = Math.max(stressEdgeA, stressEdgeB);
  if (maxCompressionStress <= 0) return 1;

  const minCompressionStress = Math.min(stressEdgeA, stressEdgeB);
  const stressRatio = minCompressionStress / maxCompressionStress;
  const tensionStressMagnitude = Math.max(-minCompressionStress, 0);
  const canUsePsiLowerBranch =
    maxCompressionStress <= yieldStrength ||
    tensionStressMagnitude >= yieldStrength;
  const alpha =
    minCompressionStress >= 0
      ? 1
      : maxCompressionStress / (maxCompressionStress - minCompressionStress);

  const class1Limit = computeClass1Limit(alpha, epsilon);
  const class2Limit = computeClass2Limit(alpha, epsilon);
  const class3Limit = computeClass3Limit(
    stressRatio,
    epsilon,
    canUsePsiLowerBranch,
  );

  if (slenderness <= class1Limit) return 1;
  if (slenderness <= class2Limit) return 2;
  if (slenderness <= class3Limit) return 3;
  return 4;
};

export const computeRhsClass = (input: RhsClassInput): SectionClass => {
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

  const topWallClass = resolveInternalPartClass(
    widthSlenderness,
    epsilon,
    yieldStrength,
    topLeftStress,
    topRightStress,
  );
  const bottomWallClass = resolveInternalPartClass(
    widthSlenderness,
    epsilon,
    yieldStrength,
    bottomLeftStress,
    bottomRightStress,
  );
  const leftWallClass = resolveInternalPartClass(
    depthSlenderness,
    epsilon,
    yieldStrength,
    topLeftStress,
    bottomLeftStress,
  );
  const rightWallClass = resolveInternalPartClass(
    depthSlenderness,
    epsilon,
    yieldStrength,
    topRightStress,
    bottomRightStress,
  );

  let sectionClass = topWallClass;
  if (bottomWallClass > sectionClass) sectionClass = bottomWallClass;
  if (leftWallClass > sectionClass) sectionClass = leftWallClass;
  if (rightWallClass > sectionClass) sectionClass = rightWallClass;
  return sectionClass;
};
