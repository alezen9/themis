type ElasticStressInput = { stressA_MPa: number; stressB_MPa: number };

export const computeInternalElasticState = (input: ElasticStressInput) => {
  const compressionStress_MPa = Math.max(input.stressA_MPa, input.stressB_MPa);

  if (compressionStress_MPa <= 0) {
    return {
      hasCompression: false,
      psi: 1,
      compressionStress_MPa: 0,
      tensionStress_MPa: Math.max(-input.stressA_MPa, -input.stressB_MPa, 0),
    };
  }

  const otherStress_MPa = Math.min(input.stressA_MPa, input.stressB_MPa);

  return {
    hasCompression: true,
    psi: otherStress_MPa / compressionStress_MPa,
    compressionStress_MPa,
    tensionStress_MPa: Math.max(-otherStress_MPa, 0),
  };
};

export const computeOutstandElasticState = (
  webStress_MPa: number,
  tipStress_MPa: number,
) => {
  const compressionStress_MPa = Math.max(webStress_MPa, tipStress_MPa);

  if (compressionStress_MPa <= 0) {
    return { hasCompression: false, psi: 1, tipInCompression: false };
  }

  const tipInCompression = tipStress_MPa >= webStress_MPa;
  const otherStress_MPa = tipInCompression ? webStress_MPa : tipStress_MPa;

  return {
    hasCompression: true,
    psi: otherStress_MPa / compressionStress_MPa,
    tipInCompression,
  };
};
