import { Option } from "@components/inputs/InputSelect";
import { eurocodeAnnex, italianAnnex } from "@ndg/ndg-ec3";
import { NationalAnnex } from "@ndg/ndg-editor";

export const ANNEX_OPTIONS = [italianAnnex, eurocodeAnnex].map<
  Option<NationalAnnex>
>((annex) => ({ label: annex.name, value: annex.id, ctx: annex }));

export const MOMENT_SHAPE_OPTIONS = [
  { value: "uniform", label: "Uniform" },
  { value: "linear", label: "Linear" },
  { value: "parabolic", label: "Parabolic" },
  { value: "triangular", label: "Triangular" },
];

export const SUPPORT_CONDITION_OPTIONS = [
  { value: "pinned-pinned", label: "Pinned-pinned" },
  { value: "fixed-pinned", label: "Fixed-pinned" },
  { value: "pinned-fixed", label: "Pinned-fixed" },
  { value: "fixed-fixed", label: "Fixed-fixed" },
];

export const LOAD_APPLICATION_LT_OPTIONS = [
  { value: "top-flange", label: "Top flange" },
  { value: "centroid", label: "Centroid" },
  { value: "bottom-flange", label: "Bottom flange" },
];

export const INTERACTION_FACTOR_METHOD_OPTIONS = [
  { value: "both", label: "Both" },
  { value: "method1", label: "Method 1" },
  { value: "method2", label: "Method 2" },
  { value: "any", label: "Any" },
];

export const COEFFICIENT_F_METHOD_OPTIONS = [
  { value: "default-equation", label: "Default equation" },
  { value: "force-1.0", label: "Force 1.0" },
];

export const BUCKLING_CURVES_LT_POLICY_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "general", label: "General" },
];
