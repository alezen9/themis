/**
 * Equivalent uniform moment factors C_m.
 *
 * Method 2 (Annex B, Table B.3):
 * - linear moment distribution branch: C_m = 0.6 + 0.4 * psi
 * - lower bound: C_m >= 0.4
 *
 * Method 1 (Annex A, Table A.2):
 * - C_m,i,0 from the linear moment diagram branch.
 * - Then apply Annex A continuation rules for C_m,y / C_m,z / C_m,LT.
 */
import { throwInvalidInput } from "../errors";
const cmLinear = (psi: number) => 0.6 + 0.4 * psi;

/** Annex B / Method 2 C_m with Table B.3 lower bound. */
export const getCm = (psi: number) => {
  return Math.max(0.4, cmLinear(psi));
};

const compressionRatio = (N_Ed: number, N_cr: number) => {
  if (N_cr <= 0) throwInvalidInput("compressionRatio: N_cr must be > 0");
  return Math.abs(N_Ed) / N_cr;
};

/** Annex A / Method 1, Table A.2 linear moment branch for C_m,i,0. */
export const getCmMethod1 = (psi: number, N_Ed: number, N_cr_i: number) => {
  const ncr = compressionRatio(N_Ed, N_cr_i);
  return 0.79 + 0.21 * psi + 0.36 * (psi - 0.33) * ncr;
};

export type CmMethod1Inputs = {
  Cmy0: number;
  Cmz0: number;
  lambda_bar_0: number;
  C1: number;
  N_Ed: number;
  Ncr_z: number;
  Ncr_T?: number;
  Ncr_TF: number;
  a_LT: number;
  eta_y: number;
};

/**
 * Annex A (Table A.1 continuation): resolves C_m,y / C_m,z / C_m,LT.
 * This keeps Method 1 branching explicit inside the NDG graph.
 */
export const resolveCmMethod1 = ({
  Cmy0,
  Cmz0,
  lambda_bar_0,
  C1,
  N_Ed,
  Ncr_z,
  Ncr_T,
  Ncr_TF,
  a_LT,
  eta_y,
}: CmMethod1Inputs) => {
  const ncrZ = compressionRatio(N_Ed, Ncr_z);
  const ncrT = compressionRatio(N_Ed, Ncr_T ?? Ncr_TF);
  const ncrTF = compressionRatio(N_Ed, Ncr_TF);
  const branchLimit = 0.4 * (1 - ncrZ) * (1 - ncrTF);

  if (lambda_bar_0 <= 0.2 || C1 >= branchLimit) {
    return {
      Cm_y: Cmy0,
      Cm_z: Cmz0,
      Cm_LT: 1,
    };
  }

  const amp = (eta_y * a_LT) / (1 + eta_y * a_LT);
  const Cm_y = Cmy0 + (1 - Cmy0) * amp;
  const denom = (1 - ncrZ) * (1 - ncrT);
  if (denom <= 0) throwInvalidInput("resolveCmMethod1: invalid denominator for C_m,LT");
  const Cm_LT = Math.min((Cm_y ** 2 * a_LT) / denom, 1);

  return {
    Cm_y,
    Cm_z: Cmz0,
    Cm_LT,
  };
};

/** Annex B / Method 2 C_m from Table B.3 linear branch. */
export const getCmMethod2 = (psi: number) => {
  return getCm(psi);
};
