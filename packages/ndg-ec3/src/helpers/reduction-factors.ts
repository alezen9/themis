/**
 * Shared reduction factor computations used across buckling and beam-column verifications.
 * §6.3.1.2 flexural buckling, §6.3.2.3 lateral-torsional buckling.
 */

/** §6.3.1.2 — Flexural buckling reduction factor χ. */
export function computeChi(A: number, fy: number, E: number, I: number, Lcr: number, alpha: number): number {
  if (Lcr === 0) throw new Error("computeChi: Lcr must be > 0");
  const Ncr = (Math.PI ** 2 * E * I) / Lcr ** 2;
  if (Ncr === 0) throw new Error("computeChi: Ncr = 0 — check E, I, Lcr");
  const lb = Math.sqrt((A * fy) / Ncr);
  const phi = 0.5 * (1 + alpha * (lb - 0.2) + lb ** 2);
  return Math.min(1, 1 / (phi + Math.sqrt(phi ** 2 - lb ** 2)));
}

/** §6.3.2.3 — Lateral-torsional buckling reduction factor χ_LT. */
export function computeChiLT(Wpl_y: number, fy: number, M_cr: number, alpha_LT: number, lLT0: number, betaLT: number): number {
  if (M_cr <= 0) throw new Error("computeChiLT: M_cr must be > 0");
  const lb = Math.sqrt((Wpl_y * fy) / M_cr);
  const phi = 0.5 * (1 + alpha_LT * (lb - lLT0) + betaLT * lb ** 2);
  const val = 1 / (phi + Math.sqrt(phi ** 2 - betaLT * lb ** 2));
  return Math.min(1, Math.min(val, 1 / lb ** 2));
}
