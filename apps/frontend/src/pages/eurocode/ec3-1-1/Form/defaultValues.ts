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
  L: 5, // m
  i_geometry: {
    h: defaultISection.h, // mm
    b: defaultISection.b, // mm
    tw: defaultISection.tw, // mm
    tf: defaultISection.tf, // mm
    r: defaultISection.r, // mm
  },
  rhs_geometry: {
    h: defaultRHSSection.h, // mm
    b: defaultRHSSection.b, // mm
    tw: defaultRHSSection.tw, // mm
    ri: defaultRHSSection.ri, // mm
    ro: defaultRHSSection.ro, // mm
  },
  chs_geometry: {
    d: defaultCHSSection.d, // mm
    t: defaultCHSSection.t, // mm
  },

  // ACTIONS
  N_Ed: -100_000, // kN
  V_y_Ed: 10_000, // kN
  V_z_Ed: 50_000, // kN
  M_y_Ed: 20_000_000, // kNm
  M_z_Ed: 5_000_000, // kN

  // FLEXURAL BUCKLING
  k_y: 1,
  M_y_shape: "linear",
  psi_y: 0,
  support_condition_y: "fixed-fixed",
  k_z: 1,
  M_z_shape: "linear",
  psi_z: 0,
  support_condition_z: "fixed-fixed",

  // LATERAL TORSIONAL BUCKLING
  active_LT: true,
  k_LT: 1,
  M_LT_shape: "uniform",
  psi_LT: 0,
  support_condition_LT: "fixed-fixed",
  load_LT: "top-flange",

  // TORSIONAL BUCKLING
  active_T: true,
  k_T: 1,

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
