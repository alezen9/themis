/**
 * EC3 Annex A — Interaction factors (Method 1).
 * Simplified form for Class 1 & 2 I-sections.
 */

export interface AnnexAInput {
  N_Ed: number;
  chi_y: number;
  chi_z: number;
  chi_LT: number;
  N_Rk: number;
  M_y_Rk: number;
  M_z_Rk: number;
  gamma_M1: number;
  Cm_y: number;
  Cm_z: number;
  lambda_bar_y: number;
  lambda_bar_z: number;
  lambda_bar_LT: number;
}

export interface InteractionFactors {
  k_yy: number;
  k_yz: number;
  k_zy: number;
  k_zz: number;
}

/** Annex A interaction factors (Method 1). */
export function computeAnnexAFactors(input: AnnexAInput): InteractionFactors {
  const {
    N_Ed,
    chi_y,
    chi_z,
    N_Rk,
    gamma_M1,
    Cm_y,
    Cm_z,
    lambda_bar_y,
    lambda_bar_z,
  } = input;

  const NbyRd = (chi_y * N_Rk) / gamma_M1;
  const NbzRd = (chi_z * N_Rk) / gamma_M1;
  const n_y = N_Ed / NbyRd;
  const n_z = N_Ed / NbzRd;

  // μ_y = (1 - N_Ed/N_cr_y) / (1 - χ_y·N_Ed/N_cr_y)
  // Simplified: use 1/(1-n) approach with bounding
  // k_yy = C_my · 1/(1 - N_Ed/NbyRd) but bounded
  const k_yy = Math.min(
    Cm_y * (1 + (lambda_bar_y - 0.2) * n_y),
    Cm_y * (1 + 0.8 * n_y),
  );

  // k_zz
  const k_zz = Math.min(
    Cm_z * (1 + (2 * lambda_bar_z - 0.6) * n_z),
    Cm_z * (1 + 1.4 * n_z),
  );

  // k_yz = 0.6·k_zz for Method 1 (simplified)
  const k_yz = 0.6 * k_zz;

  // k_zy = 0.6·k_yy for Method 1 (simplified)
  const k_zy = 0.6 * k_yy;

  return { k_yy, k_yz, k_zy, k_zz };
}
