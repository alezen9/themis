/**
 * EC3 Table 6.1 — Imperfection factors for buckling curves.
 */
const IMPERFECTION_FACTORS: Record<string, number> = {
  a0: 0.13,
  a: 0.21,
  b: 0.34,
  c: 0.49,
  d: 0.76,
};

export function getImperfectionFactor(curve: string): number {
  const alpha = IMPERFECTION_FACTORS[curve];
  if (alpha === undefined) {
    throw new Error(`Unknown buckling curve: "${curve}"`);
  }
  return alpha;
}
