/**
 * Equivalent uniform moment factors Cm per EC3 Table B.3.
 * Simplified — linear moment distribution only for now.
 */
export function getCm(psi: number): number {
  // Linear moment: Cm = 0.6 + 0.4·ψ ≥ 0.4
  return Math.max(0.4, 0.6 + 0.4 * psi);
}
