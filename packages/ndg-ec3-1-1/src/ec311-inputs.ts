export type Ec311Inputs = {
  shape: "I" | "RHS" | "CHS";
  fabrication_type: "rolled" | "welded" | "hot-formed" | "cold-formed";
  section_class: 1 | 2 | 3; // 4 not supported atm

  N_Ed_N: number;
  V_y_Ed_N: number;
  V_z_Ed_N: number;
  M_y_Ed_Nmm: number;
  M_z_Ed_Nmm: number;
  T_Ed_Nmm: number;

  L_mm: number;

  A_mm2: number;
  Iy_mm4: number;
  Iz_mm4: number;
  Wpl_y_mm3: number;
  Wpl_z_mm3: number;
  Wel_y_mm3: number;
  Wel_z_mm3: number;
  Av_y_mm2: number;
  Av_z_mm2: number;
  It_mm4: number;
  Iw_mm6: number;
  centroid_y_mm: number;
  centroid_z_mm: number;

  i_geometry: {
    h_mm: number;
    b_mm: number;
    tw_mm: number;
    tf_mm: number;
    r_mm: number;
  };
  rhs_geometry: {
    h_mm: number;
    b_mm: number;
    tw_mm: number;
    ri_mm: number;
    ro_mm: number;
  };
  chs_geometry: { d_mm: number; t_mm: number };

  fy_MPa: number;
  fu_MPa: number;

  gamma_M0: number;
  gamma_M1: number;
  eta: number;
  lambda_LT_0: number;
  beta_LT: number;
  f_method?: string | number;
  interaction_factor_method: "both" | "method1" | "method2" | "any";
  buckling_curves_LT_policy: "default-rolled-welded" | "general";

  k_y: number;
  k_z: number;
  M_y_Ed_shape: string;
  psi_y?: number;
  support_condition_y?: string;
  M_z_Ed_shape: string;
  psi_z?: number;
  support_condition_z?: string;

  include_torsional_modes: boolean;
  k_T?: number;
  k_LT?: number;
  M_y_Ed_shape_LT?: string;
  psi_y_LT?: number;
  support_condition_LT?: string;
  load_LT?: string;

  buckling_curve_y: string;
  buckling_curve_z: string;
  buckling_curve_LT: string;
};
