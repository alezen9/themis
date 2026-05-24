import { defineNodes } from "@ndg/ndg-core";

export const nodes = defineNodes([
  {
    id: "ratio",
    type: "check",
    key: "ratio",
    valueType: { type: "number" },
    name: "Bending resistance check about y-y",
    verificationExpression:
      "\\frac{\\left|M_{y,Ed}\\right|}{M_{c,y,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.5", verificationRef: "(6.12)" },
    children: [{ nodeId: "M_y_Ed_Nmm" }, { nodeId: "M_c_y_Rd_Nmm" }],
  },
  {
    id: "M_y_Ed_Nmm",
    type: "user-input",
    key: "M_y_Ed_Nmm",
    valueType: { type: "number" },
    name: "Design bending moment about y-y",
    symbol: "M_{y,Ed}",
    unit: "\\mathrm{N\\cdot mm}",
    children: [],
  },
  {
    id: "M_c_y_Rd_Nmm",
    type: "formula",
    key: "M_c_y_Rd_Nmm",
    valueType: { type: "number" },
    name: "Design resistance moment about y-y",
    symbol: "M_{c,y,Rd}",
    expression: "\\frac{W_{y,res} \\cdot f_y}{\\gamma_{M0}}",
    unit: "\\mathrm{N\\cdot mm}",
    meta: { sectionRef: "6.2.5", formulaRef: "(6.13)" },
    children: [
      { nodeId: "W_y_res_mm3" },
      { nodeId: "fy_MPa" },
      { nodeId: "gamma_M0" },
    ],
  },
  {
    id: "W_y_res_mm3",
    type: "derived",
    key: "W_y_res_mm3",
    valueType: { type: "number" },
    name: "Class-dependent resistance modulus about y-y",
    symbol: "W_{y,res}",
    unit: "\\mathrm{mm^{3}}",
    children: [
      {
        nodeId: "Wpl_y_mm3",
        when: {
          or: [
            { eq: ["section_class", { value: 1 }] },
            { eq: ["section_class", { value: 2 }] },
          ],
        },
      },
      { nodeId: "Wel_y_mm3", when: { eq: ["section_class", { value: 3 }] } },
    ],
  },
  {
    id: "Wpl_y_mm3",
    type: "user-input",
    key: "Wpl_y_mm3",
    valueType: { type: "number" },
    name: "Plastic section modulus about y-y",
    symbol: "W_{pl,y}",
    unit: "\\mathrm{mm^{3}}",
    children: [],
  },
  {
    id: "Wel_y_mm3",
    type: "user-input",
    key: "Wel_y_mm3",
    valueType: { type: "number" },
    name: "Elastic section modulus about y-y",
    symbol: "W_{el,y}",
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
