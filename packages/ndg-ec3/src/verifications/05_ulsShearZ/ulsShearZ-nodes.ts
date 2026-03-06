import { defineNodes } from "@ndg/ndg-core";

export const nodes = defineNodes([
  {
    id: "shear_z_check",
    type: "check",
    key: "shear_z_check",
    valueType: { type: "number" },
    name: "Shear resistance check about z-z",
    verificationExpression:
      "\\frac{\\left|V_{z,Ed}\\right|}{V_{pl,z,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.6", verificationRef: "(6.17)" },
    children: [{ nodeId: "V_z_Ed" }, { nodeId: "V_pl_z_Rd" }],
  },
  {
    id: "V_z_Ed",
    type: "user-input",
    key: "V_z_Ed",
    valueType: { type: "number" },
    name: "Design shear force about z-z",
    symbol: "V_{z,Ed}",
    unit: "\\mathrm{N}",
    children: [],
  },
  {
    id: "V_pl_z_Rd",
    type: "formula",
    key: "V_pl_z_Rd",
    valueType: { type: "number" },
    name: "Plastic shear resistance about z-z",
    symbol: "V_{pl,z,Rd}",
    expression: "\\frac{A_{v,z} \\cdot f_y}{\\sqrt{3}\\,\\gamma_{M0}}",
    unit: "\\mathrm{N}",
    meta: { sectionRef: "6.2.6", formulaRef: "(6.18)" },
    children: [
      { nodeId: "Av_z" },
      { nodeId: "fy" },
      { nodeId: "gamma_M0" },
    ],
  },
  {
    id: "Av_z",
    type: "user-input",
    key: "Av_z",
    valueType: { type: "number" },
    name: "Shear area about z-z",
    symbol: "A_{v,z}",
    unit: "\\mathrm{mm^{2}}",
    children: [],
  },
  {
    id: "fy",
    type: "user-input",
    key: "fy",
    valueType: { type: "number" },
    name: "Yield strength",
    symbol: "f_y",
    unit: "\\mathrm{MPa}",
    children: [],
  },
  {
    id: "gamma_M0",
    type: "coefficient",
    key: "gamma_M0",
    valueType: { type: "number" },
    name: "Partial safety factor",
    symbol: "\\gamma_{M0}",
    meta: { sectionRef: "6.1" },
    children: [],
  },
]);

export type Nodes = typeof nodes;
