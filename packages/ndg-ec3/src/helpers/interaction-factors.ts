/**
 * Individual interaction factor computations for beam-column checks (§6.3.3).
 * Annex A (Method 1) and Annex B (Method 2) share k_yy/k_zz base formulas;
 * they differ only in k_zy.
 */

/** Table B.1 — k_yy for Class 1 & 2 I-sections. */
export function computeKyy(Cm_y: number, lambda_bar_y: number, N_Ed: number, NbyRd: number): number {
  if (NbyRd <= 0) throw new Error("computeKyy: NbyRd must be > 0");
  const n = Math.abs(N_Ed) / NbyRd;
  return Math.min(
    Cm_y * (1 + (lambda_bar_y - 0.2) * n),
    Cm_y * (1 + 0.8 * n),
  );
}

/** Table B.1 — k_zz for Class 1 & 2 I-sections. */
export function computeKzz(Cm_z: number, lambda_bar_z: number, N_Ed: number, NbzRd: number): number {
  if (NbzRd <= 0) throw new Error("computeKzz: NbzRd must be > 0");
  const n = Math.abs(N_Ed) / NbzRd;
  return Math.min(
    Cm_z * (1 + (2 * lambda_bar_z - 0.6) * n),
    Cm_z * (1 + 1.4 * n),
  );
}

/** Method 1 (Annex A): k_yz = 0.6 · k_zz, k_zy = 0.6 · k_yy. */
export function computeKyzMethod1(k_zz: number): number {
  return 0.6 * k_zz;
}

export function computeKzyMethod1(k_yy: number): number {
  return 0.6 * k_yy;
}

/** Method 2 (Annex B), Table B.2: k_zy for members susceptible to torsional deformations. */
export function computeKzyMethod2(Cm_LT: number, lambda_bar_z: number, N_Ed: number, NbzRd: number): number {
  if (NbzRd <= 0) throw new Error("computeKzyMethod2: NbzRd must be > 0");
  if (Cm_LT === 0.25) throw new Error("computeKzyMethod2: Cm_LT = 0.25 causes division by zero");
  const n = Math.abs(N_Ed) / NbzRd;
  const CmLT_term = Cm_LT - 0.25;
  return Math.max(
    1 - (0.1 * lambda_bar_z) / CmLT_term * n,
    1 - 0.1 / CmLT_term * n,
  );
}
