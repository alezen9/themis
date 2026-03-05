import { defineNodes } from "@ndg/ndg-core";

export const nodes = defineNodes([
  {
    type: "user-input",
    key: "M_y_Ed",
    valueType: { type: "number" },
    id: "M_y_Ed",
    name: "Design bending moment about y-y",
    symbol: "M_{y,Ed}",
    unit: "N·mm",
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
    key: "fy",
    valueType: { type: "number" },
    id: "fy",
    name: "Yield strength",
    unit: "MPa",
    children: [],
  },
  {
    type: "user-input",
    key: "E",
    valueType: { type: "number" },
    id: "E",
    name: "Elastic modulus",
    unit: "MPa",
    children: [],
  },
  {
    type: "user-input",
    key: "G",
    valueType: { type: "number" },
    id: "G",
    name: "Shear modulus",
    unit: "MPa",
    children: [],
  },
  {
    type: "user-input",
    key: "Iz",
    valueType: { type: "number" },
    id: "Iz",
    name: "Minor-axis second moment of area",
    unit: "mm⁴",
    children: [],
  },
  {
    type: "user-input",
    key: "It",
    valueType: { type: "number" },
    id: "It",
    name: "St. Venant torsion constant",
    unit: "mm⁴",
    children: [],
  },
  {
    type: "user-input",
    key: "Iw",
    valueType: { type: "number" },
    id: "Iw",
    name: "Warping constant",
    unit: "mm⁶",
    children: [],
  },
  {
    type: "user-input",
    key: "L",
    valueType: { type: "number" },
    id: "L",
    name: "Member length",
    unit: "mm",
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
    key: "alpha_LT",
    valueType: { type: "number" },
    id: "alpha_LT",
    name: "LTB imperfection factor",
    symbol: "\\alpha_{LT}",
    children: [],
  },
  {
    type: "coefficient",
    key: "gamma_M1",
    valueType: { type: "number" },
    id: "gamma_M1",
    name: "Partial safety factor",
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
    name: "Plateau length of LTB curves",
    symbol: "\\bar{\\lambda}_{LT,0}",
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
    name: "LTB curve parameter",
    symbol: "\\beta",
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
    key: "M_cr",
    valueType: { type: "number" },
    id: "M_cr",
    name: "Elastic critical moment for LTB (SN003b)",
    symbol: "M_{cr}",
    expression:
      "C_1 \\frac{\\pi^2 E I_z}{L_{cr,LT}^2}\\sqrt{\\frac{I_w}{I_z}+\\frac{L_{cr,LT}^2 G I_t}{\\pi^2 E I_z}}",
    unit: "N·mm",
    meta: {
      sectionRef: "6.3.2.2",
      paragraphRef: "(2)",
    },
    children: [
      {
        nodeId: "L",
      },
      {
        nodeId: "k_LT",
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
        nodeId: "torsional_deformations",
      },
    ],
  },
  {
    type: "derived",
    key: "lambda_bar_LT",
    valueType: { type: "number" },
    id: "lambda_bar_LT",
    name: "Non-dimensional slenderness for LTB",
    symbol: "\\bar{\\lambda}_{LT}",
    expression: "\\sqrt{\\frac{W_{pl,y} f_y}{M_{cr}}}",
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
    key: "phi_LT",
    valueType: { type: "number" },
    id: "phi_LT",
    name: "LTB parameter",
    symbol: "\\Phi_{LT}",
    expression:
      "0.5(1 + \\alpha_{LT}(\\bar{\\lambda}_{LT} - \\bar{\\lambda}_{LT,0}) + \\beta \\bar{\\lambda}_{LT}^2)",
    children: [
      {
        nodeId: "alpha_LT_eff",
      },
      {
        nodeId: "lambda_bar_LT",
      },
      {
        nodeId: "lambda_LT_0",
      },
      {
        nodeId: "beta_LT",
      },
      {
        nodeId: "lambda_bar_LT",
      },
    ],
  },
  {
    type: "derived",
    key: "chi_LT",
    valueType: { type: "number" },
    id: "chi_LT",
    name: "Capped LTB reduction factor",
    symbol: "\\chi_{LT}",
    expression: "\\min(1,\\min(\\chi_{LT,base}, 1/\\bar{\\lambda}_{LT}^2))",
    children: [
      {
        nodeId: "phi_LT",
      },
      {
        nodeId: "beta_LT",
      },
      {
        nodeId: "lambda_bar_LT",
      },
    ],
  },
  {
    type: "derived",
    key: "f_LT",
    valueType: { type: "number" },
    id: "f_LT",
    name: "LT correction factor",
    symbol: "f",
    expression:
      "f = \\min\\left(1, 1 - 0.5(1-k_c)[1-2(\\bar{\\lambda}_{LT}-0.8)^2]\\right)",
    meta: {
      sectionRef: "6.3.2.3",
      paragraphRef: "(2)",
    },
    children: [
      {
        nodeId: "lambda_bar_LT",
      },
      {
        nodeId: "k_c",
      },
    ],
  },
  {
    type: "formula",
    key: "chi_LT_mod",
    valueType: { type: "number" },
    id: "chi_LT_mod",
    name: "Modified LT reduction factor",
    symbol: "\\chi_{LT,mod}",
    expression: "\\min\\left(1,\\frac{\\chi_{LT}}{f}\\right)",
    meta: {
      sectionRef: "6.3.2.3",
      formulaRef: "(6.58)",
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
    type: "formula",
    key: "M_b_Rd",
    valueType: { type: "number" },
    id: "M_b_Rd",
    name: "LTB resistance",
    symbol: "M_{b,Rd}",
    expression: "\\frac{\\chi_{LT,mod} W_{pl,y} f_y}{\\gamma_{M1}}",
    unit: "N·mm",
    meta: {
      sectionRef: "6.3.2.1",
      formulaRef: "(6.55)",
    },
    children: [
      {
        nodeId: "chi_LT_mod",
      },
      {
        nodeId: "Wpl_y",
      },
      {
        nodeId: "fy",
      },
      {
        nodeId: "gamma_M1",
      },
    ],
  },
  {
    type: "derived",
    key: "abs_M_y_Ed",
    valueType: { type: "number" },
    id: "abs_M_y_Ed",
    name: "Absolute design moment",
    expression: "\\left|M_{y,Ed}\\right|",
    children: [
      {
        nodeId: "M_y_Ed",
      },
    ],
  },
  {
    type: "check",
    key: "ltb_check",
    valueType: { type: "number" },
    id: "ltb_check",
    name: "Lateral-torsional buckling check",
    verificationExpression: "\\frac{M_{y,Ed}}{M_{b,Rd}} \\leq 1.0",
    meta: {
      sectionRef: "6.3.2.1",
      verificationRef: "(6.54)",
    },
    children: [
      {
        nodeId: "abs_M_y_Ed",
      },
      {
        nodeId: "M_b_Rd",
      },
    ],
  },
]);

export type Nodes = typeof nodes;
