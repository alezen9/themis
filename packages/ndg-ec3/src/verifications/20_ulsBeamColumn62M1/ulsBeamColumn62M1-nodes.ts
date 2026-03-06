import { defineNodes } from "@ndg/ndg-core";

export const nodes = defineNodes([
  {
    type: "user-input",
    key: "N_Ed",
    valueType: { type: "number" },
    id: "N_Ed",
    name: "Axial force",
    symbol: "N_{Ed}",
    unit: "\\mathrm{N}",
    children: [],
  },
  {
    type: "user-input",
    key: "M_y_Ed",
    valueType: { type: "number" },
    id: "M_y_Ed",
    name: "Bending moment y",
    symbol: "M_{y,Ed}",
    unit: "\\mathrm{N\\cdot mm}",
    children: [],
  },
  {
    type: "user-input",
    key: "M_z_Ed",
    valueType: { type: "number" },
    id: "M_z_Ed",
    name: "Bending moment z",
    symbol: "M_{z,Ed}",
    unit: "\\mathrm{N\\cdot mm}",
    children: [],
  },
  {
    type: "user-input",
    key: "A",
    valueType: { type: "number" },
    id: "A",
    name: "Area",
    unit: "\\mathrm{mm^{2}}",
    children: [],
  },
  {
    type: "user-input",
    key: "Wel_y",
    valueType: { type: "number" },
    id: "Wel_y",
    name: "Elastic modulus y",
    unit: "\\mathrm{mm^{3}}",
    children: [],
  },
  {
    type: "user-input",
    key: "Wel_z",
    valueType: { type: "number" },
    id: "Wel_z",
    name: "Elastic modulus z",
    unit: "\\mathrm{mm^{3}}",
    children: [],
  },
  {
    type: "user-input",
    key: "Wpl_y",
    valueType: { type: "number" },
    id: "Wpl_y",
    name: "Plastic modulus y",
    unit: "\\mathrm{mm^{3}}",
    children: [],
  },
  {
    type: "user-input",
    key: "Wpl_z",
    valueType: { type: "number" },
    id: "Wpl_z",
    name: "Plastic modulus z",
    unit: "\\mathrm{mm^{3}}",
    children: [],
  },
  {
    type: "user-input",
    key: "fy",
    valueType: { type: "number" },
    id: "fy",
    name: "Yield strength",
    unit: "\\mathrm{MPa}",
    children: [],
  },
  {
    type: "user-input",
    key: "E",
    valueType: { type: "number" },
    id: "E",
    name: "Elastic modulus",
    unit: "\\mathrm{MPa}",
    children: [],
  },
  {
    type: "user-input",
    key: "G",
    valueType: { type: "number" },
    id: "G",
    name: "Shear modulus",
    unit: "\\mathrm{MPa}",
    children: [],
  },
  {
    type: "user-input",
    key: "Iy",
    valueType: { type: "number" },
    id: "Iy",
    name: "Inertia y",
    unit: "\\mathrm{mm^{4}}",
    children: [],
  },
  {
    type: "user-input",
    key: "Iz",
    valueType: { type: "number" },
    id: "Iz",
    name: "Inertia z",
    unit: "\\mathrm{mm^{4}}",
    children: [],
  },
  {
    type: "user-input",
    key: "It",
    valueType: { type: "number" },
    id: "It",
    name: "St. Venant torsion constant",
    unit: "\\mathrm{mm^{4}}",
    children: [],
  },
  {
    type: "user-input",
    key: "Iw",
    valueType: { type: "number" },
    id: "Iw",
    name: "Warping constant",
    unit: "\\mathrm{mm^{6}}",
    children: [],
  },
  {
    type: "user-input",
    key: "L",
    valueType: { type: "number" },
    id: "L",
    name: "Member length",
    unit: "\\mathrm{mm}",
    children: [],
  },
  {
    type: "user-input",
    key: "k_y",
    valueType: { type: "number" },
    id: "k_y",
    name: "Buckling length factor y",
    children: [],
  },
  {
    type: "user-input",
    key: "k_z",
    valueType: { type: "number" },
    id: "k_z",
    name: "Buckling length factor z",
    children: [],
  },
  {
    type: "user-input",
    key: "k_LT",
    valueType: { type: "number" },
    id: "k_LT",
    name: "LT buckling length factor",
    children: [],
  },
  {
    type: "user-input",
    key: "psi_LT",
    valueType: { type: "number" },
    id: "psi_LT",
    name: "Moment ratio for LT shape selection",
    children: [],
  },
  {
    type: "user-input",
    key: "torsional_deformations",
    valueType: { type: "string" },
    id: "torsional_deformations",
    name: "Member susceptible to torsional deformations (yes/no)",
    children: [],
  },
  {
    type: "user-input",
    key: "interaction_factor_method",
    valueType: { type: "string" },
    id: "interaction_factor_method",
    name: "Interaction factor method selector",
    children: [],
  },
  {
    type: "user-input",
    key: "coefficient_f_method",
    valueType: { type: "string" },
    id: "coefficient_f_method",
    name: "Method selector for coefficient f",
    children: [],
  },
  {
    type: "user-input",
    key: "buckling_curves_LT_policy",
    valueType: { type: "string" },
    id: "buckling_curves_LT_policy",
    name: "LT buckling curve policy selector",
    children: [],
  },
  {
    type: "user-input",
    key: "moment_shape_y",
    valueType: { type: "string" },
    id: "moment_shape_y",
    name: "Moment shape for y-axis",
    children: [],
  },
  {
    type: "user-input",
    key: "support_condition_y",
    valueType: { type: "string" },
    id: "support_condition_y",
    name: "Support condition for y-axis",
    children: [],
  },
  {
    type: "user-input",
    key: "moment_shape_z",
    valueType: { type: "string" },
    id: "moment_shape_z",
    name: "Moment shape for z-axis",
    children: [],
  },
  {
    type: "user-input",
    key: "support_condition_z",
    valueType: { type: "string" },
    id: "support_condition_z",
    name: "Support condition for z-axis",
    children: [],
  },
  {
    type: "user-input",
    key: "moment_shape_LT",
    valueType: { type: "string" },
    id: "moment_shape_LT",
    name: "Moment shape for LT segment",
    children: [],
  },
  {
    type: "user-input",
    key: "support_condition_LT",
    valueType: { type: "string" },
    id: "support_condition_LT",
    name: "Support condition for LT segment",
    children: [],
  },
  {
    type: "user-input",
    key: "load_application_LT",
    valueType: { type: "string" },
    id: "load_application_LT",
    name: "Load application for LT segment",
    children: [],
  },
  {
    type: "user-input",
    key: "psi_y",
    valueType: { type: "number" },
    id: "psi_y",
    name: "Moment ratio for C_m,y",
    children: [],
  },
  {
    type: "user-input",
    key: "psi_z",
    valueType: { type: "number" },
    id: "psi_z",
    name: "Moment ratio for C_m,z",
    children: [],
  },
  {
    type: "user-input",
    key: "section_shape",
    valueType: { type: "string", literal: ["I", "RHS", "CHS"] },
    id: "section_shape",
    name: "Section shape family (I, RHS, CHS)",
    children: [],
  },
  {
    type: "user-input",
    key: "section_class",
    valueType: { type: "number" },
    id: "section_class",
    name: "Section class (1, 2, 3, 4)",
    children: [],
  },
  {
    type: "user-input",
    key: "alpha_y",
    valueType: { type: "number" },
    id: "alpha_y",
    name: "Imperfection factor y",
    children: [],
  },
  {
    type: "user-input",
    key: "alpha_z",
    valueType: { type: "number" },
    id: "alpha_z",
    name: "Imperfection factor z",
    children: [],
  },
  {
    type: "user-input",
    key: "alpha_LT",
    valueType: { type: "number" },
    id: "alpha_LT",
    name: "LTB imperfection factor",
    children: [],
  },
  {
    type: "coefficient",
    key: "gamma_M1",
    valueType: { type: "number" },
    id: "gamma_M1",
    name: "Partial factor",
    symbol: "\\gamma_{M1}",
    meta: {
      sectionRef: "6.1",
    },
    children: [],
  },
  {
    type: "coefficient",
    key: "lambda_LT_0",
    valueType: { type: "number" },
    id: "lambda_LT_0",
    name: "LTB plateau",
    meta: {
      sectionRef: "6.3.2.3",
    },
    children: [],
  },
  {
    type: "coefficient",
    key: "beta_LT",
    valueType: { type: "number" },
    id: "beta_LT",
    name: "LTB beta",
    meta: {
      sectionRef: "6.3.2.3",
    },
    children: [],
  },
  {
    type: "constant",
    key: "pi",
    valueType: { type: "number" },
    id: "pi",
    name: "Pi squared",
    symbol: "\\pi^2",
    children: [],
  },
  {
    type: "table",
    key: "k_c",
    valueType: { type: "number" },
    id: "k_c",
    name: "Moment distribution correction factor",
    symbol: "k_c",
    source: "EC3-6.6",
    meta: {
      sectionRef: "6.3.2.3",
      tableRef: "6.6",
    },
    children: [
      {
        nodeId: "moment_shape_LT",
      },
      {
        nodeId: "psi_LT",
      },
      {
        nodeId: "support_condition_LT",
      },
      {
        nodeId: "load_application_LT",
      },
    ],
  },
  {
    type: "derived",
    key: "C1",
    valueType: { type: "number" },
    id: "C1",
    name: "Moment gradient factor C1",
    expression: "\\frac{1}{k_c^2}",
    children: [
      {
        nodeId: "k_c",
      },
    ],
  },
  {
    type: "derived",
    key: "abs_N_Ed",
    valueType: { type: "number" },
    id: "abs_N_Ed",
    name: "Absolute design axial force",
    expression: "\\left|N_{Ed}\\right|",
    children: [
      {
        nodeId: "N_Ed",
      },
    ],
  },
  {
    type: "derived",
    key: "abs_M_y_Ed",
    valueType: { type: "number" },
    id: "abs_M_y_Ed",
    name: "Absolute design bending moment y",
    expression: "\\left|M_{y,Ed}\\right|",
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
    name: "Absolute design bending moment z",
    expression: "\\left|M_{z,Ed}\\right|",
    children: [
      {
        nodeId: "M_z_Ed",
      },
    ],
  },
  {
    type: "derived",
    key: "N_cr_y",
    valueType: { type: "number" },
    id: "N_cr_y",
    name: "Elastic critical force y",
    expression: "\\pi^2 E I_y / L_{cr,y}^2",
    unit: "\\mathrm{N}",
    meta: {
      sectionRef: "6.3.1.2",
    },
    children: [
      {
        nodeId: "pi",
      },
      {
        nodeId: "E",
      },
      {
        nodeId: "Iy",
      },
      {
        nodeId: "L",
      },
      {
        nodeId: "k_y",
      },
    ],
  },
  {
    type: "derived",
    key: "N_cr_z",
    valueType: { type: "number" },
    id: "N_cr_z",
    name: "Elastic critical force z",
    expression: "\\pi^2 E I_z / L_{cr,z}^2",
    unit: "\\mathrm{N}",
    meta: {
      sectionRef: "6.3.1.2",
    },
    children: [
      {
        nodeId: "pi",
      },
      {
        nodeId: "E",
      },
      {
        nodeId: "Iz",
      },
      {
        nodeId: "L",
      },
      {
        nodeId: "k_z",
      },
    ],
  },
  {
    type: "derived",
    key: "ip2",
    valueType: { type: "number" },
    id: "ip2",
    name: "Polar radius denominator term",
    expression: "(I_y+I_z)/A",
    children: [
      {
        nodeId: "Iy",
      },
      {
        nodeId: "Iz",
      },
      {
        nodeId: "A",
      },
    ],
  },
  {
    type: "derived",
    key: "ncr_t_warp",
    valueType: { type: "number" },
    id: "ncr_t_warp",
    name: "Warping term in Ncr,T",
    expression: "\\pi^2EI_w/L_{cr,z}^2",
    children: [
      {
        nodeId: "pi",
      },
      {
        nodeId: "E",
      },
      {
        nodeId: "Iw",
      },
      {
        nodeId: "L",
      },
      {
        nodeId: "k_z",
      },
    ],
  },
  {
    type: "derived",
    key: "N_cr_T",
    valueType: { type: "number" },
    id: "N_cr_T",
    name: "Elastic torsional critical force",
    unit: "\\mathrm{N}",
    meta: {
      sectionRef: "6.3.1.4",
      paragraphRef: "(2)",
    },
    children: [
      {
        nodeId: "Iy",
      },
      {
        nodeId: "Iz",
      },
      {
        nodeId: "It",
      },
      {
        nodeId: "Iw",
      },
      {
        nodeId: "G",
      },
      {
        nodeId: "ncr_t_warp",
      },
      {
        nodeId: "ip2",
      },
    ],
  },
  {
    type: "derived",
    key: "N_cr_TF",
    valueType: { type: "number" },
    id: "N_cr_TF",
    name: "Elastic torsional-flexural critical force",
    expression: "\\min(N_{cr,T}, N_{cr,z})",
    unit: "\\mathrm{N}",
    meta: {
      sectionRef: "6.3.1.4",
      paragraphRef: "(2)",
    },
    children: [
      {
        nodeId: "N_cr_T",
      },
      {
        nodeId: "N_cr_z",
      },
    ],
  },
  {
    type: "derived",
    key: "M_cr",
    valueType: { type: "number" },
    id: "M_cr",
    name: "Elastic critical moment",
    unit: "\\mathrm{N\\cdot mm}",
    meta: {
      sectionRef: "6.3.2.2",
      paragraphRef: "(2)",
    },
    children: [
      {
        nodeId: "section_shape",
      },
      {
        nodeId: "L",
      },
      {
        nodeId: "k_LT",
      },
      {
        nodeId: "Iz",
      },
      {
        nodeId: "It",
      },
      {
        nodeId: "Iw",
      },
      {
        nodeId: "C1",
      },
      {
        nodeId: "pi",
      },
      {
        nodeId: "E",
      },
      {
        nodeId: "G",
      },
    ],
  },
  {
    type: "derived",
    key: "lambda_bar_0",
    valueType: { type: "number" },
    id: "lambda_bar_0",
    name: "Reference LT slenderness for uniform moment",
    expression: "\\sqrt{W_{pl,y} f_y C_1 / M_{cr}}",
    meta: {
      sectionRef: "Annex A",
    },
    children: [
      {
        nodeId: "Wpl_y",
      },
      {
        nodeId: "fy",
      },
      {
        nodeId: "C1",
      },
      {
        nodeId: "M_cr",
      },
    ],
  },
  {
    type: "derived",
    key: "it_over_iy",
    valueType: { type: "number" },
    id: "it_over_iy",
    name: "It/Iy ratio",
    expression: "I_t/I_y",
    children: [
      {
        nodeId: "It",
      },
      {
        nodeId: "Iy",
      },
    ],
  },
  {
    type: "derived",
    key: "a_LT",
    valueType: { type: "number" },
    id: "a_LT",
    name: "Annex A auxiliary term a_LT",
    expression: "1 - I_t / I_y",
    meta: {
      sectionRef: "Annex A",
    },
    children: [
      {
        nodeId: "it_over_iy",
      },
    ],
  },
  {
    type: "derived",
    key: "eta_y_m_over_n",
    valueType: { type: "number" },
    id: "eta_y_m_over_n",
    name: "Moment-to-force ratio in eta_y",
    expression: "\\left|M_{y,Ed}\\right|/\\left|N_{Ed}\\right|",
    children: [
      {
        nodeId: "abs_M_y_Ed",
      },
      {
        nodeId: "abs_N_Ed",
      },
    ],
  },
  {
    type: "derived",
    key: "eta_y_area_ratio",
    valueType: { type: "number" },
    id: "eta_y_area_ratio",
    name: "Area-to-modulus ratio in eta_y",
    expression: "A/W_{pl,y}",
    children: [
      {
        nodeId: "A",
      },
      {
        nodeId: "Wpl_y",
      },
    ],
  },
  {
    type: "derived",
    key: "eta_y",
    valueType: { type: "number" },
    id: "eta_y",
    name: "Annex A auxiliary term eta_y",
    expression: "\\left|\\frac{M_{y,Ed}}{N_{Ed}}\\right|\\frac{A}{W_{pl,y}}",
    meta: {
      sectionRef: "Annex A",
    },
    children: [
      {
        nodeId: "eta_y_m_over_n",
      },
      {
        nodeId: "eta_y_area_ratio",
      },
    ],
  },
  {
    type: "derived",
    key: "psi_y_eff",
    valueType: { type: "number" },
    id: "psi_y_eff",
    name: "Effective psi for y-axis moment shape",
    expression: "\\psi_{y,eff}",
    children: [
      {
        nodeId: "moment_shape_y",
      },
      {
        nodeId: "psi_y",
      },
    ],
  },
  {
    type: "derived",
    key: "psi_z_eff",
    valueType: { type: "number" },
    id: "psi_z_eff",
    name: "Effective psi for z-axis moment shape",
    expression: "\\psi_{z,eff}",
    children: [
      {
        nodeId: "moment_shape_z",
      },
      {
        nodeId: "psi_z",
      },
    ],
  },
  {
    type: "derived",
    key: "ncr_y_ratio",
    valueType: { type: "number" },
    id: "ncr_y_ratio",
    name: "N_Ed/N_cr,y ratio",
    expression: "\\left|N_{Ed}\\right|/N_{cr,y}",
    children: [
      {
        nodeId: "abs_N_Ed",
      },
      {
        nodeId: "N_cr_y",
      },
    ],
  },
  {
    type: "derived",
    key: "ncr_z_ratio",
    valueType: { type: "number" },
    id: "ncr_z_ratio",
    name: "N_Ed/N_cr,z ratio",
    expression: "\\left|N_{Ed}\\right|/N_{cr,z}",
    children: [
      {
        nodeId: "abs_N_Ed",
      },
      {
        nodeId: "N_cr_z",
      },
    ],
  },
  {
    type: "table",
    key: "Cmy_0",
    valueType: { type: "number" },
    id: "Cmy_0",
    name: "Equivalent moment factor C_m,y,0",
    source: "EC3-A.2",
    meta: {
      sectionRef: "Annex A",
      tableRef: "A.2",
    },
    children: [
      {
        nodeId: "psi_y_eff",
      },
      {
        nodeId: "ncr_y_ratio",
      },
    ],
  },
  {
    type: "table",
    key: "Cmz_0",
    valueType: { type: "number" },
    id: "Cmz_0",
    name: "Equivalent moment factor C_m,z,0",
    source: "EC3-A.2",
    meta: {
      sectionRef: "Annex A",
      tableRef: "A.2",
    },
    children: [
      {
        nodeId: "psi_z_eff",
      },
      {
        nodeId: "ncr_z_ratio",
      },
    ],
  },
  {
    type: "derived",
    key: "ncr_t_ratio",
    valueType: { type: "number" },
    id: "ncr_t_ratio",
    name: "N_Ed/N_cr,T ratio",
    expression: "\\left|N_{Ed}\\right|/N_{cr,T}",
    children: [
      {
        nodeId: "abs_N_Ed",
      },
      {
        nodeId: "N_cr_T",
      },
    ],
  },
  {
    type: "derived",
    key: "ncr_tf_ratio",
    valueType: { type: "number" },
    id: "ncr_tf_ratio",
    name: "N_Ed/N_cr,TF ratio",
    expression: "\\left|N_{Ed}\\right|/N_{cr,TF}",
    children: [
      {
        nodeId: "abs_N_Ed",
      },
      {
        nodeId: "N_cr_TF",
      },
    ],
  },
  {
    type: "derived",
    key: "cm_branch_limit",
    valueType: { type: "number" },
    id: "cm_branch_limit",
    name: "Annex A branch limit",
    expression: "0.4(1-n_{cr,z})(1-n_{cr,TF})",
    children: [
      {
        nodeId: "ncr_z_ratio",
      },
      {
        nodeId: "ncr_tf_ratio",
      },
    ],
  },
  {
    type: "derived",
    key: "cm_branch_active",
    valueType: { type: "number" },
    id: "cm_branch_active",
    name: "Annex A branch selector for Cm adjustments",
    expression: "\\bar{\\lambda}_0>0.2\\land C_1<\\text{limit}",
    children: [
      {
        nodeId: "lambda_bar_0",
      },
      {
        nodeId: "C1",
      },
      {
        nodeId: "cm_branch_limit",
      },
    ],
  },
  {
    type: "derived",
    key: "cm_amp",
    valueType: { type: "number" },
    id: "cm_amp",
    name: "Annex A amplification factor",
    expression: "\\eta_ya_{LT}/(1+\\eta_ya_{LT})",
    children: [
      {
        nodeId: "eta_y",
      },
      {
        nodeId: "a_LT",
      },
    ],
  },
  {
    type: "derived",
    key: "cmReserve",
    valueType: { type: "number" },
    id: "cmReserve",
    name: "Annex A denominator term",
    expression: "(1-n_{cr,z})(1-n_{cr,T})",
    children: [
      {
        nodeId: "ncr_z_ratio",
      },
      {
        nodeId: "ncr_t_ratio",
      },
    ],
  },
  {
    type: "table",
    key: "Cm_y",
    valueType: { type: "number" },
    id: "Cm_y",
    name: "Equivalent moment factor y",
    source: "EC3-A.1",
    meta: {
      sectionRef: "Annex A",
      tableRef: "A.1",
    },
    children: [
      {
        nodeId: "Cmy_0",
      },
      {
        nodeId: "cm_branch_active",
      },
      {
        nodeId: "cm_amp",
      },
      {
        nodeId: "cmReserve",
      },
    ],
  },
  {
    type: "table",
    key: "Cm_z",
    valueType: { type: "number" },
    id: "Cm_z",
    name: "Equivalent moment factor z",
    source: "EC3-A.1",
    meta: {
      sectionRef: "Annex A",
      tableRef: "A.1",
    },
    children: [
      {
        nodeId: "Cmz_0",
      },
    ],
  },
  {
    type: "derived",
    key: "Cm_y_aug",
    valueType: { type: "number" },
    id: "Cm_y_aug",
    name: "Augmented Cm_y for LT branch",
    expression: "C_{m,y,0}+(1-C_{m,y,0})\\,\\text{amp}",
    children: [
      {
        nodeId: "Cmy_0",
      },
      {
        nodeId: "cm_amp",
      },
    ],
  },
  {
    type: "table",
    key: "Cm_LT",
    valueType: { type: "number" },
    id: "Cm_LT",
    name: "Equivalent moment factor LT",
    source: "EC3-A.1",
    meta: {
      sectionRef: "Annex A",
      tableRef: "A.1",
    },
    children: [
      {
        nodeId: "cm_branch_active",
      },
      {
        nodeId: "Cm_y_aug",
      },
      {
        nodeId: "a_LT",
      },
      {
        nodeId: "cmReserve",
      },
    ],
  },
  {
    type: "derived",
    key: "N_Rk",
    valueType: { type: "number" },
    id: "N_Rk",
    name: "Characteristic axial resistance",
    children: [
      {
        nodeId: "A",
      },
      {
        nodeId: "fy",
      },
    ],
  },
  {
    type: "derived",
    key: "M_y_Rk",
    valueType: { type: "number" },
    id: "M_y_Rk",
    name: "Characteristic bending resistance y",
    children: [
      {
        nodeId: "Wpl_y",
      },
      {
        nodeId: "fy",
      },
    ],
  },
  {
    type: "derived",
    key: "M_z_Rk",
    valueType: { type: "number" },
    id: "M_z_Rk",
    name: "Characteristic bending resistance z",
    children: [
      {
        nodeId: "Wpl_z",
      },
      {
        nodeId: "fy",
      },
    ],
  },
  {
    type: "derived",
    key: "wy",
    valueType: { type: "number" },
    id: "wy",
    name: "Annex A factor w_y",
    children: [
      {
        nodeId: "Wpl_y",
      },
      {
        nodeId: "Wel_y",
      },
    ],
  },
  {
    type: "derived",
    key: "wz",
    valueType: { type: "number" },
    id: "wz",
    name: "Annex A factor w_z",
    children: [
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
    key: "chi_y",
    valueType: { type: "number" },
    id: "chi_y",
    name: "Reduction factor y",
    children: [
      {
        nodeId: "A",
      },
      {
        nodeId: "fy",
      },
      {
        nodeId: "E",
      },
      {
        nodeId: "Iy",
      },
      {
        nodeId: "L",
      },
      {
        nodeId: "k_y",
      },
      {
        nodeId: "alpha_y",
      },
    ],
  },
  {
    type: "derived",
    key: "chi_z",
    valueType: { type: "number" },
    id: "chi_z",
    name: "Reduction factor z",
    children: [
      {
        nodeId: "A",
      },
      {
        nodeId: "fy",
      },
      {
        nodeId: "E",
      },
      {
        nodeId: "Iz",
      },
      {
        nodeId: "L",
      },
      {
        nodeId: "k_z",
      },
      {
        nodeId: "alpha_z",
      },
    ],
  },
  {
    type: "derived",
    key: "alpha_LT_eff",
    valueType: { type: "number" },
    id: "alpha_LT_eff",
    name: "Effective LT imperfection factor",
    expression: "\\alpha_{LT,eff}",
    children: [
      {
        nodeId: "alpha_LT",
      },
      {
        nodeId: "buckling_curves_LT_policy",
      },
    ],
  },
  {
    type: "derived",
    key: "chi_LT",
    valueType: { type: "number" },
    id: "chi_LT",
    name: "LTB reduction factor",
    children: [
      {
        nodeId: "Wpl_y",
      },
      {
        nodeId: "fy",
      },
      {
        nodeId: "M_cr",
      },
      {
        nodeId: "alpha_LT_eff",
      },
      {
        nodeId: "lambda_LT_0",
      },
      {
        nodeId: "beta_LT",
      },
    ],
  },
  {
    type: "derived",
    key: "f_LT",
    valueType: { type: "number" },
    id: "f_LT",
    name: "LT correction factor",
    expression:
      "f = \\min\\left(1, 1 - 0.5(1-k_c)[1-2(\\bar{\\lambda}_{LT}-0.8)^2]\\right)",
    meta: {
      sectionRef: "6.3.2.3",
      paragraphRef: "(2)",
    },
    children: [
      {
        nodeId: "chi_LT",
      },
      {
        nodeId: "Wpl_y",
      },
      {
        nodeId: "fy",
      },
      {
        nodeId: "M_cr",
      },
      {
        nodeId: "k_c",
      },
    ],
  },
  {
    type: "derived",
    key: "chi_LT_mod",
    valueType: { type: "number" },
    id: "chi_LT_mod",
    name: "Modified LTB reduction factor",
    expression: "\\min\\left(1,\\frac{\\chi_{LT}}{f}\\right)",
    meta: {
      sectionRef: "6.3.2.3",
    },
    children: [
      {
        nodeId: "chi_LT",
      },
      {
        nodeId: "f_LT",
      },
    ],
  },
  {
    type: "derived",
    key: "lambda_bar_y",
    valueType: { type: "number" },
    id: "lambda_bar_y",
    name: "Non-dimensional slenderness y",
    children: [
      {
        nodeId: "A",
      },
      {
        nodeId: "fy",
      },
      {
        nodeId: "N_cr_y",
      },
    ],
  },
  {
    type: "derived",
    key: "lambda_bar_z",
    valueType: { type: "number" },
    id: "lambda_bar_z",
    name: "Non-dimensional slenderness z",
    children: [
      {
        nodeId: "A",
      },
      {
        nodeId: "fy",
      },
      {
        nodeId: "N_cr_z",
      },
    ],
  },
  {
    type: "derived",
    key: "n_pl",
    valueType: { type: "number" },
    id: "n_pl",
    name: "Annex A axial ratio n_pl",
    children: [
      {
        nodeId: "abs_N_Ed",
      },
      {
        nodeId: "N_Rk",
      },
      {
        nodeId: "gamma_M1",
      },
    ],
  },
  {
    type: "derived",
    key: "lambda_bar_max",
    valueType: { type: "number" },
    id: "lambda_bar_max",
    name: "Annex A λ_max",
    children: [
      {
        nodeId: "lambda_bar_y",
      },
      {
        nodeId: "lambda_bar_z",
      },
    ],
  },
  {
    type: "derived",
    key: "b_LT",
    valueType: { type: "number" },
    id: "b_LT",
    name: "Annex A auxiliary b_LT",
    children: [
      {
        nodeId: "a_LT",
      },
      {
        nodeId: "lambda_bar_0",
      },
      {
        nodeId: "abs_M_y_Ed",
      },
      {
        nodeId: "abs_M_z_Ed",
      },
      {
        nodeId: "chi_LT",
      },
      {
        nodeId: "M_y_Rk",
      },
      {
        nodeId: "M_z_Rk",
      },
    ],
  },
  {
    type: "derived",
    key: "c_LT",
    valueType: { type: "number" },
    id: "c_LT",
    name: "Annex A auxiliary c_LT",
    children: [
      {
        nodeId: "a_LT",
      },
      {
        nodeId: "lambda_bar_0",
      },
      {
        nodeId: "abs_M_y_Ed",
      },
      {
        nodeId: "lambda_bar_z",
      },
      {
        nodeId: "Cm_y",
      },
      {
        nodeId: "chi_LT",
      },
      {
        nodeId: "M_y_Rk",
      },
    ],
  },
  {
    type: "derived",
    key: "d_LT",
    valueType: { type: "number" },
    id: "d_LT",
    name: "Annex A auxiliary d_LT",
    children: [
      {
        nodeId: "a_LT",
      },
      {
        nodeId: "lambda_bar_0",
      },
      {
        nodeId: "abs_M_y_Ed",
      },
      {
        nodeId: "abs_M_z_Ed",
      },
      {
        nodeId: "lambda_bar_z",
      },
      {
        nodeId: "Cm_y",
      },
      {
        nodeId: "Cm_z",
      },
      {
        nodeId: "chi_LT",
      },
      {
        nodeId: "M_y_Rk",
      },
      {
        nodeId: "M_z_Rk",
      },
    ],
  },
  {
    type: "derived",
    key: "e_LT",
    valueType: { type: "number" },
    id: "e_LT",
    name: "Annex A auxiliary e_LT",
    children: [
      {
        nodeId: "a_LT",
      },
      {
        nodeId: "lambda_bar_0",
      },
      {
        nodeId: "abs_M_y_Ed",
      },
      {
        nodeId: "lambda_bar_z",
      },
      {
        nodeId: "Cm_y",
      },
      {
        nodeId: "chi_LT",
      },
      {
        nodeId: "M_y_Rk",
      },
    ],
  },
  {
    type: "derived",
    key: "C_yy",
    valueType: { type: "number" },
    id: "C_yy",
    name: "Annex A interaction coefficient C_yy",
    children: [
      {
        nodeId: "Cm_y",
      },
      {
        nodeId: "n_pl",
      },
      {
        nodeId: "lambda_bar_y",
      },
      {
        nodeId: "lambda_bar_z",
      },
      {
        nodeId: "wy",
      },
      {
        nodeId: "b_LT",
      },
      {
        nodeId: "Wel_y",
      },
      {
        nodeId: "Wpl_y",
      },
    ],
  },
  {
    type: "derived",
    key: "C_yz",
    valueType: { type: "number" },
    id: "C_yz",
    name: "Annex A interaction coefficient C_yz",
    children: [
      {
        nodeId: "Cm_z",
      },
      {
        nodeId: "n_pl",
      },
      {
        nodeId: "lambda_bar_y",
      },
      {
        nodeId: "lambda_bar_z",
      },
      {
        nodeId: "wz",
      },
      {
        nodeId: "c_LT",
      },
      {
        nodeId: "Wel_z",
      },
      {
        nodeId: "wy",
      },
      {
        nodeId: "Wpl_z",
      },
    ],
  },
  {
    type: "derived",
    key: "C_zy",
    valueType: { type: "number" },
    id: "C_zy",
    name: "Method 1 interaction coefficient C_zy",
    children: [
      {
        nodeId: "abs_N_Ed",
      },
    ],
  },
  {
    type: "derived",
    key: "C_zz",
    valueType: { type: "number" },
    id: "C_zz",
    name: "Annex A interaction coefficient C_zz",
    children: [
      {
        nodeId: "Cm_z",
      },
      {
        nodeId: "n_pl",
      },
      {
        nodeId: "lambda_bar_y",
      },
      {
        nodeId: "lambda_bar_z",
      },
      {
        nodeId: "wz",
      },
      {
        nodeId: "e_LT",
      },
      {
        nodeId: "Wel_z",
      },
      {
        nodeId: "Wpl_z",
      },
    ],
  },
  {
    type: "derived",
    key: "k_yyReserve",
    valueType: { type: "number" },
    id: "k_yyReserve",
    name: "Denominator of k_yy",
    expression: "1-n_{cr,y}",
    children: [
      {
        nodeId: "ncr_y_ratio",
      },
    ],
  },
  {
    type: "derived",
    key: "k_yy",
    valueType: { type: "number" },
    id: "k_yy",
    name: "Interaction factor k_yy",
    children: [
      {
        nodeId: "Cm_y",
      },
      {
        nodeId: "Cm_LT",
      },
      {
        nodeId: "k_yyReserve",
      },
    ],
  },
  {
    type: "derived",
    key: "k_zzReserve",
    valueType: { type: "number" },
    id: "k_zzReserve",
    name: "Denominator of k_zz",
    expression: "1-n_{cr,z}",
    children: [
      {
        nodeId: "ncr_z_ratio",
      },
    ],
  },
  {
    type: "derived",
    key: "k_zz",
    valueType: { type: "number" },
    id: "k_zz",
    name: "Interaction factor k_zz",
    children: [
      {
        nodeId: "Cm_z",
      },
      {
        nodeId: "k_zzReserve",
      },
    ],
  },
  {
    type: "derived",
    key: "k_zy",
    valueType: { type: "number" },
    id: "k_zy",
    name: "Interaction factor k_zy",
    children: [
      {
        nodeId: "abs_N_Ed",
      },
      {
        nodeId: "Cm_y",
      },
      {
        nodeId: "Cm_LT",
      },
      {
        nodeId: "k_yyReserve",
      },
      {
        nodeId: "C_zy",
      },
      {
        nodeId: "wy",
      },
      {
        nodeId: "wz",
      },
      {
        nodeId: "k_yy",
      },
    ],
  },
  {
    type: "derived",
    key: "bc_62_term1",
    valueType: { type: "number" },
    id: "bc_62_term1",
    name: "Eq.6.62 term 1",
    children: [
      {
        nodeId: "abs_N_Ed",
      },
      {
        nodeId: "chi_z",
      },
      {
        nodeId: "N_Rk",
      },
      {
        nodeId: "gamma_M1",
      },
    ],
  },
  {
    type: "derived",
    key: "bc_62_term2",
    valueType: { type: "number" },
    id: "bc_62_term2",
    name: "Eq.6.62 term 2",
    children: [
      {
        nodeId: "k_zy",
      },
      {
        nodeId: "abs_M_y_Ed",
      },
      {
        nodeId: "chi_LT_mod",
      },
      {
        nodeId: "M_y_Rk",
      },
      {
        nodeId: "gamma_M1",
      },
    ],
  },
  {
    type: "derived",
    key: "bc_62_term3",
    valueType: { type: "number" },
    id: "bc_62_term3",
    name: "Eq.6.62 term 3",
    children: [
      {
        nodeId: "k_zz",
      },
      {
        nodeId: "abs_M_z_Ed",
      },
      {
        nodeId: "M_z_Rk",
      },
      {
        nodeId: "gamma_M1",
      },
    ],
  },
  {
    type: "check",
    key: "bc_62_m1_check",
    valueType: { type: "number" },
    id: "bc_62_m1_check",
    name: "Beam-column Eq.6.62 Method 1",
    verificationExpression:
      "\\frac{N_{Ed}}{\\chi_z N_{Rk}/\\gamma_{M1}} + k_{zy}\\frac{M_{y,Ed}}{\\chi_{LT} M_{y,Rk}/\\gamma_{M1}} + k_{zz}\\frac{M_{z,Ed}}{M_{z,Rk}/\\gamma_{M1}} \\leq 1.0",
    meta: {
      sectionRef: "6.3.3",
      verificationRef: "(6.62)",
    },
    children: [
      {
        nodeId: "bc_62_term1",
      },
      {
        nodeId: "bc_62_term2",
      },
      {
        nodeId: "bc_62_term3",
      },
    ],
  },
]);

export type Nodes = typeof nodes;
