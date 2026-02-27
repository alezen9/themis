/**
 * Individual interaction factor computations for beam-column checks (S6.3.3).
 * Annex A (Method 1) and Annex B (Method 2) share k_yy/k_zz base formulas;
 * they differ only in k_zy.
 */

/** Table B.1 -- k_yy for Class 1 & 2 I-sections. */
export const computeKyy = (Cm_y: number, lambda_bar_y: number, N_Ed: number, NbyRd: number) => {
  if (NbyRd <= 0) throw new Error("computeKyy: NbyRd must be > 0");
  const n = Math.abs(N_Ed) / NbyRd;
  return Math.min(
    Cm_y * (1 + (Math.min(lambda_bar_y, 1.0) - 0.2) * n),
    Cm_y * (1 + 0.8 * n),
  );
};

/** Table B.1 -- k_zz for Class 1 & 2 I-sections. */
export const computeKzz = (Cm_z: number, lambda_bar_z: number, N_Ed: number, NbzRd: number) => {
  if (NbzRd <= 0) throw new Error("computeKzz: NbzRd must be > 0");
  const n = Math.abs(N_Ed) / NbzRd;
  return Math.min(
    Cm_z * (1 + (2 * Math.min(lambda_bar_z, 1.0) - 0.6) * n),
    Cm_z * (1 + 1.4 * n),
  );
};

/** Method 1 (Annex A): k_yz = 0.6 * k_zz, k_zy = 0.6 * k_yy. */
export const computeKyzMethod1 = (k_zz: number) => {
  return 0.6 * k_zz;
};

export const computeKzyMethod1 = (k_yy: number) => {
  return 0.6 * k_yy;
};

/**
 * Method 2 (Annex B), Table B.2: k_zy for I/H sections susceptible to torsional deformations.
 *
 * λ̄_z < 0.4  (eq. 132): k_zy = max(0.6 + λ̄_z,  1 − 0.1·λ̄_z/(CmLT−0.25)·n)
 * λ̄_z ≥ 0.4  (eq. 133): k_zy = 1 − 0.1·min(λ̄_z,1)/(CmLT−0.25)·n
 *                               ≥ 1 − 0.1/(CmLT−0.25)·n
 */
export const computeKzyMethod2 = (Cm_LT: number, lambda_bar_z: number, N_Ed: number, NbzRd: number) => {
  if (NbzRd <= 0) throw new Error("computeKzyMethod2: NbzRd must be > 0");
  if (Cm_LT === 0.25) throw new Error("computeKzyMethod2: Cm_LT = 0.25 causes division by zero");
  const n = Math.abs(N_Ed) / NbzRd;
  const CmLT_term = Cm_LT - 0.25;
  if (lambda_bar_z < 0.4) {
    // eq. (132): lower bound is 0.6 + λ̄_z
    return Math.max(
      0.6 + lambda_bar_z,
      1 - (0.1 * lambda_bar_z / CmLT_term) * n,
    );
  }
  // eq. (133): λ̄_z ≥ 0.4, cap λ̄_z at 1.0
  const lambdaCapped = Math.min(lambda_bar_z, 1.0);
  return Math.max(
    1 - (0.1 * lambdaCapped / CmLT_term) * n,
    1 - (0.1 / CmLT_term) * n,
  );
};
