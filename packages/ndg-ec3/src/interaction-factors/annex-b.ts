/**
 * EC3 Annex B — Interaction factors (Method 2).
 * Table B.1 / B.2 for I-sections (Class 1 & 2).
 */

export interface AnnexBInput {
  N_Ed: number;
  chi_y: number;
  chi_z: number;
  chi_LT: number;
  N_Rk: number; // A·fy
  M_y_Rk: number; // Wpl_y·fy
  M_z_Rk: number; // Wpl_z·fy
  gamma_M1: number;
  Cm_y: number;
  Cm_z: number;
  Cm_LT: number;
  lambda_bar_y: number;
  lambda_bar_z: number;
}

export interface InteractionFactors {
  k_yy: number;
  k_yz: number;
  k_zy: number;
  k_zz: number;
}

/** Table B.1 — Interaction factors for members susceptible to torsional deformations. */
export function computeAnnexBFactors(input: AnnexBInput): InteractionFactors {
  const {
    N_Ed,
    chi_y,
    chi_z,
    N_Rk,
    gamma_M1,
    Cm_y,
    Cm_z,
    Cm_LT,
    lambda_bar_y,
    lambda_bar_z,
  } = input;

  const NbyRd = (chi_y * N_Rk) / gamma_M1;
  const NbzRd = (chi_z * N_Rk) / gamma_M1;

  // k_yy = C_my · (1 + (λ̄_y - 0.2) · N_Ed / (χ_y · N_Rk/γ_M1))
  //        ≤ C_my · (1 + 0.8 · N_Ed / (χ_y · N_Rk/γ_M1))
  const k_yy = Math.min(
    Cm_y * (1 + (lambda_bar_y - 0.2) * (N_Ed / NbyRd)),
    Cm_y * (1 + 0.8 * (N_Ed / NbyRd)),
  );

  // k_zz = C_mz · (1 + (2λ̄_z - 0.6) · N_Ed / (χ_z · N_Rk/γ_M1))
  //        ≤ C_mz · (1 + 1.4 · N_Ed / (χ_z · N_Rk/γ_M1))
  const k_zz = Math.min(
    Cm_z * (1 + (2 * lambda_bar_z - 0.6) * (N_Ed / NbzRd)),
    Cm_z * (1 + 1.4 * (N_Ed / NbzRd)),
  );

  // k_yz = 0.6 · k_zz
  const k_yz = 0.6 * k_zz;

  // k_zy = (1 - 0.1·λ̄_z / (C_mLT - 0.25) · N_Ed / (χ_z · N_Rk/γ_M1))
  //        ≥ (1 - 0.1 / (C_mLT - 0.25) · N_Ed / (χ_z · N_Rk/γ_M1))
  const CmLT_term = Cm_LT - 0.25;
  const k_zy = Math.max(
    1 - (0.1 * lambda_bar_z) / CmLT_term * (N_Ed / NbzRd),
    1 - 0.1 / CmLT_term * (N_Ed / NbzRd),
  );

  return { k_yy, k_yz, k_zy, k_zz };
}
