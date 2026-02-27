/**
 * Equivalent uniform moment factors Cm per EC3 Table B.3.
 * Simplified -- linear moment distribution only for now.
 */
export const getCm = (psi: number) => {
  // Linear moment: Cm = 0.6 + 0.4*psi >= 0.4
  return Math.max(0.4, 0.6 + 0.4 * psi);
};
