/**
 * Individual interaction-factor computations for beam-column checks (§6.3.3).
 *
 * Method 2 (Annex B): explicit Table B.1/B.2 expressions.
 * Method 1 (Annex A): simplified explicit branch used by this package for
 * deterministic node evaluation.
 */
import { throwInvalidInput } from "../errors";

/** Table B.1 -- k_yy for Class 1 & 2 I-sections. */
export const computeKyy = (Cm_y: number, lambda_bar_y: number, N_Ed: number, NbyRd: number) => {
  if (NbyRd <= 0) throwInvalidInput("computeKyy: NbyRd must be > 0");
  const n = Math.abs(N_Ed) / NbyRd;
  return Math.min(
    Cm_y * (1 + (Math.min(lambda_bar_y, 1.0) - 0.2) * n),
    Cm_y * (1 + 0.8 * n),
  );
};

/** Table B.1 -- k_zz for Class 1 & 2 I-sections. */
export const computeKzz = (Cm_z: number, lambda_bar_z: number, N_Ed: number, NbzRd: number) => {
  if (NbzRd <= 0) throwInvalidInput("computeKzz: NbzRd must be > 0");
  const n = Math.abs(N_Ed) / NbzRd;
  return Math.min(
    Cm_z * (1 + (2 * Math.min(lambda_bar_z, 1.0) - 0.6) * n),
    Cm_z * (1 + 1.4 * n),
  );
};

/** Method 2 (Annex B): k_yz = 0.6 * k_zz. */
export const computeKyzMethod2 = (k_zz: number) => {
  return 0.6 * k_zz;
};

/**
 * Method 2 (Annex B), Table B.2: k_zy for I/H sections susceptible to torsional deformations.
 *
 * λ̄_z < 0.4  (eq. 132): k_zy = max(0.6 + λ̄_z,  1 − 0.1·λ̄_z/(CmLT−0.25)·n)
 * λ̄_z ≥ 0.4  (eq. 133): k_zy = 1 − 0.1·min(λ̄_z,1)/(CmLT−0.25)·n
 *                               ≥ 1 − 0.1/(CmLT−0.25)·n
 */
export const computeKzyMethod2 = (Cm_LT: number, lambda_bar_z: number, N_Ed: number, NbzRd: number) => {
  if (NbzRd <= 0) throwInvalidInput("computeKzyMethod2: NbzRd must be > 0");
  if (Cm_LT === 0.25) throwInvalidInput("computeKzyMethod2: Cm_LT = 0.25 causes division by zero");
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

export type Method1Class12Inputs = {
  Cm_y: number;
  Cm_z: number;
  Cm_LT: number;
  N_Ed: number;
  Ncr_y: number;
  Ncr_z: number;
  n_pl: number;
  lambda_bar_y: number;
  lambda_bar_z: number;
  lambda_bar_0: number;
  a_LT: number;
  chi_LT: number;
  M_y_Ed: number;
  M_z_Ed: number;
  Mpl_y_Rd: number;
  Mpl_z_Rd: number;
  wy: number;
  wz: number;
  Wel_y: number;
  Wel_z: number;
  Wpl_y: number;
  Wpl_z: number;
};

export type Method1Class12CFactors = {
  lambda_bar_max: number;
  b_LT: number;
  c_LT: number;
  d_LT: number;
  e_LT: number;
  C_yy: number;
  C_yz: number;
  C_zy: number;
  C_zz: number;
};

const ensurePositive = (value: number, label: string) => {
  if (!Number.isFinite(value) || value <= 0) {
    throwInvalidInput(`computeMethod1Class12CFactors: ${label} must be > 0`);
  }
};

/**
 * Annex A (Method 1), Class 1/2 branch:
 * computes auxiliary correction factors C_yy, C_yz, C_zy, C_zz.
 */
export const computeMethod1Class12CFactors = ({
  Cm_y,
  Cm_z,
  n_pl,
  lambda_bar_y,
  lambda_bar_z,
  lambda_bar_0,
  a_LT,
  chi_LT,
  M_y_Ed,
  M_z_Ed,
  Mpl_y_Rd,
  Mpl_z_Rd,
  wy,
  wz,
  Wel_y,
  Wel_z,
  Wpl_y,
  Wpl_z,
}: Omit<Method1Class12Inputs, "Cm_LT" | "N_Ed" | "Ncr_y" | "Ncr_z">): Method1Class12CFactors => {
  ensurePositive(chi_LT, "chi_LT");
  ensurePositive(Mpl_y_Rd, "Mpl_y_Rd");
  ensurePositive(Mpl_z_Rd, "Mpl_z_Rd");
  ensurePositive(wy, "wy");
  ensurePositive(wz, "wz");
  ensurePositive(Wpl_y, "Wpl_y");
  ensurePositive(Wpl_z, "Wpl_z");
  ensurePositive(Wel_y, "Wel_y");
  ensurePositive(Wel_z, "Wel_z");

  const lambda_bar_max = Math.max(lambda_bar_y, lambda_bar_z);
  const lambda0Sq = lambda_bar_0 ** 2;
  const absMy = Math.abs(M_y_Ed);
  const absMz = Math.abs(M_z_Ed);

  const b_LT = (0.5 * a_LT * lambda0Sq * absMy * absMz) / (chi_LT * Mpl_y_Rd * Mpl_z_Rd);
  const c_LT = (10 * a_LT * lambda0Sq * absMy) / ((5 + lambda_bar_z * Cm_y) * chi_LT * Mpl_y_Rd);
  const d_LT = (2 * a_LT * lambda0Sq * absMy * absMz)
    / ((0.1 + lambda_bar_z * Cm_y) * chi_LT * Mpl_y_Rd * Cm_z * Mpl_z_Rd);
  const e_LT = (1.7 * a_LT * lambda0Sq * absMy) / ((0.1 + lambda_bar_z * Cm_y) * chi_LT * Mpl_y_Rd);

  const CyyRaw = 1 + (wy - 1) * (
    2
    - (1.6 / wy) * Cm_y * lambda_bar_max
    - ((1.6 / wy) ** 2) * (Cm_y ** 2) * (lambda_bar_max ** 2) * n_pl
    - b_LT
  );
  const CyzRaw = 1 + (wz - 1) * (
    2
    - (14 / wz ** 5) * (Cm_z ** 2) * (lambda_bar_max ** 2) * n_pl
    - c_LT
  );
  const CzyRaw = 1 + (wy - 1) * (
    2
    - (14 / wy ** 5) * (Cm_y ** 2) * (lambda_bar_max ** 2) * n_pl
    - d_LT
  );
  const CzzRaw = 1 + (wz - 1) * (
    2
    - (1.6 / wz) * Cm_z * lambda_bar_max
    - ((1.6 / wz) ** 2) * (Cm_z ** 2) * (lambda_bar_max ** 2) * n_pl
    - e_LT
  );

  const C_yy = Math.max(CyyRaw, Wel_y / Wpl_y);
  const C_yz = Math.max(CyzRaw, (0.6 * wz * Wel_z) / (wy * Wpl_z));
  const C_zy = Math.max(CzyRaw, (0.6 * wy * Wel_y) / (wz * Wpl_y));
  const C_zz = Math.max(CzzRaw, Wel_z / Wpl_z);

  return {
    lambda_bar_max,
    b_LT,
    c_LT,
    d_LT,
    e_LT,
    C_yy,
    C_yz,
    C_zy,
    C_zz,
  };
};

export type Method1Class12KFactors = {
  k_yy: number;
  k_yz: number;
  k_zy: number;
  k_zz: number;
};

/**
 * Annex A (Method 1), Class 1/2 branch:
 * interaction factors from C_m terms, Euler denominators and C_ij auxiliary factors.
 */
export const computeMethod1Class12KFactors = ({
  Cm_y,
  Cm_z,
  Cm_LT,
  N_Ed,
  Ncr_y,
  Ncr_z,
  wy,
  wz,
  C_yy,
  C_yz,
  C_zy,
  C_zz,
}: {
  Cm_y: number;
  Cm_z: number;
  Cm_LT: number;
  N_Ed: number;
  Ncr_y: number;
  Ncr_z: number;
  wy: number;
  wz: number;
  C_yy: number;
  C_yz: number;
  C_zy: number;
  C_zz: number;
}): Method1Class12KFactors => {
  ensurePositive(Ncr_y, "Ncr_y");
  ensurePositive(Ncr_z, "Ncr_z");
  ensurePositive(wy, "wy");
  ensurePositive(wz, "wz");
  ensurePositive(C_yy, "C_yy");
  ensurePositive(C_yz, "C_yz");
  ensurePositive(C_zy, "C_zy");
  ensurePositive(C_zz, "C_zz");

  const denomY = 1 - Math.abs(N_Ed) / Ncr_y;
  const denomZ = 1 - Math.abs(N_Ed) / Ncr_z;
  if (denomY <= 0 || denomZ <= 0) {
    throwInvalidInput("computeMethod1Class12KFactors: invalid Euler denominator");
  }

  return {
    k_yy: (Cm_y * Cm_LT * C_yy) / denomY,
    k_yz: (Cm_z * C_yz * 0.6 * (wz / wy)) / denomZ,
    k_zy: (Cm_y * Cm_LT * C_zy * 0.6 * (wy / wz)) / denomY,
    k_zz: (Cm_z * C_zz) / denomZ,
  };
};

/**
 * Method 1 (Annex A) simplified expressions.
 * k-factors are built from C_m terms and Euler-force denominators.
 */
export const computeKyyMethod1 = (Cm_y: number, Cm_LT: number, N_Ed: number, Ncr_y: number) => {
  if (Ncr_y <= 0) throwInvalidInput("computeKyyMethod1: Ncr_y must be > 0");
  const denom = 1 - Math.abs(N_Ed) / Ncr_y;
  if (denom <= 0) throwInvalidInput("computeKyyMethod1: denominator (1-NEd/Ncr,y) must be > 0");
  return (Cm_y * Cm_LT) / denom;
};

export const computeKzzMethod1 = (Cm_z: number, N_Ed: number, Ncr_z: number) => {
  if (Ncr_z <= 0) throwInvalidInput("computeKzzMethod1: Ncr_z must be > 0");
  const denom = 1 - Math.abs(N_Ed) / Ncr_z;
  if (denom <= 0) throwInvalidInput("computeKzzMethod1: denominator (1-NEd/Ncr,z) must be > 0");
  return Cm_z / denom;
};

export const computeKyzMethod1 = (k_zz: number) => {
  return 0.6 * k_zz;
};

export const computeKzyMethod1 = (k_yy: number) => {
  return 0.6 * k_yy;
};
