export const SHAPE_OPTIONS = ["I", "RHS", "CHS"] as const;
export const FABRICATION_TYPE_OPTIONS = ["rolled", "welded"] as const;

export const MOMENT_SHAPE_OPTIONS = [
  "uniform",
  "linear",
  "parabolic",
  "triangular",
] as const;

export const SUPPORT_CONDITION_VALUES = [
  "pinned-pinned",
  "fixed-pinned",
  "pinned-fixed",
  "fixed-fixed",
] as const;

export const SUPPORT_CONDITION_OPTIONS = [
  "pinned-pinned",
  "pinned-fixed",
  "fixed-fixed",
] as const;

export const LOAD_APPLICATION_LT_OPTIONS = [
  "top-flange",
  "centroid",
  "bottom-flange",
] as const;

export const TORSIONAL_DEFORMATION_OPTIONS = ["yes", "no"] as const;

export const INTERACTION_FACTOR_METHOD_OPTIONS = [
  "both",
  "method1",
  "method2",
  "any",
] as const;

export const COEFFICIENT_F_METHOD_OPTIONS = [
  "default-equation",
  "force-1.0",
] as const;

export const BUCKLING_CURVES_LT_POLICY_OPTIONS = [
  "default",
  "general",
] as const;

export const SECTION_CLASS_OPTIONS = ["auto", 1, 2, 3] as const;
export const RESOLVED_SECTION_CLASS_OPTIONS = [1, 2, 3, 4] as const;
