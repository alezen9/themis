import { italianAnnex } from "@ndg/ndg-ec3";
import { flangedSections } from "../data/flangedSections";
import { composeSteelGradeId, steelGrades } from "../data/steelGrades";
import { Ec3FormValues } from "./schema";
import { hollowSections } from "../data/hollowSections";
import { circularSections } from "../data/circularSections";

export const defaultISection =
  flangedSections.find(({ id }) => id === "IPE300") ?? flangedSections[0];

export const defaultRHSSection =
  hollowSections.find(({ id }) => id === "RHS300x200x6.3") ?? hollowSections[0];

export const defaultCHSSection =
  circularSections.find(({ id }) => id === "CHS323.9x6.3") ??
  circularSections[0];

const defaultSteelGrade =
  steelGrades.find(
    ({ id, standard }) => id === "S235" && standard === "EN10025-2",
  ) ?? steelGrades[0];

export const defaultValues = {
  // SHAPE
  shape: "I",

  // MATERIAL
  steel_grade_id: composeSteelGradeId(defaultSteelGrade),

  // CROSS SECTION
  section_id: defaultISection.id,
  fabrication_type: "rolled",
  section_class: "auto",

  // GEOMETRY
  L_m: 5.0,
  i_geometry: {
    h_mm: defaultISection.h_mm,
    b_mm: defaultISection.b_mm,
    tw_mm: defaultISection.tw_mm,
    tf_mm: defaultISection.tf_mm,
    r_mm: defaultISection.r_mm,
  },
  rhs_geometry: {
    h_mm: defaultRHSSection.h_mm,
    b_mm: defaultRHSSection.b_mm,
    tw_mm: defaultRHSSection.tw_mm,
    ri_mm: defaultRHSSection.ri_mm,
    ro_mm: defaultRHSSection.ro_mm,
  },
  chs_geometry: { d_mm: defaultCHSSection.d_mm, t_mm: defaultCHSSection.t_mm },

  // ACTIONS
  N_Ed_kN: -100,
  V_y_Ed_kN: 10,
  V_z_Ed_kN: 50,
  M_y_Ed_kNm: 20,
  M_z_Ed_kNm: 5,

  // FLEXURAL BUCKLING
  k_y: 1,
  M_y_Ed_shape: "linear",
  psi_y: 0,
  support_condition_y: "fixed-fixed",
  k_z: 1,
  M_z_Ed_shape: "linear",
  psi_z: 0,
  support_condition_z: "fixed-fixed",

  // STABILITY CHECKS
  include_torsional_modes: true,
  k_T: 1,
  k_LT: 1,
  M_y_Ed_shape_LT: "uniform",
  psi_y_LT: 0,
  support_condition_LT: "fixed-fixed",
  load_LT: "top-flange",

  // NATIONAL ANNEX
  annex_id: italianAnnex.id,
  gamma_M0: italianAnnex.coefficients.gamma_M0,
  gamma_M1: italianAnnex.coefficients.gamma_M1,
  lambda_LT_0: italianAnnex.coefficients.lambda_LT_0,
  beta_LT: italianAnnex.coefficients.beta_LT,
  f_method: italianAnnex.coefficients.f_method,
  interaction_factor_method:
    italianAnnex.coefficients.interaction_factor_method,
  buckling_curves_LT_policy:
    italianAnnex.coefficients.buckling_curves_LT_policy,
} satisfies Ec3FormValues;
