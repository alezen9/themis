/**
 * EC3 Table 6.1 -- Imperfection factors for buckling curves.
 *
 * @deprecated Transitional helper. Planned removal once table decisions are fully embedded in check nodes.
 */
import { Ec3VerificationError } from "../errors";
const IMPERFECTION_FACTORS: Record<string, number> = {
  a0: 0.13,
  a: 0.21,
  b: 0.34,
  c: 0.49,
  d: 0.76,
};

export const getImperfectionFactor = (curve: string) => {
  const alpha = IMPERFECTION_FACTORS[curve];
  if (alpha === undefined) {
    throw new Ec3VerificationError({
      type: "invalid-input-domain",
      message: `Unknown buckling curve: "${curve}"`,
    });
  }
  return alpha;
};
