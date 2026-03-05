import type { ChsClassInput } from "./";

export const computeChsClass = (input: ChsClassInput) => {
  const { yieldStrength, diameter, wallThickness } = input;

  const epsilonSquared = 235 / yieldStrength;
  const shellSlenderness = diameter / wallThickness;
  if (!Number.isFinite(shellSlenderness) || shellSlenderness <= 0) return 4;

  const class1Limit = 50 * epsilonSquared;
  if (shellSlenderness <= class1Limit) return 1;

  const class2Limit = 70 * epsilonSquared;
  if (shellSlenderness <= class2Limit) return 2;

  const class3Limit = 90 * epsilonSquared;
  if (shellSlenderness <= class3Limit) return 3;

  return 4;
};
