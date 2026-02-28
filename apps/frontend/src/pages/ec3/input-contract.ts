import { ec3Verifications } from "@ndg/ndg-ec3";

export const REQUIRED_RUNTIME_INPUT_KEYS = [
  "A",
  "Av_y",
  "Av_z",
  "E",
  "G",
  "It",
  "Iw",
  "Iy",
  "Iz",
  "L",
  "M_y_Ed",
  "M_z_Ed",
  "N_Ed",
  "V_y_Ed",
  "V_z_Ed",
  "Wel_y",
  "Wel_z",
  "Wpl_y",
  "Wpl_z",
  "alpha_LT",
  "alpha_y",
  "alpha_z",
  "fy",
  "hw",
  "k_LT",
  "k_y",
  "k_z",
  "load_application_LT",
  "moment_shape_LT",
  "moment_shape_y",
  "moment_shape_z",
  "psi_LT",
  "psi_y",
  "psi_z",
  "section_class",
  "section_shape",
  "support_condition_LT",
  "support_condition_y",
  "support_condition_z",
  "tw",
] as const;

export const EDITABLE_INPUT_KEYS = [
  "N_Ed",
  "M_y_Ed",
  "M_z_Ed",
  "V_y_Ed",
  "V_z_Ed",
  "L",
  "k_y",
  "k_z",
  "k_LT",
  "moment_shape_y",
  "support_condition_y",
  "moment_shape_z",
  "support_condition_z",
  "moment_shape_LT",
  "support_condition_LT",
  "load_application_LT",
  "psi_y",
  "psi_z",
  "psi_LT",
  "section_class",
] as const;

export const SECTION_CLASS_OPTIONS = [1, 2, 3] as const;

export const ANNEX_EDITABLE_KEYS = [
  "gamma_M0",
  "gamma_M1",
  "lambda_LT_0",
  "beta_LT",
] as const;

export const DERIVED_INPUT_KEYS = REQUIRED_RUNTIME_INPUT_KEYS.filter(
  (key) => !EDITABLE_INPUT_KEYS.includes(key as (typeof EDITABLE_INPUT_KEYS)[number]),
);

export const getRuntimeInputKeysFromGraph = (): string[] => {
  const keys = new Set<string>();
  for (const verification of ec3Verifications) {
    for (const node of verification.nodes) {
      if (node.type === "user-input") keys.add(node.key);
    }
  }
  return [...keys].sort();
};
