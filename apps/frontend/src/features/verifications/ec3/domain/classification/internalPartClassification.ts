type ComputedSectionClass = 1 | 2 | 3 | 4;

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

export const computeInternalPartClass = (
  slenderness: number,
  epsilon: number,
  fy: number,
  stressEdgeA: number,
  stressEdgeB: number,
): ComputedSectionClass => {
  if (!Number.isFinite(slenderness) || slenderness <= 0) return 4;

  const maxCompressionStress = Math.max(stressEdgeA, stressEdgeB);
  if (maxCompressionStress <= 0) return 1;

  const minCompressionStress = Math.min(stressEdgeA, stressEdgeB);
  const stressRatio = minCompressionStress / maxCompressionStress;
  const tensionStressMagnitude = Math.max(-minCompressionStress, 0);
  const canUsePsiLowerBranch =
    maxCompressionStress <= fy || tensionStressMagnitude >= fy;
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
