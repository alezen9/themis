import { getBucklingCurves, getImperfectionFactor } from "@ndg/ndg-ec3";
import type { Section } from "./data";

/** All outputs are in mm-based units: A→mm², I→mm⁴, W→mm³, I_w→mm⁶, lengths→mm. */
export interface ComputedSectionProperties {
  A: number;
  Iy: number;
  Iz: number;
  Wpl_y: number;
  Wpl_z: number;
  Av_y: number;
  Av_z: number;
  It: number;
  Iw: number;
  /** Web thickness t_w (used in §6.2.8 bending+shear formulas) */
  tw: number;
  /** Clear web height h_w = h − 2t_f (used in §6.2.8 bending+shear formulas) */
  hw: number;
  /** Section shape family: "I" | "RHS" | "CHS" (used in §6.2.9.1 biaxial exponents) */
  section_shape: "I" | "RHS" | "CHS";
  bucklingY: string;
  bucklingZ: string;
  bucklingLT: string;
  alpha_y: number;
  alpha_z: number;
  alpha_LT: number;
}

/** Compute all section properties + buckling curves from raw dimensions. */
export function computeSectionProperties(section: Section): ComputedSectionProperties {
  if (section.shape === "I") return computeFlanged(section);
  if (section.shape === "CHS") return computeCHS(section);
  return computeRHS(section);
}

// ── I-section ──

function computeFlanged(s: {
  h: number;
  b: number;
  tw: number;
  tf: number;
  r: number;
  sectionType: string;
}): ComputedSectionProperties {
  const { h, b, tw, tf, r } = s;
  const hw = h - 2 * tf;

  // Area (including 4 quarter-circle fillet contributions)
  const A = 2 * b * tf + hw * tw + (4 - Math.PI) * r * r;

  // Second moments of area (rectangular approximation, no fillet)
  const Iy = (b * h ** 3 - (b - tw) * hw ** 3) / 12;
  const Iz = (2 * tf * b ** 3 + hw * tw ** 3) / 12;

  // Plastic section moduli
  const Wpl_y = b * tf * (h - tf) + (tw * hw ** 2) / 4;
  const Wpl_z = (tf * b ** 2) / 2 + (hw * tw ** 2) / 4;

  // Shear areas per EC3 §6.2.6
  const Av_z = A - 2 * b * tf + (tw + 2 * r) * tf;
  const Av_y = 2 * b * tf;

  // St. Venant torsion constant (thin-walled open section)
  const It = (2 * b * tf ** 3 + hw * tw ** 3) / 3;

  // Warping constant (doubly-symmetric I-section)
  const Iw = (Iz * hw ** 2) / 4;

  // Buckling curves
  const isRolled = !s.sectionType.toLowerCase().includes("welded");
  const h_over_b = h / b;
  const curves = getBucklingCurves("I", isRolled ? "rolled" : "welded", h_over_b, tf);

  // LTB curve per EC3 Table 6.5 (rolled I-sections)
  const bucklingLT = h_over_b > 2 ? "a" : "b";

  return {
    A, Iy, Iz, Wpl_y, Wpl_z, Av_y, Av_z, It, Iw,
    tw, hw,
    section_shape: "I",
    bucklingY: curves.y,
    bucklingZ: curves.z,
    bucklingLT,
    alpha_y: getImperfectionFactor(curves.y),
    alpha_z: getImperfectionFactor(curves.z),
    alpha_LT: getImperfectionFactor(bucklingLT),
  };
}

// ── RHS / SHS ──

function computeRHS(s: {
  h: number;
  b: number;
  tw: number;
  sectionType: string;
}): ComputedSectionProperties {
  const { h, b, tw } = s;
  const hi = h - 2 * tw;
  const bi = b - 2 * tw;

  const A = 2 * tw * (h + b - 2 * tw);
  const Iy = (b * h ** 3 - bi * hi ** 3) / 12;
  const Iz = (h * b ** 3 - hi * bi ** 3) / 12;
  const Wpl_y = (b * h ** 2) / 4 - (bi * hi ** 2) / 4;
  const Wpl_z = (h * b ** 2) / 4 - (hi * bi ** 2) / 4;

  // Shear areas: proportional split by wall orientation
  const Av_z = A * h / (b + h);
  const Av_y = A * b / (b + h);

  // Bredt torsion constant (thin-walled closed section)
  const Am = (h - tw) * (b - tw);
  const p = 2 * ((h - tw) + (b - tw));
  const It = (4 * Am ** 2 * tw) / p;

  // Warping constant ≈ 0 for closed sections
  const Iw = 0;

  // Buckling curves — assume hot-finished (rolled) for catalogue sections
  const curves = getBucklingCurves("RHS", "rolled", h / b, tw);
  // No LTB for closed sections
  const bucklingLT = "a";

  return {
    A, Iy, Iz, Wpl_y, Wpl_z, Av_y, Av_z, It, Iw,
    tw, hw: h - 2 * tw,
    section_shape: "RHS",
    bucklingY: curves.y,
    bucklingZ: curves.z,
    bucklingLT,
    alpha_y: getImperfectionFactor(curves.y),
    alpha_z: getImperfectionFactor(curves.z),
    alpha_LT: getImperfectionFactor(bucklingLT),
  };
}

// ── CHS ──

function computeCHS(s: {
  d: number;
  t: number;
  sectionType: string;
}): ComputedSectionProperties {
  const { d, t } = s;
  const di = d - 2 * t;

  const A = (Math.PI / 4) * (d ** 2 - di ** 2);
  const I = (Math.PI / 64) * (d ** 4 - di ** 4);
  const Iy = I;
  const Iz = I;
  const Wpl = (d ** 3 - di ** 3) / 6;
  const Wpl_y = Wpl;
  const Wpl_z = Wpl;

  // Shear area
  const Av = (2 * A) / Math.PI;
  const Av_y = Av;
  const Av_z = Av;

  // Torsion constant = 2 * I for circular
  const It = 2 * I;
  const Iw = 0;

  const curves = getBucklingCurves("CHS", "rolled", 1, t);
  const bucklingLT = "a";

  return {
    A, Iy, Iz, Wpl_y, Wpl_z, Av_y, Av_z, It, Iw,
    tw: t, hw: d - 2 * t,
    section_shape: "CHS",
    bucklingY: curves.y,
    bucklingZ: curves.z,
    bucklingLT,
    alpha_y: getImperfectionFactor(curves.y),
    alpha_z: getImperfectionFactor(curves.z),
    alpha_LT: getImperfectionFactor(bucklingLT),
  };
}
