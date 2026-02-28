/**
 * Shared reduction factor computations used across buckling and beam-column verifications.
 * S6.3.1.2 flexural buckling, S6.3.2.3 lateral-torsional buckling.
 */
import { throwInvalidInput } from "../errors";

/** S6.3.1.2 -- Flexural buckling reduction factor chi. */
export const computeChi = (A: number, fy: number, E: number, I: number, Lcr: number, alpha: number): number => {
  if (Lcr === 0) throwInvalidInput("computeChi: Lcr must be > 0");
  const Ncr = (Math.PI ** 2 * E * I) / Lcr ** 2;
  if (Ncr === 0) throwInvalidInput("computeChi: Ncr = 0 -- check E, I, Lcr");
  const lb = Math.sqrt((A * fy) / Ncr);
  const phi = 0.5 * (1 + alpha * (lb - 0.2) + lb ** 2);
  return Math.min(1, 1 / (phi + Math.sqrt(phi ** 2 - lb ** 2)));
};

/** S6.3.2.3 -- Lateral-torsional buckling reduction factor chi_LT. */
export const computeChiLT = (Wpl_y: number, fy: number, M_cr: number, alpha_LT: number, lLT0: number, betaLT: number): number => {
  if (M_cr <= 0) throwInvalidInput("computeChiLT: M_cr must be > 0");
  const lb = Math.sqrt((Wpl_y * fy) / M_cr);
  const phi = 0.5 * (1 + alpha_LT * (lb - lLT0) + betaLT * lb ** 2);
  const val = 1 / (phi + Math.sqrt(phi ** 2 - betaLT * lb ** 2));
  return Math.min(1, Math.min(val, 1 / lb ** 2));
};

/** Elastic torsional critical force for doubly-symmetric open sections. */
export const computeNcrT = (
  E: number,
  G: number,
  Iy: number,
  Iz: number,
  It: number,
  Iw: number,
  LcrT: number,
  A: number,
): number => {
  if (A <= 0) throwInvalidInput("computeNcrT: A must be > 0");
  if (LcrT <= 0) throwInvalidInput("computeNcrT: LcrT must be > 0");
  if (Iy <= 0 || Iz <= 0 || It <= 0 || Iw <= 0) {
    throwInvalidInput("computeNcrT: Iy, Iz, It and Iw must be > 0");
  }
  const ip2 = (Iy + Iz) / A;
  if (ip2 <= 0) throwInvalidInput("computeNcrT: polar radius of gyration squared must be > 0");
  return (G * It + (Math.PI ** 2 * E * Iw) / LcrT ** 2) / ip2;
};

/**
 * SN003b-style elastic critical moment for doubly-symmetric I/H members.
 * Applicability is intentionally strict: open sections with positive Iw.
 */
export const computeMcrSn003b = (
  E: number,
  G: number,
  Iz: number,
  It: number,
  Iw: number,
  LcrLT: number,
  C1: number,
): number => {
  if (LcrLT <= 0) throwInvalidInput("computeMcrSn003b: LcrLT must be > 0");
  if (Iz <= 0 || It <= 0 || Iw <= 0) {
    throwInvalidInput("computeMcrSn003b: Iz, It and Iw must be > 0 for SN003b applicability");
  }
  const euler = (Math.PI ** 2 * E * Iz) / (LcrLT ** 2);
  const torsionTerm = Iw / Iz + (LcrLT ** 2 * G * It) / (Math.PI ** 2 * E * Iz);
  if (torsionTerm <= 0) throwInvalidInput("computeMcrSn003b: invalid torsion term");
  return C1 * euler * Math.sqrt(torsionTerm);
};
