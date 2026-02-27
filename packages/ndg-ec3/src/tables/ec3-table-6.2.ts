import type { Shape } from "../data/types";

/**
 * EC3 Table 6.2 -- Selection of buckling curves for cross-sections.
 * For custom sections without catalogue data.
 */
export const getBucklingCurves = (
  shape: Shape,
  sectionType: "rolled" | "welded",
  h_over_b: number,
  tf: number,
) => {
  if (shape === "CHS") {
    return { y: "a", z: "a" };
  }

  if (shape === "RHS") {
    // Hot finished: "a", Cold formed: "c" -- assume hot finished for rolled
    return sectionType === "rolled"
      ? { y: "a", z: "a" }
      : { y: "b", z: "b" };
  }

  // I-sections
  if (sectionType === "rolled") {
    if (h_over_b > 1.2) {
      // h/b > 1.2
      return tf <= 40
        ? { y: "a", z: "b" }
        : { y: "b", z: "c" };
    } else {
      // h/b <= 1.2
      return tf <= 100
        ? { y: "b", z: "c" }
        : { y: "d", z: "d" };
    }
  } else {
    // Welded I-sections
    return tf <= 40
      ? { y: "b", z: "c" }
      : { y: "c", z: "d" };
  }
};
