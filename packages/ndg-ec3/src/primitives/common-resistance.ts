export const computeNplRd = (A: number, fy: number, gammaM0: number) => {
  return (A * fy) / gammaM0;
};

export const computeMplRd = (Wpl: number, fy: number, gammaM0: number) => {
  return (Wpl * fy) / gammaM0;
};

export const computeVplRd = (Av: number, fy: number, gammaM0: number) => {
  return (Av * (fy / Math.sqrt(3))) / gammaM0;
};

export const computeRho = (VEd: number, VplRd: number) => {
  const ratio = Math.abs(VEd) / VplRd;
  if (ratio <= 0.5) return 0;
  return (2 * ratio - 1) ** 2;
};
