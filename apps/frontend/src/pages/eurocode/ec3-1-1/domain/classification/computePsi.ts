export const computePsi = (sigmaTop_MPa: number, sigmaBottom_MPa: number) => {
  const isTopStressLarger = Math.abs(sigmaTop_MPa) >= Math.abs(sigmaBottom_MPa);
  const sigma1_MPa = isTopStressLarger ? sigmaTop_MPa : sigmaBottom_MPa;
  const sigma2_MPa = isTopStressLarger ? sigmaBottom_MPa : sigmaTop_MPa;

  if (sigma1_MPa === 0) return 0;
  return sigma2_MPa / sigma1_MPa;
};
