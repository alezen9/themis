export const getStressDistribution = (
  sigma_a_MPa: number,
  sigma_b_MPa: number,
) => {
  const areBothZero = sigma_a_MPa === 0 && sigma_b_MPa === 0;
  const areBothPositive = sigma_a_MPa >= 0 && sigma_b_MPa >= 0;
  const areBothNegative = sigma_a_MPa < 0 && sigma_b_MPa < 0;
  const areDifferentSigns = !areBothPositive && !areBothNegative;
  const areBothEqualMagnitude = Math.abs(sigma_a_MPa) === Math.abs(sigma_b_MPa);

  if (areBothZero) return "no-stress";
  if (areBothPositive) return "tension";
  if (areBothNegative && areBothEqualMagnitude) return "compression";
  if (areDifferentSigns && areBothEqualMagnitude) return "bending";
  return "compression-bending";
};
