import type { VerificationDefinition } from "@ndg/ndg-core";

/** §6.2.5 — Bending resistance about y-y: M_y_Ed / M_c_y_Rd ≤ 1.0 */

const nodes = [
  {
    type: "user-input",
    key: "M_y_Ed",
    valueType: "number",
    id: "bendy-M-y-Ed",
    name: "Design bending moment about y-y",
    symbol: "M_{y,Ed}",
    unit: "N·mm",
    children: [],
  },
  {
    type: "user-input",
    key: "Wpl_y",
    valueType: "number",
    id: "bendy-Wpl-y",
    name: "Plastic section modulus about y-y",
    symbol: "W_{pl,y}",
    unit: "mm³",
    children: [],
  },
  {
    type: "user-input",
    key: "fy",
    valueType: "number",
    id: "bendy-fy",
    name: "Yield strength",
    symbol: "f_y",
    unit: "MPa",
    children: [],
  },
  {
    type: "coefficient",
    key: "gamma_M0",
    valueType: "number",
    id: "bendy-gamma-M0",
    name: "Partial safety factor",
    symbol: "\\gamma_{M0}",
    meta: { sectionRef: "6.1" },
    children: [],
  },
  {
    type: "formula",
    key: "M_c_y_Rd",
    valueType: "number",
    id: "bendy-M-c-y-Rd",
    name: "Design resistance for bending about y-y",
    symbol: "M_{c,y,Rd}",
    expression: "\\frac{W_{pl,y} \\cdot f_y}{\\gamma_{M0}}",
    unit: "N·mm",
    meta: { sectionRef: "6.2.5", formulaRef: "(6.13)" },
    children: [
      { nodeId: "bendy-Wpl-y" },
      { nodeId: "bendy-fy" },
      { nodeId: "bendy-gamma-M0" },
    ],
  },
  {
    type: "check",
    key: "bending_y_check",
    valueType: "number",
    id: "bendy-check",
    name: "Bending resistance about y-y check",
    verificationExpression: "\\frac{M_{y,Ed}}{M_{c,y,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.5", verificationRef: "(6.12)" },
    children: [
      { nodeId: "bendy-M-y-Ed" },
      { nodeId: "bendy-M-c-y-Rd" },
    ],
  },
] as const;

export const ulsBendingY: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    M_c_y_Rd: ({ Wpl_y, fy, gamma_M0 }) => (Wpl_y * fy) / gamma_M0,
    bending_y_check: ({ M_y_Ed, M_c_y_Rd }) => Math.abs(M_y_Ed) / M_c_y_Rd,
  },
};
