import { defineNodes } from "@ndg/ndg-core";

export const nodes = defineNodes([
  {
    type: "user-input",
    key: "N_Ed",
    valueType: { type: "number" },
    id: "N_Ed",
    name: "Design compression force",
    symbol: "N_{Ed}",
    unit: "N",
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
    key: "A",
    valueType: { type: "number" },
    id: "A",
    name: "Cross-sectional area",
    unit: "mm²",
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
    key: "Iz",
    valueType: { type: "number" },
    id: "Iz",
    name: "Second moment of area z-z",
    unit: "mm⁴",
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
    key: "k_z",
    valueType: { type: "number" },
    id: "k_z",
    name: "Buckling length factor z",
    children: [],
  },
  {
    type: "user-input",
    key: "alpha_z",
    valueType: { type: "number" },
    id: "alpha_z",
    name: "Imperfection factor z-z",
    symbol: "\\alpha_z",
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
    name: "Pi",
    symbol: "\\pi",
    children: [],
  },
  {
    type: "derived",
    key: "N_cr_z",
    valueType: { type: "number" },
    id: "N_cr_z",
    name: "Elastic critical force z-z",
    symbol: "N_{cr,z}",
    expression: "\\frac{\\pi^2EI_z}{(k_zL)^2}",
    unit: "N",
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
    key: "lambda_bar_z",
    valueType: { type: "number" },
    id: "lambda_bar_z",
    name: "Non-dimensional slenderness z-z",
    symbol: "\\bar{\\lambda}_z",
    expression: "\\sqrt{\\frac{Af_y}{N_{cr,z}}}",
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
    key: "phi_z",
    valueType: { type: "number" },
    id: "phi_z",
    name: "Buckling parameter z-z",
    symbol: "\\Phi_z",
    expression:
      "0.5\\left(1+\\alpha_z(\\bar{\\lambda}_z-0.2)+\\bar{\\lambda}_z^2\\right)",
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
    type: "formula",
    key: "chi_z",
    valueType: { type: "number" },
    id: "chi_z",
    name: "Reduction factor z-z",
    symbol: "\\chi_z",
    expression: "\\frac{1}{\\Phi_z + \\sqrt{\\Phi_z^2 - \\bar{\\lambda}_z^2}}",
    meta: {
      sectionRef: "6.3.1.2",
      formulaRef: "(6.49)",
    },
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
    type: "formula",
    key: "N_b_z_Rd",
    valueType: { type: "number" },
    id: "N_b_z_Rd",
    name: "Buckling resistance z-z",
    symbol: "N_{b,z,Rd}",
    expression: "\\frac{\\chi_z A f_y}{\\gamma_{M1}}",
    unit: "N",
    meta: {
      sectionRef: "6.3.1.1",
      formulaRef: "(6.47)",
    },
    children: [
      {
        nodeId: "chi_z",
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
    unit: "N",
    children: [
      {
        nodeId: "N_Ed",
      },
    ],
  },
  {
    type: "check",
    key: "buckling_z_check",
    valueType: { type: "number" },
    id: "buckling_z_check",
    name: "Flexural buckling check z-z",
    verificationExpression: "\\frac{N_{Ed}}{N_{b,z,Rd}} \\leq 1.0",
    meta: {
      sectionRef: "6.3.1.1",
      verificationRef: "(6.46)",
    },
    children: [
      {
        nodeId: "abs_N_Ed",
      },
      {
        nodeId: "N_b_z_Rd",
      },
    ],
  },
]);

export type Nodes = typeof nodes;
