import type { VerificationDefinition } from "@ndg/ndg-core";

/** §6.2.5 — Bending resistance about z-z: M_z_Ed / M_c_z_Rd ≤ 1.0 */

const nodes = [
  {
    type: "user-input",
    key: "M_z_Ed",
    valueType: "number",
    id: "bendz-M-z-Ed",
    name: "Design bending moment about z-z",
    symbol: "M_{z,Ed}",
    unit: "N·mm",
    children: [],
  },
  {
    type: "user-input",
    key: "Wpl_z",
    valueType: "number",
    id: "bendz-Wpl-z",
    name: "Plastic section modulus about z-z",
    symbol: "W_{pl,z}",
    unit: "mm³",
    children: [],
  },
  {
    type: "user-input",
    key: "fy",
    valueType: "number",
    id: "bendz-fy",
    name: "Yield strength",
    symbol: "f_y",
    unit: "MPa",
    children: [],
  },
  {
    type: "coefficient",
    key: "gamma_M0",
    valueType: "number",
    id: "bendz-gamma-M0",
    name: "Partial safety factor",
    symbol: "\\gamma_{M0}",
    meta: { sectionRef: "6.1" },
    children: [],
  },
  {
    type: "formula",
    key: "M_c_z_Rd",
    valueType: "number",
    id: "bendz-M-c-z-Rd",
    name: "Design resistance for bending about z-z",
    symbol: "M_{c,z,Rd}",
    expression: "\\frac{W_{pl,z} \\cdot f_y}{\\gamma_{M0}}",
    unit: "N·mm",
    meta: { sectionRef: "6.2.5", formulaRef: "(6.13)" },
    children: [
      { nodeId: "bendz-Wpl-z" },
      { nodeId: "bendz-fy" },
      { nodeId: "bendz-gamma-M0" },
    ],
  },
  {
    type: "check",
    key: "bending_z_check",
    valueType: "number",
    id: "bendz-check",
    name: "Bending resistance about z-z check",
    verificationExpression: "\\frac{M_{z,Ed}}{M_{c,z,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.5", verificationRef: "(6.12)" },
    children: [
      { nodeId: "bendz-M-z-Ed" },
      { nodeId: "bendz-M-c-z-Rd" },
    ],
  },
] as const;

export const ulsBendingZ: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    M_c_z_Rd: ({ Wpl_z, fy, gamma_M0 }) => (Wpl_z * fy) / gamma_M0,
    bending_z_check: ({ M_z_Ed, M_c_z_Rd }) => Math.abs(M_z_Ed) / M_c_z_Rd,
  },
};
