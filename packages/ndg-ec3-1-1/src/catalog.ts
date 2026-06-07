import type { NodeMeta } from "@ndg/ndg-core";

type InputCatalogEntry = {
  symbol?: string;
  unit?: string;
  valueType: "number" | "string" | "boolean";
  values?: readonly (string | number | boolean)[];
  positive?: boolean;
};

export const userInputCatalog: Record<string, InputCatalogEntry> = {
  shape: { valueType: "string", values: ["I", "RHS", "CHS"] },
  fabrication_type: {
    valueType: "string",
    values: ["rolled", "welded", "cold-formed", "hot-formed"],
  },
  section_class: { valueType: "number", values: [1, 2, 3] },

  N_Ed_N: { symbol: "N_{Ed}", unit: "N", valueType: "number" },
  V_y_Ed_N: { symbol: "V_{y,Ed}", unit: "N", valueType: "number" },
  V_z_Ed_N: { symbol: "V_{z,Ed}", unit: "N", valueType: "number" },
  M_y_Ed_Nmm: { symbol: "M_{y,Ed}", unit: "N{\\cdot}mm", valueType: "number" },
  M_z_Ed_Nmm: { symbol: "M_{z,Ed}", unit: "N{\\cdot}mm", valueType: "number" },
  T_Ed_Nmm: { symbol: "T_{Ed}", unit: "N{\\cdot}mm", valueType: "number" },

  L_mm: { symbol: "L", unit: "mm", valueType: "number", positive: true },

  A_mm2: { symbol: "A", unit: "mm^2", valueType: "number", positive: true },
  Iy_mm4: { symbol: "I_y", unit: "mm^4", valueType: "number", positive: true },
  Iz_mm4: { symbol: "I_z", unit: "mm^4", valueType: "number", positive: true },
  Wpl_y_mm3: {
    symbol: "W_{pl,y}",
    unit: "mm^3",
    valueType: "number",
    positive: true,
  },
  Wpl_z_mm3: {
    symbol: "W_{pl,z}",
    unit: "mm^3",
    valueType: "number",
    positive: true,
  },
  Wel_y_mm3: {
    symbol: "W_{el,y}",
    unit: "mm^3",
    valueType: "number",
    positive: true,
  },
  Wel_z_mm3: {
    symbol: "W_{el,z}",
    unit: "mm^3",
    valueType: "number",
    positive: true,
  },
  Av_y_mm2: {
    symbol: "A_{v,y}",
    unit: "mm^2",
    valueType: "number",
    positive: true,
  },
  Av_z_mm2: {
    symbol: "A_{v,z}",
    unit: "mm^2",
    valueType: "number",
    positive: true,
  },
  S_y_mm3: { symbol: "S_y", unit: "mm^3", valueType: "number", positive: true },
  S_z_mm3: { symbol: "S_z", unit: "mm^3", valueType: "number", positive: true },
  It_mm4: { symbol: "I_t", unit: "mm^4", valueType: "number", positive: true },
  Iw_mm6: { symbol: "I_w", unit: "mm^6", valueType: "number", positive: true },
  centroid_y_mm: {
    symbol: "y_c",
    unit: "mm",
    valueType: "number",
    positive: true,
  },
  centroid_z_mm: {
    symbol: "z_c",
    unit: "mm",
    valueType: "number",
    positive: true,
  },

  "i_geometry.h_mm": {
    symbol: "h",
    unit: "mm",
    valueType: "number",
    positive: true,
  },
  "i_geometry.b_mm": {
    symbol: "b",
    unit: "mm",
    valueType: "number",
    positive: true,
  },
  "i_geometry.tw_mm": {
    symbol: "t_w",
    unit: "mm",
    valueType: "number",
    positive: true,
  },
  "i_geometry.tf_mm": {
    symbol: "t_f",
    unit: "mm",
    valueType: "number",
    positive: true,
  },
  "i_geometry.r_mm": {
    symbol: "r",
    unit: "mm",
    valueType: "number",
    positive: true,
  },
  "rhs_geometry.h_mm": {
    symbol: "h",
    unit: "mm",
    valueType: "number",
    positive: true,
  },
  "rhs_geometry.b_mm": {
    symbol: "b",
    unit: "mm",
    valueType: "number",
    positive: true,
  },
  "rhs_geometry.tw_mm": {
    symbol: "t_w",
    unit: "mm",
    valueType: "number",
    positive: true,
  },
  "rhs_geometry.ri_mm": {
    symbol: "r_i",
    unit: "mm",
    valueType: "number",
    positive: true,
  },
  "rhs_geometry.ro_mm": {
    symbol: "r_o",
    unit: "mm",
    valueType: "number",
    positive: true,
  },
  "chs_geometry.d_mm": {
    symbol: "d",
    unit: "mm",
    valueType: "number",
    positive: true,
  },
  "chs_geometry.t_mm": {
    symbol: "t",
    unit: "mm",
    valueType: "number",
    positive: true,
  },

  fy_MPa: { symbol: "f_y", unit: "MPa", valueType: "number" },
  fu_MPa: { symbol: "f_u", unit: "MPa", valueType: "number" },

  f_method: {
    symbol: "f",
    valueType: "string",
    values: ["default-equation", "1"],
  },
  interaction_factor_method: {
    valueType: "string",
    values: ["both", "method1", "method2", "any"],
  },
  buckling_curves_LT_policy: {
    valueType: "string",
    values: ["default-rolled-welded", "general"],
  },

  k_y: { symbol: "k_y", valueType: "number" },
  k_z: { symbol: "k_z", valueType: "number" },
  M_y_Ed_shape: {
    valueType: "string",
    values: ["uniform", "linear", "parabolic", "triangular"],
  },
  psi_y: { symbol: "\\psi_y", valueType: "number" },
  support_condition_y: {
    valueType: "string",
    values: ["pinned-pinned", "fixed-pinned", "pinned-fixed", "fixed-fixed"],
  },
  M_z_Ed_shape: {
    valueType: "string",
    values: ["uniform", "linear", "parabolic", "triangular"],
  },
  psi_z: { symbol: "\\psi_z", valueType: "number" },
  support_condition_z: {
    valueType: "string",
    values: ["pinned-pinned", "fixed-pinned", "pinned-fixed", "fixed-fixed"],
  },
  include_torsional_modes: { valueType: "boolean" },
  k_T: { symbol: "k_T", valueType: "number" },
  k_LT: { symbol: "k_{LT}", valueType: "number" },
  M_y_Ed_shape_LT: {
    valueType: "string",
    values: ["uniform", "linear", "parabolic", "triangular"],
  },
  psi_y_LT: { symbol: "\\psi_{y,LT}", valueType: "number" },
  support_condition_LT: {
    valueType: "string",
    values: ["pinned-pinned", "fixed-pinned", "pinned-fixed", "fixed-fixed"],
  },
  load_LT: {
    valueType: "string",
    values: ["top-flange", "centroid", "bottom-flange"],
  },
};

export const userInputKeys = Object.keys(userInputCatalog);

export const tableKeyValues: Record<string, readonly (string | number)[]> = {
  buckling_curve_y: ["a0", "a", "b", "c", "d"],
  buckling_curve_z: ["a0", "a", "b", "c", "d"],
  buckling_curve_LT: ["a0", "a", "b", "c", "d"],
};

export const tableKeys = Object.keys(tableKeyValues);

type CoefficientCatalogEntry = {
  symbol?: string;
  unit?: string;
  meta?: NodeMeta;
};

export const coefficientCatalog: Record<string, CoefficientCatalogEntry> = {
  gamma_M0: {
    symbol: "\\gamma_{M0}",
    meta: {
      sectionRef: "6.1",
      paragraphRef: "(1)",
      subParagraphRef: "NOTE 2B",
    },
  },
  gamma_M1: {
    symbol: "\\gamma_{M1}",
    meta: {
      sectionRef: "6.1",
      paragraphRef: "(1)",
      subParagraphRef: "NOTE 2B",
    },
  },
  eta: {
    symbol: "\\eta",
    meta: { sectionRef: "6.2.6", paragraphRef: "(3)", subParagraphRef: "NOTE" },
  },
  lambda_LT_0: {
    symbol: "\\bar{\\lambda}_{LT,0}",
    meta: { sectionRef: "6.3.2.3", paragraphRef: "(1)" },
  },
  beta_LT: {
    symbol: "\\beta_{LT}",
    meta: { sectionRef: "6.3.2.3", paragraphRef: "(1)" },
  },
};

export const coefficientKeys = Object.keys(coefficientCatalog);
