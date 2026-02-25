import type { VerificationDefinition } from "@ndg/ndg-core";

/** §6.2.4 — Compression resistance: N_Ed / N_c_Rd ≤ 1.0 */

const nodes = [
  {
    type: "user-input",
    key: "N_Ed",
    valueType: "number",
    id: "comp-N-Ed",
    name: "Design compression force",
    symbol: "N_{Ed}",
    unit: "N",
    children: [],
  },
  {
    type: "user-input",
    key: "A",
    valueType: "number",
    id: "comp-A",
    name: "Cross-sectional area",
    symbol: "A",
    unit: "mm²",
    children: [],
  },
  {
    type: "user-input",
    key: "fy",
    valueType: "number",
    id: "comp-fy",
    name: "Yield strength",
    symbol: "f_y",
    unit: "MPa",
    children: [],
  },
  {
    type: "coefficient",
    key: "gamma_M0",
    valueType: "number",
    id: "comp-gamma-M0",
    name: "Partial safety factor",
    symbol: "\\gamma_{M0}",
    meta: { sectionRef: "6.1" },
    children: [],
  },
  {
    type: "formula",
    key: "N_c_Rd",
    valueType: "number",
    id: "comp-N-c-Rd",
    name: "Design resistance to normal forces",
    symbol: "N_{c,Rd}",
    expression: "\\frac{A \\cdot f_y}{\\gamma_{M0}}",
    unit: "N",
    meta: { sectionRef: "6.2.4", formulaRef: "(6.11)" },
    children: [
      { nodeId: "comp-A" },
      { nodeId: "comp-fy" },
      { nodeId: "comp-gamma-M0" },
    ],
  },
  {
    type: "check",
    key: "compression_check",
    valueType: "number",
    id: "comp-check",
    name: "Cross-section compression resistance",
    verificationExpression: "\\frac{N_{Ed}}{N_{c,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.4", verificationRef: "(6.10)" },
    children: [
      { nodeId: "comp-N-Ed" },
      { nodeId: "comp-N-c-Rd" },
    ],
  },
] as const;

export const ulsCompression: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    N_c_Rd: ({ A, fy, gamma_M0 }) => (A * fy) / gamma_M0,
    compression_check: ({ N_Ed, N_c_Rd }) => Math.abs(N_Ed) / N_c_Rd,
  },
};
