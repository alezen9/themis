import { z } from "zod";
import {
  annexValues,
  bucklingCurvesLTPolicyValues,
  coefficientFMethodValues,
  iFabricationTypeValues,
  interactionFactorMethodValues,
  loadApplicationLTValues,
  momentShapeValues,
  rhsChsFabricationTypeValues,
  sectionClassValues,
  shapeValues,
  supportConditionValues,
} from "./options";

const shapeSchema = z.strictObject({ shape: z.literal(shapeValues) });

const materialSchema = z.strictObject({ steel_grade_id: z.string() });

const crossSectionSchema = z.strictObject({
  section_id: z.string(),
  fabrication_type: z.literal([
    ...iFabricationTypeValues,
    ...rhsChsFabricationTypeValues,
  ]),
  section_class: z.literal(sectionClassValues),
});

const iGeometrySchema = z.strictObject({
  h_mm: z.number("Invalid value").positive("Value must be a positive number"),
  b_mm: z.number("Invalid value").positive("Value must be a positive number"),
  tw_mm: z.number("Invalid value").positive("Value must be a positive number"),
  tf_mm: z.number("Invalid value").positive("Value must be a positive number"),
  r_mm: z.number("Invalid value").positive("Value must be a positive number"),
});

const rhsGeometrySchema = z.strictObject({
  h_mm: z.number("Invalid value").positive("Value must be a positive number"),
  b_mm: z.number("Invalid value").positive("Value must be a positive number"),
  tw_mm: z.number("Invalid value").positive("Value must be a positive number"),
  ro_mm: z.number("Invalid value").positive("Value must be a positive number"),
  ri_mm: z.number("Invalid value").positive("Value must be a positive number"),
});

const chsGeometrySchema = z.strictObject({
  d_mm: z.number("Invalid value").positive("Value must be a positive number"),
  t_mm: z.number("Invalid value").positive("Value must be a positive number"),
});

const geometrySchema = z.strictObject({
  i_geometry: iGeometrySchema,
  rhs_geometry: rhsGeometrySchema,
  chs_geometry: chsGeometrySchema,
  L_m: z.number("Invalid value").positive("Value must be a positive number"),
});

const actionsSchema = z.strictObject({
  N_Ed_kN: z.number("Invalid value"),
  V_y_Ed_kN: z.number("Invalid value"),
  V_z_Ed_kN: z.number("Invalid value"),
  M_y_Ed_kNm: z.number("Invalid value"),
  M_z_Ed_kNm: z.number("Invalid value"),
});

const flexuralBucklingSchema = z.strictObject({
  k_y: z.number("Invalid value").positive("Value must be a positive number"),
  M_y_Ed_shape: z.literal(momentShapeValues),
  psi_y: z
    .number("Invalid value")
    .min(-1, "Value cannot be smaller than -1")
    .max(1, "Value cannot be greater than 1"),
  support_condition_y: z.literal(supportConditionValues),

  k_z: z.number("Invalid value").positive("Value must be a positive number"),
  M_z_Ed_shape: z.literal(momentShapeValues),
  psi_z: z
    .number("Invalid value")
    .min(-1, "Value cannot be smaller than -1")
    .max(1, "Value cannot be greater than 1"),
  support_condition_z: z.literal(supportConditionValues),
});

const stabilityChecksSchema = z.strictObject({
  include_torsional_modes: z.boolean(),
  k_T: z.number("Invalid value").positive("Value must be a positive number"),
  k_LT: z.number("Invalid value").positive("Value must be a positive number"),
  M_y_Ed_shape_LT: z.literal(momentShapeValues),
  psi_y_LT: z
    .number("Invalid value")
    .min(-1, "Value cannot be smaller than -1")
    .max(1, "Value cannot be greater than 1"),
  support_condition_LT: z.literal(supportConditionValues),
  load_LT: z.literal(loadApplicationLTValues),
});

const annexSchema = z.strictObject({
  annex_id: z.literal(annexValues),
  gamma_M0: z
    .number("Invalid value")
    .positive("Value must be a positive number"),
  gamma_M1: z
    .number("Invalid value")
    .positive("Value must be a positive number"),
  lambda_LT_0: z
    .number("Invalid value")
    .positive("Value must be a positive number"),
  beta_LT: z
    .number("Invalid value")
    .positive("Value must be a positive number"),

  f_method: z.literal(coefficientFMethodValues),
  interaction_factor_method: z.literal(interactionFactorMethodValues),
  buckling_curves_LT_policy: z.literal(bucklingCurvesLTPolicyValues),
});

export const schema = shapeSchema
  .and(materialSchema)
  .and(crossSectionSchema)
  .and(geometrySchema)
  .and(actionsSchema)
  .and(flexuralBucklingSchema)
  .and(stabilityChecksSchema)
  .and(annexSchema);

export type Ec3FormValues = z.infer<typeof schema>;
