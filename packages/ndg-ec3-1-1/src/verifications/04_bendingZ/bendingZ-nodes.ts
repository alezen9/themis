import { defineNodes } from "@ndg/ndg-core";

export const nodes = defineNodes([
  {
    id: "ratio",
    type: "check",
    key: "ratio",
    valueType: { type: "number" },
    name: "Bending resistance check about z-z",
    verificationExpression:
      "\\frac{\\left|M_{z,Ed}\\right|}{M_{c,z,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.5", verificationRef: "(6.12)" },
    children: [{ nodeId: "M_z_Ed_Nmm" }, { nodeId: "M_c_z_Rd_Nmm" }],
  },
  {
    id: "M_z_Ed_Nmm",
    type: "user-input",
    key: "M_z_Ed_Nmm",
    valueType: { type: "number" },
    name: "Design bending moment about z-z",
    symbol: "M_{z,Ed}",
    unit: "\\mathrm{N\\cdot mm}",
    children: [],
  },
  {
    id: "M_c_z_Rd_Nmm",
    type: "formula",
    key: "M_c_z_Rd_Nmm",
    valueType: { type: "number" },
    name: "Design resistance moment about z-z",
    symbol: "M_{c,z,Rd}",
    expression: "\\frac{W_{z,res} \\cdot f_y}{\\gamma_{M0}}",
    unit: "\\mathrm{N\\cdot mm}",
    meta: { sectionRef: "6.2.5", formulaRef: "(6.13)" },
    children: [
      { nodeId: "W_z_res_mm3" },
      { nodeId: "fy_MPa" },
      { nodeId: "gamma_M0" },
    ],
  },
  {
    id: "W_z_res_mm3",
    type: "formula",
    key: "W_z_res_mm3",
    valueType: { type: "number" },
    name: "Class-dependent resistance modulus about z-z",
    symbol: "W_{z,res}",
    unit: "\\mathrm{mm^{3}}",
    children: [
      {
        nodeId: "Wpl_z_mm3",
        when: {
          or: [
            { eq: ["section_class", { value: 1 }] },
            { eq: ["section_class", { value: 2 }] },
          ],
        },
      },
      { nodeId: "Wel_z_mm3", when: { eq: ["section_class", { value: 3 }] } },
    ],
  },
  {
    id: "Wpl_z_mm3",
    type: "user-input",
    key: "Wpl_z_mm3",
    valueType: { type: "number" },
    name: "Plastic section modulus about z-z",
    symbol: "W_{pl,z}",
    unit: "\\mathrm{mm^{3}}",
    children: [],
  },
  {
    id: "Wel_z_mm3",
    type: "user-input",
    key: "Wel_z_mm3",
    valueType: { type: "number" },
    name: "Elastic section modulus about z-z",
    symbol: "W_{el,z}",
    unit: "\\mathrm{mm^{3}}",
    children: [],
  },
  {
    id: "fy_MPa",
    type: "user-input",
    key: "fy_MPa",
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
