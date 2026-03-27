import type { IShapeClassInput, SectionClass } from "./";

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

const resolveRolledOutstandClass = (
  flangeSlenderness: number,
  epsilon: number,
  webStress: number,
  tipStress: number,
): SectionClass => {
  const maxCompressionStress = Math.max(webStress, tipStress);
  if (maxCompressionStress <= 0) return 1;
  if (flangeSlenderness <= 9 * epsilon) return 1;
  if (flangeSlenderness <= 10 * epsilon) return 2;
  if (flangeSlenderness <= 14 * epsilon) return 3;
  return 4;
};

const computeWeldedOutstandKSigma = (webStress: number, tipStress: number) => {
  const isTipInCompression = tipStress > 0 && tipStress >= webStress;
  if (isTipInCompression) {
    const stressRatio = webStress / tipStress;
    if (stressRatio >= 1) return 0.43;
    if (stressRatio > 0) return 0.578 / (stressRatio + 0.34);
    if (stressRatio > -1)
      return 1.7 - 5 * stressRatio + 17.1 * stressRatio ** 2;
    return 23.8;
  }

  if (webStress <= 0) return 0.43;

  const stressRatio = tipStress / webStress;
  const clampedStressRatio = Math.max(-3, Math.min(1, stressRatio));
  return 0.57 - 0.21 * clampedStressRatio + 0.07 * clampedStressRatio ** 2;
};

const resolveWeldedOutstandClass = (
  flangeSlenderness: number,
  epsilon: number,
  webStress: number,
  tipStress: number,
): SectionClass => {
  const maxCompressionStress = Math.max(webStress, tipStress);
  if (maxCompressionStress <= 0) return 1;

  const minCompressionStress = Math.min(webStress, tipStress);
  const alpha =
    minCompressionStress >= 0
      ? 1
      : maxCompressionStress / (maxCompressionStress - minCompressionStress);

  if (!Number.isFinite(alpha) || alpha <= 0) return 4;

  const class1Limit = (9 * epsilon) / alpha;
  if (flangeSlenderness <= class1Limit) return 1;

  const class2Limit = (10 * epsilon) / alpha;
  if (flangeSlenderness <= class2Limit) return 2;

  const kSigma = computeWeldedOutstandKSigma(webStress, tipStress);
  if (!Number.isFinite(kSigma) || kSigma <= 0) return 4;

  const class3Limit = 21 * epsilon * Math.sqrt(kSigma);
  if (flangeSlenderness <= class3Limit) return 3;
  return 4;
};

export const computeIShapeClass = (input: IShapeClassInput): SectionClass => {
  const {
    fabricationType = "rolled",
    yieldStrength,
    depth,
    width,
    webThickness,
    flangeThickness,
    rootRadius = 0,
    crossSectionArea = 0,
    elasticSectionModulusY = 0,
    elasticSectionModulusZ = 0,
    axialForceEd = 0,
    bendingMomentYEd = 0,
    bendingMomentZEd = 0,
  } = input;

  const epsilon = Math.sqrt(235 / yieldStrength);
  const radius = rootRadius;

  const flangeOutstand = Math.max((width - webThickness - 2 * radius) / 2, 0);
  const flangeSlenderness = flangeOutstand / flangeThickness;

  const webHeight = Math.max(depth - 2 * flangeThickness - 2 * radius, 0);
  const webSlenderness = webHeight / webThickness;

  const compressionFromAxialForce =
    crossSectionArea > 0 ? -axialForceEd / crossSectionArea : 0;
  const compressionFromBendingY =
    elasticSectionModulusY > 0 ? -bendingMomentYEd / elasticSectionModulusY : 0;
  const tipCompressionFromBendingZ =
    elasticSectionModulusZ > 0 ? -bendingMomentZEd / elasticSectionModulusZ : 0;
  const tipDistanceFromCentroid = width / 2;
  const webDistanceFromCentroid = webThickness / 2 + radius;
  const webToTipDistanceRatio =
    tipDistanceFromCentroid > 0
      ? Math.min(webDistanceFromCentroid / tipDistanceFromCentroid, 1)
      : 0;
  const webCompressionFromBendingZ =
    tipCompressionFromBendingZ * webToTipDistanceRatio;

  const topStress = compressionFromAxialForce + compressionFromBendingY;
  const bottomStress = compressionFromAxialForce - compressionFromBendingY;
  const webClass = resolveInternalPartClass(
    webSlenderness,
    epsilon,
    yieldStrength,
    topStress,
    bottomStress,
  );

  const topLeftWebStress = topStress - webCompressionFromBendingZ;
  const topRightWebStress = topStress + webCompressionFromBendingZ;
  const bottomLeftWebStress = bottomStress - webCompressionFromBendingZ;
  const bottomRightWebStress = bottomStress + webCompressionFromBendingZ;

  const topLeftTipStress = topStress - tipCompressionFromBendingZ;
  const topRightTipStress = topStress + tipCompressionFromBendingZ;
  const bottomLeftTipStress = bottomStress - tipCompressionFromBendingZ;
  const bottomRightTipStress = bottomStress + tipCompressionFromBendingZ;

  const resolveOutstandClass =
    fabricationType === "welded"
      ? resolveWeldedOutstandClass
      : resolveRolledOutstandClass;

  const topLeftFlangeClass = resolveOutstandClass(
    flangeSlenderness,
    epsilon,
    topLeftWebStress,
    topLeftTipStress,
  );
  const topRightFlangeClass = resolveOutstandClass(
    flangeSlenderness,
    epsilon,
    topRightWebStress,
    topRightTipStress,
  );
  const bottomLeftFlangeClass = resolveOutstandClass(
    flangeSlenderness,
    epsilon,
    bottomLeftWebStress,
    bottomLeftTipStress,
  );
  const bottomRightFlangeClass = resolveOutstandClass(
    flangeSlenderness,
    epsilon,
    bottomRightWebStress,
    bottomRightTipStress,
  );
  let flangeClass = topLeftFlangeClass;
  if (topRightFlangeClass > flangeClass) flangeClass = topRightFlangeClass;
  if (bottomLeftFlangeClass > flangeClass) flangeClass = bottomLeftFlangeClass;
  if (bottomRightFlangeClass > flangeClass)
    flangeClass = bottomRightFlangeClass;

  if (flangeClass > webClass) return flangeClass;
  return webClass;
};
