import { italianAnnex } from "@ndg/ndg-ec3";
import { flangedSections } from "./data/flangedSections";
import { composeSteelGradeId, steelGrades } from "./data/steelGrades";
import { Ec3FormValues } from "./schema";

const defaultSection =
  flangedSections.find(({ id }) => id === "IPE300") ?? flangedSections[0];

const defaultSteelGrade =
  steelGrades.find(({ id, norm }) => id === "S235" && norm === "EN10025-2") ??
  steelGrades[0];

const defaultAnnex = italianAnnex;

export const defaultValues = {
  shape: "I",
  sectionId: defaultSection.id,
  fabricationType: "rolled",
  h: defaultSection.h,
  b: defaultSection.b,
  tw: defaultSection.tw,
  tf: defaultSection.tf,
  r: defaultSection.r,
  gradeId: composeSteelGradeId(defaultSteelGrade),
  annexId: defaultAnnex.id,
  gamma_M0: defaultAnnex.coefficients.gamma_M0,
  gamma_M1: defaultAnnex.coefficients.gamma_M1,
  lambda_LT_0: defaultAnnex.coefficients.lambda_LT_0,
  beta_LT: defaultAnnex.coefficients.beta_LT,
  N_Ed: -100_000,
  M_y_Ed: 20_000_000,
  M_z_Ed: 5_000_000,
  V_y_Ed: 10_000,
  V_z_Ed: 50_000,
  section_class: "auto",
  L: 5000,
  k_y: 1,
  k_z: 1,
  interaction_factor_method: "both",
  moment_shape_y: "linear",
  psi_y: 0,
  moment_shape_z: "linear",
  psi_z: 0,
  torsional_deformations: "yes",
  k_LT: 1,
  k_T: 1,
  coefficient_f_method: "default-equation",
  buckling_curves_LT_policy: "default",
  moment_shape_LT: "uniform",
} satisfies Ec3FormValues;
