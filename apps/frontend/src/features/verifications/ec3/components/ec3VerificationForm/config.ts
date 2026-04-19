import { eurocodeAnnex, italianAnnex } from "@ndg/ndg-ec3";
import { flangedSections } from "../../data/flangedSections";
import { steelGrades } from "../../data/steelGrades";
import type { Ec3FormValues } from "../../domain/formSchema";

const DEFAULT_SECTION =
  flangedSections.find((section) => section.id === "IPE300") ??
  flangedSections[0]!;
const DEFAULT_GRADE =
  steelGrades.find(
    (grade) => grade.id === "S235" && grade.norm === "EN10025-2",
  ) ?? steelGrades[0]!;
const DEFAULT_ANNEX = italianAnnex;

type AnnexOption = {
  id: string;
  name: string;
  coefficients: Record<string, number>;
};

export const ANNEXES: readonly AnnexOption[] = [italianAnnex, eurocodeAnnex];

export const CUSTOM_SECTION_ID = "custom";

export const DEFAULT_EC3_FORM_VALUES: Ec3FormValues = {
  shape: "I",
  sectionId: DEFAULT_SECTION.id,
  fabricationType: "rolled",
  h: DEFAULT_SECTION.h,
  b: DEFAULT_SECTION.b,
  tw: DEFAULT_SECTION.tw,
  tf: DEFAULT_SECTION.tf,
  r: DEFAULT_SECTION.r,
  gradeId: `${DEFAULT_GRADE.norm}:${DEFAULT_GRADE.id}`,
  annexId: DEFAULT_ANNEX.id as Ec3FormValues["annexId"],
  gamma_M0: DEFAULT_ANNEX.coefficients.gamma_M0,
  gamma_M1: DEFAULT_ANNEX.coefficients.gamma_M1,
  lambda_LT_0: DEFAULT_ANNEX.coefficients.lambda_LT_0,
  beta_LT: DEFAULT_ANNEX.coefficients.beta_LT,
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
};
