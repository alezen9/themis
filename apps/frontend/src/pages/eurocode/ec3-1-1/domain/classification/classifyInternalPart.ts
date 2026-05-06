type Input = {
  slenderness: number;
  epsilon: number;
  fy_MPa: number;
  stressEdgeA: number;
  stressEdgeB: number;
};

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
  canUseTensionBranch: boolean,
) => {
  if (!canUseTensionBranch || stressRatio > -1) {
    return (42 * epsilon) / (0.67 + 0.33 * Math.max(stressRatio, -1));
  }

  return 62 * epsilon * (1 - stressRatio) * Math.sqrt(-stressRatio);
};

export const classifyInternalPart = (input: Input) => {
  const { slenderness, epsilon, fy_MPa, stressEdgeA, stressEdgeB } = input;
  if (slenderness <= 0) return 4;

  const compressionStress = Math.min(stressEdgeA, stressEdgeB);
  if (compressionStress >= 0) return 1;

  const otherStress = Math.max(stressEdgeA, stressEdgeB);
  const compressionMagnitude = -compressionStress;
  const stressRatio = otherStress / compressionStress;
  const tensionStress = Math.max(otherStress, 0);
  const canUseTensionBranch =
    compressionMagnitude <= fy_MPa || tensionStress >= fy_MPa;
  const alpha =
    otherStress <= 0
      ? 1
      : compressionMagnitude / (otherStress - compressionStress);

  if (alpha <= 0) return 4;

  if (slenderness <= computeClass1Limit(alpha, epsilon)) return 1;
  if (slenderness <= computeClass2Limit(alpha, epsilon)) return 2;
  if (
    slenderness <= computeClass3Limit(stressRatio, epsilon, canUseTensionBranch)
  )
    return 3;

  return 4;
};
