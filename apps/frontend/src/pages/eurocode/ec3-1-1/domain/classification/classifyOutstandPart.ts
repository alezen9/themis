import type { Ec3FormValues } from "../../Form/schema";

type Input = {
  slenderness: number;
  epsilon: number;
  fabrication_type: Ec3FormValues["fabrication_type"];
  alpha: number;
  plasticTipInCompression: boolean;
  elasticPsi: number;
  elasticTipInCompression: boolean;
};

const classifyRolledOutstandPart = (
  slenderness: number,
  epsilon: number,
  alpha: number,
) => {
  if (alpha <= 0) return 1;
  if (slenderness <= 9 * epsilon) return 1;
  if (slenderness <= 10 * epsilon) return 2;
  if (slenderness <= 14 * epsilon) return 3;
  return 4;
};

const computeWeldedOutstandKSigma = (
  psi: number,
  tipInCompression: boolean,
) => {
  if (tipInCompression) {
    const clampedPsi = Math.max(-3, Math.min(1, psi));
    return 0.57 - 0.21 * clampedPsi + 0.07 * clampedPsi ** 2;
  }

  if (psi >= 1) return 0.43;
  if (psi > 0) return 0.578 / (psi + 0.34);
  if (psi > -1) return 1.7 - 5 * psi + 17.1 * psi ** 2;
  return 23.8;
};

const classifyWeldedOutstandPart = (
  slenderness: number,
  epsilon: number,
  alpha: number,
  plasticTipInCompression: boolean,
  elasticPsi: number,
  elasticTipInCompression: boolean,
) => {
  if (alpha <= 0) return 1;

  const class12Denominator = plasticTipInCompression
    ? alpha
    : alpha * Math.sqrt(alpha);

  if (slenderness <= (9 * epsilon) / class12Denominator) return 1;
  if (slenderness <= (10 * epsilon) / class12Denominator) return 2;

  const kSigma = computeWeldedOutstandKSigma(
    elasticPsi,
    elasticTipInCompression,
  );
  if (kSigma <= 0) return 4;
  if (slenderness <= 21 * epsilon * Math.sqrt(kSigma)) return 3;

  return 4;
};

export const classifyOutstandPart = (input: Input) => {
  const {
    slenderness,
    epsilon,
    fabrication_type,
    alpha,
    plasticTipInCompression,
    elasticPsi,
    elasticTipInCompression,
  } = input;
  if (slenderness <= 0) return 4;

  if (fabrication_type === "welded") {
    return classifyWeldedOutstandPart(
      slenderness,
      epsilon,
      alpha,
      plasticTipInCompression,
      elasticPsi,
      elasticTipInCompression,
    );
  }

  return classifyRolledOutstandPart(slenderness, epsilon, alpha);
};
