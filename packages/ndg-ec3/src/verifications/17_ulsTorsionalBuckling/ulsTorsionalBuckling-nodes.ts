import { defineNodes } from "@ndg/ndg-core";

export const nodes = defineNodes([
  {
    type: "user-input",
    key: "N_Ed",
    valueType: { type: "number" },
    id: "N_Ed",
    name: "Design compression force",
    symbol: "N_{Ed}",
    unit: "\\mathrm{N}",
    children: [],
  },
  {
    type: "user-input",
    key: "A",
    valueType: { type: "number" },
    id: "A",
    name: "Cross-sectional area",
    unit: "\\mathrm{mm^{2}}",
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
    name: "Second moment of area y-y",
    unit: "\\mathrm{mm^{4}}",
    children: [],
  },
  {
    type: "user-input",
    key: "Iz",
    valueType: { type: "number" },
    id: "Iz",
    name: "Second moment of area z-z",
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
    key: "k_T",
    valueType: { type: "number" },
    id: "k_T",
    name: "Buckling length factor for torsional buckling",
    children: [],
  },
  {
    type: "user-input",
    key: "k_z",
    valueType: { type: "number" },
    id: "k_z",
    name: "Fallback buckling length factor z",
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
    key: "alpha_z",
    valueType: { type: "number" },
    id: "alpha_z",
    name: "Imperfection factor (z-axis curve)",
    symbol: "\\alpha",
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
    type: "constant",
    key: "pi",
    valueType: { type: "number" },
    id: "pi",
    name: "Pi squared",
    symbol: "\\pi^2",
    children: [],
  },
  {
    type: "derived",
    key: "ip2",
    valueType: { type: "number" },
    id: "ip2",
    name: "Polar radius term",
    expression: "\\frac{I_y+I_z}{A}",
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
    key: "ncr_t_right",
    valueType: { type: "number" },
    id: "ncr_t_right",
    name: "Right summand in N_cr,T numerator",
    expression: "\\frac{\\pi^2 E I_w}{L_{cr,T}^2}",
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
        nodeId: "k_T",
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
    symbol: "N_{cr,T}",
    expression:
      "\\frac{1}{i_p^2}\\left(G I_t + \\frac{\\pi^2 E I_w}{L_{cr,T}^2}\\right)",
    unit: "\\mathrm{N}",
    meta: {
      sectionRef: "6.3.1.4",
      paragraphRef: "(2)",
    },
    children: [
      {
        nodeId: "section_shape",
      },
      {
        nodeId: "A",
      },
      {
        nodeId: "L",
      },
      {
        nodeId: "k_T",
      },
      {
        nodeId: "k_z",
      },
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
        nodeId: "ip2",
      },
      {
        nodeId: "G",
      },
      {
        nodeId: "pi",
      },
      {
        nodeId: "E",
      },
    ],
  },
  {
    type: "derived",
    key: "N_cr_z",
    valueType: { type: "number" },
    id: "N_cr_z",
    name: "Elastic flexural critical force about z-z",
    symbol: "N_{cr,z}",
    expression: "\\frac{\\pi^2 E I_z}{L_{cr,T}^2}",
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
        nodeId: "k_T",
      },
      {
        nodeId: "k_z",
      },
    ],
  },
  {
    type: "derived",
    key: "N_cr_TF",
    valueType: { type: "number" },
    id: "N_cr_TF",
    name: "Elastic torsional-flexural critical force",
    symbol: "N_{cr,TF}",
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
    key: "N_cr_governing",
    valueType: { type: "number" },
    id: "N_cr_governing",
    name: "Governing critical force for torsional buckling slenderness",
    symbol: "N_{cr}",
    expression: "N_{cr,T}",
    unit: "\\mathrm{N}",
    meta: {
      sectionRef: "6.3.1.4",
      paragraphRef: "(2)",
    },
    children: [
      {
        nodeId: "N_cr_T",
      },
    ],
  },
  {
    type: "derived",
    key: "lambda_bar_TF",
    valueType: { type: "number" },
    id: "lambda_bar_TF",
    name: "Non-dimensional slenderness (torsional-flexural)",
    symbol: "\\bar{\\lambda}_{TF}",
    expression: "\\sqrt{\\frac{Af_y}{N_{cr}}}",
    meta: {
      sectionRef: "6.3.1.4",
      paragraphRef: "(2)",
    },
    children: [
      {
        nodeId: "A",
      },
      {
        nodeId: "fy",
      },
      {
        nodeId: "N_cr_governing",
      },
    ],
  },
  {
    type: "derived",
    key: "phi_TF",
    valueType: { type: "number" },
    id: "phi_TF",
    name: "Buckling parameter (torsional-flexural)",
    symbol: "\\Phi_{TF}",
    expression:
      "0.5(1 + \\alpha(\\bar{\\lambda}_{TF}-0.2) + \\bar{\\lambda}_{TF}^2)",
    children: [
      {
        nodeId: "alpha_z",
      },
      {
        nodeId: "lambda_bar_TF",
      },
    ],
  },
  {
    type: "derived",
    key: "chi_TF",
    valueType: { type: "number" },
    id: "chi_TF",
    name: "Capped torsional-flexural reduction factor",
    expression: "\\min(1,\\chi_{TF,base})",
    children: [
      {
        nodeId: "phi_TF",
      },
      {
        nodeId: "lambda_bar_TF",
      },
    ],
  },
  {
    type: "formula",
    key: "N_b_TF_Rd",
    valueType: { type: "number" },
    id: "N_b_TF_Rd",
    name: "Torsional-flexural buckling resistance",
    symbol: "N_{b,TF,Rd}",
    expression: "\\frac{\\chi_{TF} A f_y}{\\gamma_{M1}}",
    unit: "\\mathrm{N}",
    meta: {
      sectionRef: "6.3.1.1",
      formulaRef: "(6.47)",
    },
    children: [
      {
        nodeId: "chi_TF",
      },
      {
        nodeId: "A",
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
    type: "check",
    key: "torsional_buckling_check",
    valueType: { type: "number" },
    id: "torsional_buckling_check",
    name: "Torsional-flexural buckling check",
    verificationExpression: "\\frac{N_{Ed}}{N_{b,TF,Rd}} \\leq 1.0",
    meta: {
      sectionRef: "6.3.1.1",
      verificationRef: "(6.46)",
    },
    children: [
      {
        nodeId: "abs_N_Ed",
      },
      {
        nodeId: "N_b_TF_Rd",
      },
    ],
  },
]);

export type Nodes = typeof nodes;
