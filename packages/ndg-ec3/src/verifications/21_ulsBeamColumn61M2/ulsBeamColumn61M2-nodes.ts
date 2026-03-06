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
    key: "section_shape",
    valueType: { type: "string", oneOf: ["I", "RHS", "CHS"] },
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
    key: "psi_LT_eff",
    valueType: { type: "number" },
    id: "psi_LT_eff",
    name: "Effective psi for LT moment shape",
    expression: "\\psi_{LT,eff}",
    children: [
      {
        nodeId: "moment_shape_LT",
      },
      {
        nodeId: "psi_LT",
      },
      {
        nodeId: "k_c",
      },
    ],
  },
  {
    type: "table",
    key: "Cm_y",
    valueType: { type: "number" },
    id: "Cm_y",
    name: "Equivalent moment factor y",
    source: "EC3-B.3",
    meta: {
      sectionRef: "Annex B",
      tableRef: "B.3",
    },
    children: [
      {
        nodeId: "psi_y_eff",
      },
    ],
  },
  {
    type: "table",
    key: "Cm_z",
    valueType: { type: "number" },
    id: "Cm_z",
    name: "Equivalent moment factor z",
    source: "EC3-B.3",
    meta: {
      sectionRef: "Annex B",
      tableRef: "B.3",
    },
    children: [
      {
        nodeId: "psi_z_eff",
      },
    ],
  },
  {
    type: "table",
    key: "Cm_LT",
    valueType: { type: "number" },
    id: "Cm_LT",
    name: "Equivalent moment factor LT",
    source: "EC3-B.3",
    meta: {
      sectionRef: "Annex B",
      tableRef: "B.3",
    },
    children: [
      {
        nodeId: "psi_LT_eff",
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
        nodeId: "section_class",
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
    key: "N_cr_y",
    valueType: { type: "number" },
    id: "N_cr_y",
    name: "Elastic critical force y",
    expression: "\\pi^2EI_y/L_{cr,y}^2",
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
    expression: "\\pi^2EI_z/L_{cr,z}^2",
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
    key: "lambda_bar_y",
    valueType: { type: "number" },
    id: "lambda_bar_y",
    name: "Slenderness y",
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
    name: "Slenderness z",
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
    key: "phi_y",
    valueType: { type: "number" },
    id: "phi_y",
    name: "Buckling parameter y",
    children: [
      {
        nodeId: "alpha_y",
      },
      {
        nodeId: "lambda_bar_y",
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
        nodeId: "phi_y",
      },
      {
        nodeId: "lambda_bar_y",
      },
    ],
  },
  {
    type: "derived",
    key: "phi_z",
    valueType: { type: "number" },
    id: "phi_z",
    name: "Buckling parameter z",
    children: [
      {
        nodeId: "alpha_z",
      },
      {
        nodeId: "lambda_bar_z",
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
        nodeId: "phi_z",
      },
      {
        nodeId: "lambda_bar_z",
      },
    ],
  },
  {
    type: "derived",
    key: "lambda_LT",
    valueType: { type: "number" },
    id: "lambda_LT",
    name: "LT slenderness",
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
    ],
  },
  {
    type: "derived",
    key: "phi_LT",
    valueType: { type: "number" },
    id: "phi_LT",
    name: "LTB buckling parameter",
    children: [
      {
        nodeId: "alpha_LT_eff",
      },
      {
        nodeId: "lambda_LT",
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
        nodeId: "phi_LT",
      },
      {
        nodeId: "beta_LT",
      },
      {
        nodeId: "lambda_LT",
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
        nodeId: "lambda_LT",
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
    key: "N_b_y_Rd",
    valueType: { type: "number" },
    id: "N_b_y_Rd",
    name: "Buckling resistance y",
    children: [
      {
        nodeId: "chi_y",
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
    key: "n_y",
    valueType: { type: "number" },
    id: "n_y",
    name: "Normalized axial load vs Nby,Rd",
    children: [
      {
        nodeId: "N_Ed",
      },
      {
        nodeId: "N_b_y_Rd",
      },
    ],
  },
  {
    type: "table",
    key: "k_yy",
    valueType: { type: "number" },
    id: "k_yy",
    name: "Interaction factor k_yy",
    source: "EC3-B.1",
    meta: {
      sectionRef: "Annex B",
      tableRef: "B.1",
    },
    children: [
      {
        nodeId: "Cm_y",
      },
      {
        nodeId: "lambda_bar_y",
      },
      {
        nodeId: "n_y",
      },
    ],
  },
  {
    type: "derived",
    key: "N_b_z_Rd",
    valueType: { type: "number" },
    id: "N_b_z_Rd",
    name: "Buckling resistance z",
    children: [
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
    key: "n_z",
    valueType: { type: "number" },
    id: "n_z",
    name: "Normalized axial load vs Nbz,Rd",
    children: [
      {
        nodeId: "N_Ed",
      },
      {
        nodeId: "N_b_z_Rd",
      },
    ],
  },
  {
    type: "derived",
    key: "k_zz_aux",
    valueType: { type: "number" },
    id: "k_zz_aux",
    name: "Auxiliary k_zz",
    children: [
      {
        nodeId: "Cm_z",
      },
      {
        nodeId: "lambda_bar_z",
      },
      {
        nodeId: "n_z",
      },
    ],
  },
  {
    type: "table",
    key: "k_yz",
    valueType: { type: "number" },
    id: "k_yz",
    name: "Interaction factor k_yz",
    source: "EC3-B.1",
    meta: {
      sectionRef: "Annex B",
      tableRef: "B.1",
    },
    children: [
      {
        nodeId: "Cm_z",
      },
      {
        nodeId: "lambda_bar_z",
      },
      {
        nodeId: "n_z",
      },
    ],
  },
  {
    type: "derived",
    key: "bc_61_term1",
    valueType: { type: "number" },
    id: "bc_61_term1",
    name: "Eq.6.61 term 1",
    children: [
      {
        nodeId: "N_Ed",
      },
      {
        nodeId: "chi_y",
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
    key: "bc_61_term2",
    valueType: { type: "number" },
    id: "bc_61_term2",
    name: "Eq.6.61 term 2",
    children: [
      {
        nodeId: "k_yy",
      },
      {
        nodeId: "M_y_Ed",
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
    key: "bc_61_term3",
    valueType: { type: "number" },
    id: "bc_61_term3",
    name: "Eq.6.61 term 3",
    children: [
      {
        nodeId: "k_yz",
      },
      {
        nodeId: "M_z_Ed",
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
    key: "bc_61_m2_check",
    valueType: { type: "number" },
    id: "bc_61_m2_check",
    name: "Beam-column Eq.6.61 Method 2",
    verificationExpression:
      "\\frac{N_{Ed}}{\\chi_y N_{Rk}/\\gamma_{M1}} + k_{yy}\\frac{M_{y,Ed}}{\\chi_{LT} M_{y,Rk}/\\gamma_{M1}} + k_{yz}\\frac{M_{z,Ed}}{M_{z,Rk}/\\gamma_{M1}} \\leq 1.0",
    meta: {
      sectionRef: "6.3.3",
      verificationRef: "(6.61)",
    },
    children: [
      {
        nodeId: "bc_61_term1",
      },
      {
        nodeId: "bc_61_term2",
      },
      {
        nodeId: "bc_61_term3",
      },
    ],
  },
]);

export type Nodes = typeof nodes;
