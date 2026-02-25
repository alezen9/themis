import type { VerificationDefinition } from "@ndg/ndg-core";

/** §6.2.3 — Tension resistance: N_Ed / N_pl_Rd ≤ 1.0 */

const nodes = [
  {
    type: "user-input",
    key: "N_Ed",
    valueType: "number",
    id: "tension-N-Ed",
    name: "Design tensile force",
    symbol: "N_{Ed}",
    unit: "N",
    children: [],
  },
  {
    type: "user-input",
    key: "A",
    valueType: "number",
    id: "tension-A",
    name: "Cross-sectional area",
    symbol: "A",
    unit: "mm²",
    children: [],
  },
  {
    type: "user-input",
    key: "fy",
    valueType: "number",
    id: "tension-fy",
    name: "Yield strength",
    symbol: "f_y",
    unit: "MPa",
    children: [],
  },
  {
    type: "coefficient",
    key: "gamma_M0",
    valueType: "number",
    id: "tension-gamma-M0",
    name: "Partial safety factor",
    symbol: "\\gamma_{M0}",
    meta: { sectionRef: "6.1" },
    children: [],
  },
  {
    type: "formula",
    key: "N_pl_Rd",
    valueType: "number",
    id: "tension-N-pl-Rd",
    name: "Design plastic resistance to normal forces",
    symbol: "N_{pl,Rd}",
    expression: "\\frac{A \\cdot f_y}{\\gamma_{M0}}",
    unit: "N",
    meta: { sectionRef: "6.2.3", formulaRef: "(6.6)" },
    children: [
      { nodeId: "tension-A" },
      { nodeId: "tension-fy" },
      { nodeId: "tension-gamma-M0" },
    ],
  },
  {
    type: "check",
    key: "tension_check",
    valueType: "number",
    id: "tension-check",
    name: "Tension resistance check",
    verificationExpression: "\\frac{N_{Ed}}{N_{pl,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.3", verificationRef: "(6.5)" },
    children: [
      { nodeId: "tension-N-Ed" },
      { nodeId: "tension-N-pl-Rd" },
    ],
  },
] as const;

export const ulsTension: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    N_pl_Rd: ({ A, fy, gamma_M0 }) => (A * fy) / gamma_M0,
    tension_check: ({ N_Ed, N_pl_Rd }) => Math.abs(N_Ed) / N_pl_Rd,
  },
};
