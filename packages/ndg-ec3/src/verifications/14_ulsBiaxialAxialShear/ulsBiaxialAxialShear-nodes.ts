import { defineNodes } from "@ndg/ndg-core";

export const nodes = defineNodes([
  {
    type: "user-input",
    key: "M_y_Ed",
    valueType: { type: "number" },
    id: "M_y_Ed",
    name: "Design bending moment y-y",
    unit: "N·mm",
    children: [],
  },
  {
    type: "user-input",
    key: "M_z_Ed",
    valueType: { type: "number" },
    id: "M_z_Ed",
    name: "Design bending moment z-z",
    unit: "N·mm",
    children: [],
  },
  {
    type: "user-input",
    key: "N_Ed",
    valueType: { type: "number" },
    id: "N_Ed",
    name: "Design axial force",
    unit: "N",
    children: [],
  },
  {
    type: "user-input",
    key: "V_z_Ed",
    valueType: { type: "number" },
    id: "V_z_Ed",
    name: "Design shear force z",
    unit: "N",
    children: [],
  },
  {
    type: "user-input",
    key: "V_y_Ed",
    valueType: { type: "number" },
    id: "V_y_Ed",
    name: "Design shear force y",
    unit: "N",
    children: [],
  },
  {
    type: "user-input",
    key: "A",
    valueType: { type: "number" },
    id: "A",
    name: "Cross-sectional area",
    unit: "mm²",
    children: [],
  },
  {
    type: "user-input",
    key: "b",
    valueType: { type: "number" },
    id: "b",
    name: "Flange width",
    unit: "mm",
    children: [],
  },
  {
    type: "user-input",
    key: "h",
    valueType: { type: "number" },
    id: "h",
    name: "Section depth",
    unit: "mm",
    children: [],
  },
  {
    type: "user-input",
    key: "tf",
    valueType: { type: "number" },
    id: "tf",
    name: "Flange thickness",
    unit: "mm",
    children: [],
  },
  {
    type: "user-input",
    key: "Wpl_y",
    valueType: { type: "number" },
    id: "Wpl_y",
    name: "Plastic section modulus y-y",
    unit: "mm³",
    children: [],
  },
  {
    type: "user-input",
    key: "Wpl_z",
    valueType: { type: "number" },
    id: "Wpl_z",
    name: "Plastic section modulus z-z",
    unit: "mm³",
    children: [],
  },
  {
    type: "user-input",
    key: "Wel_z",
    valueType: { type: "number" },
    id: "Wel_z",
    name: "Elastic section modulus z-z",
    unit: "mm³",
    children: [],
  },
  {
    type: "user-input",
    key: "Av_z",
    valueType: { type: "number" },
    id: "Av_z",
    name: "Shear area in z (approx web area)",
    unit: "mm²",
    children: [],
  },
  {
    type: "user-input",
    key: "Av_y",
    valueType: { type: "number" },
    id: "Av_y",
    name: "Shear area in y (flanges)",
    unit: "mm²",
    children: [],
  },
  {
    type: "user-input",
    key: "tw",
    valueType: { type: "number" },
    id: "tw",
    name: "Web thickness",
    symbol: "t_w",
    unit: "mm",
    children: [],
  },
  {
    type: "user-input",
    key: "section_shape",
    valueType: { type: "string", literal: ["I", "RHS", "CHS"] },
    id: "section_shape",
    name: "Section shape family (I, CHS, RHS)",
    children: [],
  },
  {
    type: "user-input",
    key: "section_class",
    valueType: { type: "number" },
    id: "section_class",
    name: "Section class (1, 2, 3)",
    children: [],
  },
  {
    type: "user-input",
    key: "fy",
    valueType: { type: "number" },
    id: "fy",
    name: "Yield strength",
    unit: "MPa",
    children: [],
  },
  {
    type: "coefficient",
    key: "gamma_M0",
    valueType: { type: "number" },
    id: "gamma_M0",
    name: "Partial safety factor",
    symbol: "\\gamma_{M0}",
    meta: {
      sectionRef: "6.1",
    },
    children: [],
  },
  {
    type: "formula",
    key: "V_pl_z_Rd",
    valueType: { type: "number" },
    id: "V_pl_z_Rd",
    name: "Plastic shear resistance z",
    symbol: "V_{pl,z,Rd}",
    expression: "A_{v,z} f_y / (\\sqrt{3} \\gamma_{M0})",
    unit: "N",
    meta: {
      sectionRef: "6.2.6",
      formulaRef: "(6.18)",
    },
    children: [
      {
        nodeId: "Av_z",
      },
      {
        nodeId: "fy",
      },
      {
        nodeId: "gamma_M0",
      },
    ],
  },
  {
    type: "formula",
    key: "V_pl_y_Rd",
    valueType: { type: "number" },
    id: "V_pl_y_Rd",
    name: "Plastic shear resistance y",
    symbol: "V_{pl,y,Rd}",
    expression: "A_{v,y} f_y / (\\sqrt{3} \\gamma_{M0})",
    unit: "N",
    meta: {
      sectionRef: "6.2.6",
      formulaRef: "(6.18)",
    },
    children: [
      {
        nodeId: "Av_y",
      },
      {
        nodeId: "fy",
      },
      {
        nodeId: "gamma_M0",
      },
    ],
  },
  {
    type: "derived",
    key: "abs_V_z_Ed",
    valueType: { type: "number" },
    id: "abs_V_z_Ed",
    name: "Absolute design shear force z",
    children: [
      {
        nodeId: "V_z_Ed",
      },
    ],
  },
  {
    type: "derived",
    key: "abs_V_y_Ed",
    valueType: { type: "number" },
    id: "abs_V_y_Ed",
    name: "Absolute design shear force y",
    children: [
      {
        nodeId: "V_y_Ed",
      },
    ],
  },
  {
    type: "derived",
    key: "rho_z",
    valueType: { type: "number" },
    id: "rho_z",
    name: "Shear interaction z",
    expression: "|V_{z,Ed}|/V_{pl,z,Rd}\\le0.5?0:(2|V_{z,Ed}|/V_{pl,z,Rd}-1)^2",
    children: [
      {
        nodeId: "abs_V_z_Ed",
      },
      {
        nodeId: "V_pl_z_Rd",
      },
    ],
  },
  {
    type: "derived",
    key: "rho_y",
    valueType: { type: "number" },
    id: "rho_y",
    name: "Shear interaction y",
    expression: "|V_{y,Ed}|/V_{pl,y,Rd}\\le0.5?0:(2|V_{y,Ed}|/V_{pl,y,Rd}-1)^2",
    children: [
      {
        nodeId: "abs_V_y_Ed",
      },
      {
        nodeId: "V_pl_y_Rd",
      },
    ],
  },
  {
    type: "formula",
    key: "N_pl_Rd",
    valueType: { type: "number" },
    id: "N_pl_Rd",
    name: "Plastic resistance",
    symbol: "N_{pl,Rd}",
    expression: "A f_y / \\gamma_{M0}",
    unit: "N",
    meta: {
      sectionRef: "6.2.4",
      formulaRef: "(6.6)",
    },
    children: [
      {
        nodeId: "A",
      },
      {
        nodeId: "fy",
      },
      {
        nodeId: "gamma_M0",
      },
    ],
  },
  {
    type: "derived",
    key: "abs_N_Ed",
    valueType: { type: "number" },
    id: "abs_N_Ed",
    name: "Absolute design axial force",
    children: [
      {
        nodeId: "N_Ed",
      },
    ],
  },
  {
    type: "derived",
    key: "n",
    valueType: { type: "number" },
    id: "n",
    name: "Axial force ratio",
    expression: "|N_{Ed}|/N_{pl,Rd}",
    children: [
      {
        nodeId: "abs_N_Ed",
      },
      {
        nodeId: "N_pl_Rd",
      },
    ],
  },
  {
    type: "derived",
    key: "a_w_raw",
    valueType: { type: "number" },
    id: "a_w_raw",
    name: "Raw reduction parameter a_y",
    expression: "I:(A-A_{v,y})/A; else:A_{v,z}/A",
    children: [
      {
        nodeId: "section_shape",
      },
      {
        nodeId: "A",
      },
      {
        nodeId: "Av_y",
      },
      {
        nodeId: "Av_z",
      },
    ],
  },
  {
    type: "derived",
    key: "a_w",
    valueType: { type: "number" },
    id: "a_w",
    name: "Web area ratio",
    expression: "min(a_w,0.5)",
    children: [
      {
        nodeId: "a_w_raw",
      },
    ],
  },
  {
    type: "derived",
    key: "a_f_raw",
    valueType: { type: "number" },
    id: "a_f_raw",
    name: "Raw reduction parameter a_z",
    expression: "I:(A-A_{v,y})/A; else:A_{v,z}/A",
    children: [
      {
        nodeId: "section_shape",
      },
      {
        nodeId: "A",
      },
      {
        nodeId: "Av_y",
      },
      {
        nodeId: "Av_z",
      },
    ],
  },
  {
    type: "derived",
    key: "a_f",
    valueType: { type: "number" },
    id: "a_f",
    name: "Flange area ratio",
    expression: "min(a_f,0.5)",
    children: [
      {
        nodeId: "a_f_raw",
      },
    ],
  },
  {
    type: "derived",
    key: "Wpl_y_eff",
    valueType: { type: "number" },
    id: "Wpl_y_eff",
    name: "Effective plastic modulus y",
    expression: "EC3 6.2.10 reduced-thickness model for I sections",
    unit: "mm³",
    children: [
      {
        nodeId: "section_shape",
      },
      {
        nodeId: "Wpl_y",
      },
      {
        nodeId: "b",
      },
      {
        nodeId: "h",
      },
      {
        nodeId: "tf",
      },
      {
        nodeId: "tw",
      },
      {
        nodeId: "rho_y",
      },
      {
        nodeId: "rho_z",
      },
      {
        nodeId: "Av_z",
      },
    ],
  },
  {
    type: "formula",
    key: "M_y_V_Rd",
    valueType: { type: "number" },
    id: "M_y_V_Rd",
    name: "Reduced plastic moment y-y allowing for shear",
    symbol: "M_{y,V,Rd}",
    expression: "W_{pl,y,eff}f_y/\\gamma_{M0}",
    unit: "N·mm",
    meta: {
      sectionRef: "6.2.10",
      formulaRef: "(6.45)",
    },
    children: [
      {
        nodeId: "Wpl_y_eff",
      },
      {
        nodeId: "fy",
      },
      {
        nodeId: "gamma_M0",
      },
    ],
  },
  {
    type: "derived",
    key: "axial_y_ratio",
    valueType: { type: "number" },
    id: "axial_y_ratio",
    name: "Raw axial factor y",
    expression: "(1-n)/(1-0.5a_w)",
    children: [
      {
        nodeId: "n",
      },
      {
        nodeId: "a_w",
      },
    ],
  },
  {
    type: "derived",
    key: "axial_y_factor",
    valueType: { type: "number" },
    id: "axial_y_factor",
    name: "Capped axial factor y",
    expression: "min(1,(1-n)/(1-0.5a_w))",
    children: [
      {
        nodeId: "axial_y_ratio",
      },
    ],
  },
  {
    type: "formula",
    key: "M_NV_y_Rd",
    valueType: { type: "number" },
    id: "M_NV_y_Rd",
    name: "Reduced plastic moment y-y (axial + shear)",
    symbol: "M_{NV,y,Rd}",
    expression: "M_{y,V,Rd}*min(1,(1-n)/(1-0.5a_w))",
    unit: "N·mm",
    meta: {
      sectionRef: "6.2.9.1",
      formulaRef: "(6.36)",
    },
    children: [
      {
        nodeId: "M_y_V_Rd",
      },
      {
        nodeId: "axial_y_factor",
      },
    ],
  },
  {
    type: "derived",
    key: "Wpl_z_web",
    valueType: { type: "number" },
    id: "Wpl_z_web",
    name: "Web contribution to plastic modulus about z-z",
    expression: "A_{v,z} t_w / 4",
    unit: "mm³",
    children: [
      {
        nodeId: "Av_z",
      },
      {
        nodeId: "tw",
      },
    ],
  },
  {
    type: "derived",
    key: "W_z_res",
    valueType: { type: "number" },
    id: "W_z_res",
    name: "Class-dependent section modulus for z bending",
    expression: "c=3?W_{el,z}:W_{pl,z}",
    children: [
      {
        nodeId: "section_class",
      },
      {
        nodeId: "Wpl_z",
      },
      {
        nodeId: "Wel_z",
      },
    ],
  },
  {
    type: "derived",
    key: "Wpl_z_eff",
    valueType: { type: "number" },
    id: "Wpl_z_eff",
    name: "Effective plastic modulus z",
    expression: "W_{res,z}-\\rho_y(W_{res,z}-W_{pl,z,web})",
    unit: "mm³",
    children: [
      {
        nodeId: "W_z_res",
      },
      {
        nodeId: "rho_y",
      },
      {
        nodeId: "Wpl_z_web",
      },
    ],
  },
  {
    type: "formula",
    key: "M_z_V_Rd",
    valueType: { type: "number" },
    id: "M_z_V_Rd",
    name: "Reduced plastic moment z-z allowing for shear",
    symbol: "M_{z,V,Rd}",
    expression: "[W_{res,z}-\\rho_y(W_{res,z}-W_{pl,z,web})]f_y/\\gamma_{M0}",
    unit: "N·mm",
    meta: {
      sectionRef: "6.2.8",
      formulaRef: "(6.30)",
    },
    children: [
      {
        nodeId: "Wpl_z_eff",
      },
      {
        nodeId: "fy",
      },
      {
        nodeId: "gamma_M0",
      },
    ],
  },
  {
    type: "derived",
    key: "axial_z_ratio",
    valueType: { type: "number" },
    id: "axial_z_ratio",
    name: "Raw axial ratio z",
    expression: "(n-a_f)/(1-a_f)",
    children: [
      {
        nodeId: "n",
      },
      {
        nodeId: "a_f",
      },
    ],
  },
  {
    type: "derived",
    key: "axial_z_factor",
    valueType: { type: "number" },
    id: "axial_z_factor",
    name: "Axial factor z",
    expression: "1-((n-a_f)/(1-a_f))^2",
    children: [
      {
        nodeId: "axial_z_ratio",
      },
    ],
  },
  {
    type: "derived",
    key: "n_le_af",
    valueType: { type: "number" },
    id: "n_le_af",
    name: "Branch selector n <= a_f",
    expression: "n\\le a_f ? 1 : 0",
    children: [
      {
        nodeId: "n",
      },
      {
        nodeId: "a_f",
      },
    ],
  },
  {
    type: "formula",
    key: "M_NV_z_Rd",
    valueType: { type: "number" },
    id: "M_NV_z_Rd",
    name: "Reduced plastic moment z-z (axial + shear)",
    symbol: "M_{NV,z,Rd}",
    expression: "M_{z,V,Rd}(n\\le a_f?1:1-((n-a_f)/(1-a_f))^2)",
    unit: "N·mm",
    meta: {
      sectionRef: "6.2.9.1",
      formulaRef: "(6.38)",
    },
    children: [
      {
        nodeId: "M_z_V_Rd",
      },
      {
        nodeId: "n_le_af",
      },
      {
        nodeId: "axial_z_factor",
      },
    ],
  },
  {
    type: "derived",
    key: "alpha_biax",
    valueType: { type: "number" },
    id: "alpha_biax",
    name: "Biaxial exponent alpha",
    children: [
      {
        nodeId: "section_shape",
      },
      {
        nodeId: "n",
      },
    ],
  },
  {
    type: "derived",
    key: "beta_biax",
    valueType: { type: "number" },
    id: "beta_biax",
    name: "Biaxial exponent beta",
    children: [
      {
        nodeId: "section_shape",
      },
      {
        nodeId: "n",
      },
    ],
  },
  {
    type: "derived",
    key: "abs_M_y_Ed",
    valueType: { type: "number" },
    id: "abs_M_y_Ed",
    name: "Absolute design moment y",
    children: [
      {
        nodeId: "M_y_Ed",
      },
    ],
  },
  {
    type: "derived",
    key: "abs_M_z_Ed",
    valueType: { type: "number" },
    id: "abs_M_z_Ed",
    name: "Absolute design moment z",
    children: [
      {
        nodeId: "M_z_Ed",
      },
    ],
  },
  {
    type: "derived",
    key: "ratio_y",
    valueType: { type: "number" },
    id: "ratio_y",
    name: "Normalized bending ratio y",
    children: [
      {
        nodeId: "abs_M_y_Ed",
      },
      {
        nodeId: "M_NV_y_Rd",
      },
    ],
  },
  {
    type: "derived",
    key: "ratio_z",
    valueType: { type: "number" },
    id: "ratio_z",
    name: "Normalized bending ratio z",
    children: [
      {
        nodeId: "abs_M_z_Ed",
      },
      {
        nodeId: "M_NV_z_Rd",
      },
    ],
  },
  {
    type: "derived",
    key: "term_y",
    valueType: { type: "number" },
    id: "term_y",
    name: "Powered y term",
    children: [
      {
        nodeId: "ratio_y",
      },
      {
        nodeId: "alpha_biax",
      },
    ],
  },
  {
    type: "derived",
    key: "term_z",
    valueType: { type: "number" },
    id: "term_z",
    name: "Powered z term",
    children: [
      {
        nodeId: "ratio_z",
      },
      {
        nodeId: "beta_biax",
      },
    ],
  },
  {
    type: "check",
    key: "biaxial_axial_shear_check",
    valueType: { type: "number" },
    id: "biaxial_axial_shear_check",
    name: "Biaxial bending + axial + shear check",
    verificationExpression:
      "\\left(\\frac{M_{y,Ed}}{M_{NV,y,Rd}}\\right)^\\alpha + \\left(\\frac{M_{z,Ed}}{M_{NV,z,Rd}}\\right)^\\beta \\leq 1.0",
    meta: {
      sectionRef: "6.2.10",
      verificationRef: "(6.41)",
    },
    children: [
      {
        nodeId: "term_y",
      },
      {
        nodeId: "term_z",
      },
    ],
  },
]);

export type Nodes = typeof nodes;
