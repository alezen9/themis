import { Ec3VerificationError } from "../errors";

const IMPERFECTION_FACTORS: Record<string, number> = {
  a0: 0.13,
  a: 0.21,
  b: 0.34,
  c: 0.49,
  d: 0.76,
};

export const getImperfectionFactor = (bucklingCurve: string) => {
  const alpha = IMPERFECTION_FACTORS[bucklingCurve];
  if (alpha === undefined)
    throw new Ec3VerificationError({
      type: "invalid-input-domain",
      message: `Unknown buckling curve: "${bucklingCurve}"`,
    });
  return alpha;
};
