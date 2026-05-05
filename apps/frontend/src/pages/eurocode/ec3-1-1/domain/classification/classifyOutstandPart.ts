import type { Ec3FormValues } from "../../Form/schema";

type Input = {
  slenderness: number;
  epsilon: number;
  fabrication_type: Ec3FormValues["fabrication_type"];
  webStress: number;
  tipStress: number;
};

const classifyRolledOutstandPart = (
  slenderness: number,
  epsilon: number,
  webStress: number,
  tipStress: number,
) => {
  const maxCompressionStress = Math.max(webStress, tipStress);
  if (maxCompressionStress <= 0) return 1;
  if (slenderness <= 9 * epsilon) return 1;
  if (slenderness <= 10 * epsilon) return 2;
  if (slenderness <= 14 * epsilon) return 3;
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

const classifyWeldedOutstandPart = (
  slenderness: number,
  epsilon: number,
  webStress: number,
  tipStress: number,
) => {
  const maxCompressionStress = Math.max(webStress, tipStress);
  if (maxCompressionStress <= 0) return 1;

  const minCompressionStress = Math.min(webStress, tipStress);
  const alpha =
    minCompressionStress >= 0
      ? 1
      : maxCompressionStress / (maxCompressionStress - minCompressionStress);

  if (alpha <= 0) return 4;

  if (slenderness <= (9 * epsilon) / alpha) return 1;
  if (slenderness <= (10 * epsilon) / alpha) return 2;

  const kSigma = computeWeldedOutstandKSigma(webStress, tipStress);
  if (kSigma <= 0) return 4;
  if (slenderness <= 21 * epsilon * Math.sqrt(kSigma)) return 3;

  return 4;
};

export const classifyOutstandPart = (input: Input) => {
  const { slenderness, epsilon, fabrication_type, webStress, tipStress } =
    input;
  if (slenderness <= 0) return 4;

  if (fabrication_type === "welded") {
    return classifyWeldedOutstandPart(
      slenderness,
      epsilon,
      webStress,
      tipStress,
    );
  }

  return classifyRolledOutstandPart(slenderness, epsilon, webStress, tipStress);
};
