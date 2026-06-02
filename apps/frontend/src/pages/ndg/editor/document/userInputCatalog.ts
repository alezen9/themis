type CatalogEntry = {
  symbol?: string;
  unit?: string;
  valueType: "number" | "string";
};

export const userInputCatalog: Record<string, CatalogEntry> = {
  shape: { valueType: "string" },
  fabrication_type: { valueType: "string" },
  section_class: { valueType: "number" },

  N_Ed_N: { symbol: "N_{Ed}", unit: "N", valueType: "number" },
  V_y_Ed_N: { symbol: "V_{y,Ed}", unit: "N", valueType: "number" },
  V_z_Ed_N: { symbol: "V_{z,Ed}", unit: "N", valueType: "number" },
  M_y_Ed_Nmm: { symbol: "M_{y,Ed}", unit: "N{\\cdot}mm", valueType: "number" },
  M_z_Ed_Nmm: { symbol: "M_{z,Ed}", unit: "N{\\cdot}mm", valueType: "number" },

  L_mm: { symbol: "L", unit: "mm", valueType: "number" },

  A_mm2: { symbol: "A", unit: "mm^2", valueType: "number" },
  Iy_mm4: { symbol: "I_y", unit: "mm^4", valueType: "number" },
  Iz_mm4: { symbol: "I_z", unit: "mm^4", valueType: "number" },
  Wpl_y_mm3: { symbol: "W_{pl,y}", unit: "mm^3", valueType: "number" },
  Wpl_z_mm3: { symbol: "W_{pl,z}", unit: "mm^3", valueType: "number" },
  Wel_y_mm3: { symbol: "W_{el,y}", unit: "mm^3", valueType: "number" },
  Wel_z_mm3: { symbol: "W_{el,z}", unit: "mm^3", valueType: "number" },
  Av_y_mm2: { symbol: "A_{v,y}", unit: "mm^2", valueType: "number" },
  Av_z_mm2: { symbol: "A_{v,z}", unit: "mm^2", valueType: "number" },
  It_mm4: { symbol: "I_t", unit: "mm^4", valueType: "number" },
  Iw_mm6: { symbol: "I_w", unit: "mm^6", valueType: "number" },
  centroid_y_mm: { symbol: "y_c", unit: "mm", valueType: "number" },
  centroid_z_mm: { symbol: "z_c", unit: "mm", valueType: "number" },

  "i_geometry.h_mm": { symbol: "h", unit: "mm", valueType: "number" },
  "i_geometry.b_mm": { symbol: "b", unit: "mm", valueType: "number" },
  "i_geometry.tw_mm": { symbol: "t_w", unit: "mm", valueType: "number" },
  "i_geometry.tf_mm": { symbol: "t_f", unit: "mm", valueType: "number" },
  "i_geometry.r_mm": { symbol: "r", unit: "mm", valueType: "number" },
  "rhs_geometry.h_mm": { symbol: "h", unit: "mm", valueType: "number" },
  "rhs_geometry.b_mm": { symbol: "b", unit: "mm", valueType: "number" },
  "rhs_geometry.tw_mm": { symbol: "t_w", unit: "mm", valueType: "number" },
  "rhs_geometry.ri_mm": { symbol: "r_i", unit: "mm", valueType: "number" },
  "rhs_geometry.ro_mm": { symbol: "r_o", unit: "mm", valueType: "number" },
  "chs_geometry.d_mm": { symbol: "d", unit: "mm", valueType: "number" },
  "chs_geometry.t_mm": { symbol: "t", unit: "mm", valueType: "number" },

  fy_MPa: { symbol: "f_y", unit: "MPa", valueType: "number" },
  fu_MPa: { symbol: "f_u", unit: "MPa", valueType: "number" },

  gamma_M0: { symbol: "\\gamma_{M0}", valueType: "number" },
  gamma_M1: { symbol: "\\gamma_{M1}", valueType: "number" },
  eta: { symbol: "\\eta", valueType: "number" },
  lambda_LT_0: { symbol: "\\bar{\\lambda}_{LT,0}", valueType: "number" },
  beta_LT: { symbol: "\\beta_{LT}", valueType: "number" },
  f_method: { symbol: "f", valueType: "string" },
  interaction_factor_method: { valueType: "string" },
  buckling_curves_LT_policy: { valueType: "string" },

  k_y: { symbol: "k_y", valueType: "number" },
  k_z: { symbol: "k_z", valueType: "number" },
  M_y_Ed_shape: { valueType: "string" },
  psi_y: { symbol: "\\psi_y", valueType: "number" },
  support_condition_y: { valueType: "string" },
  M_z_Ed_shape: { valueType: "string" },
  psi_z: { symbol: "\\psi_z", valueType: "number" },
  support_condition_z: { valueType: "string" },
  include_torsional_modes: { valueType: "string" },
  k_T: { symbol: "k_T", valueType: "number" },
  k_LT: { symbol: "k_{LT}", valueType: "number" },
  M_y_Ed_shape_LT: { valueType: "string" },
  psi_y_LT: { symbol: "\\psi_{y,LT}", valueType: "number" },
  support_condition_LT: { valueType: "string" },
  load_LT: { valueType: "string" },
};
