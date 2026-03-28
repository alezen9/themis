import type {
  ISectionClassificationInput,
  ResolvedSectionClass,
} from "../inputs";
import { resolveInternalPartClass } from "./internalPartClassification";

const maxSectionClass = (
  ...classes: ResolvedSectionClass[]
): ResolvedSectionClass => Math.max(...classes) as ResolvedSectionClass;

const resolveRolledOutstandClass = (
  flangeSlenderness: number,
  epsilon: number,
  webStress: number,
  tipStress: number,
): ResolvedSectionClass => {
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
): ResolvedSectionClass => {
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

export const computeISectionClassification = (
  input: ISectionClassificationInput,
): ResolvedSectionClass => {
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
  const flangeOutstand = Math.max(
    (width - webThickness - 2 * rootRadius) / 2,
    0,
  );
  const flangeSlenderness = flangeOutstand / flangeThickness;

  const webHeight = Math.max(depth - 2 * flangeThickness - 2 * rootRadius, 0);
  const webSlenderness = webHeight / webThickness;

  const compressionFromAxialForce =
    crossSectionArea > 0 ? -axialForceEd / crossSectionArea : 0;
  const compressionFromBendingY =
    elasticSectionModulusY > 0 ? -bendingMomentYEd / elasticSectionModulusY : 0;
  const tipCompressionFromBendingZ =
    elasticSectionModulusZ > 0 ? -bendingMomentZEd / elasticSectionModulusZ : 0;
  const tipDistanceFromCentroid = width / 2;
  const webDistanceFromCentroid = webThickness / 2 + rootRadius;
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

  const resolveOutstandClass =
    fabricationType === "welded"
      ? resolveWeldedOutstandClass
      : resolveRolledOutstandClass;

  const flangeClass = maxSectionClass(
    resolveOutstandClass(
      flangeSlenderness,
      epsilon,
      topStress - webCompressionFromBendingZ,
      topStress - tipCompressionFromBendingZ,
    ),
    resolveOutstandClass(
      flangeSlenderness,
      epsilon,
      topStress + webCompressionFromBendingZ,
      topStress + tipCompressionFromBendingZ,
    ),
    resolveOutstandClass(
      flangeSlenderness,
      epsilon,
      bottomStress - webCompressionFromBendingZ,
      bottomStress - tipCompressionFromBendingZ,
    ),
    resolveOutstandClass(
      flangeSlenderness,
      epsilon,
      bottomStress + webCompressionFromBendingZ,
      bottomStress + tipCompressionFromBendingZ,
    ),
  );

  return maxSectionClass(webClass, flangeClass);
};
