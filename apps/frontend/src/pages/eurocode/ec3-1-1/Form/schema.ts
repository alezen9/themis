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
import { schemaRefiner } from "./schemaRefiner";

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

const REQUIRED_NUMBER_MESSAGE = "Enter a valid number";
const POSITIVE_NUMBER_MESSAGE = "Value has to be positive";
const MIN_MINUS_ONE_MESSAGE = "Value has to be greater than -1";
const MAX_ONE_MESSAGE = "Value has to be smaller than 1";
const MAX_VALUE_MESSAGE = "Value too large, safety cap";

const iGeometrySchema = z.strictObject({
  h_mm: z
    .number(REQUIRED_NUMBER_MESSAGE)
    .positive(POSITIVE_NUMBER_MESSAGE)
    .max(2000, MAX_VALUE_MESSAGE),
  b_mm: z
    .number(REQUIRED_NUMBER_MESSAGE)
    .positive(POSITIVE_NUMBER_MESSAGE)
    .max(2000, MAX_VALUE_MESSAGE),
  tw_mm: z
    .number(REQUIRED_NUMBER_MESSAGE)
    .positive(POSITIVE_NUMBER_MESSAGE)
    .max(200, MAX_VALUE_MESSAGE),
  tf_mm: z
    .number(REQUIRED_NUMBER_MESSAGE)
    .positive(POSITIVE_NUMBER_MESSAGE)
    .max(200, MAX_VALUE_MESSAGE),
  r_mm: z
    .number(REQUIRED_NUMBER_MESSAGE)
    .positive(POSITIVE_NUMBER_MESSAGE)
    .max(500, MAX_VALUE_MESSAGE),
});

const rhsGeometrySchema = z.strictObject({
  h_mm: z
    .number(REQUIRED_NUMBER_MESSAGE)
    .positive(POSITIVE_NUMBER_MESSAGE)
    .max(2000, MAX_VALUE_MESSAGE),
  b_mm: z
    .number(REQUIRED_NUMBER_MESSAGE)
    .positive(POSITIVE_NUMBER_MESSAGE)
    .max(2000, MAX_VALUE_MESSAGE),
  tw_mm: z
    .number(REQUIRED_NUMBER_MESSAGE)
    .positive(POSITIVE_NUMBER_MESSAGE)
    .max(200, MAX_VALUE_MESSAGE),
  ro_mm: z
    .number(REQUIRED_NUMBER_MESSAGE)
    .positive(POSITIVE_NUMBER_MESSAGE)
    .max(500, MAX_VALUE_MESSAGE),
  ri_mm: z
    .number(REQUIRED_NUMBER_MESSAGE)
    .positive(POSITIVE_NUMBER_MESSAGE)
    .max(500, MAX_VALUE_MESSAGE),
});

const chsGeometrySchema = z.strictObject({
  d_mm: z
    .number(REQUIRED_NUMBER_MESSAGE)
    .positive(POSITIVE_NUMBER_MESSAGE)
    .max(2000, MAX_VALUE_MESSAGE),
  t_mm: z
    .number(REQUIRED_NUMBER_MESSAGE)
    .positive(POSITIVE_NUMBER_MESSAGE)
    .max(200, MAX_VALUE_MESSAGE),
});

const geometrySchema = z.strictObject({
  i_geometry: iGeometrySchema,
  rhs_geometry: rhsGeometrySchema,
  chs_geometry: chsGeometrySchema,
  L_m: z
    .number(REQUIRED_NUMBER_MESSAGE)
    .positive(POSITIVE_NUMBER_MESSAGE)
    .max(500, MAX_VALUE_MESSAGE),
});

const actionsSchema = z.strictObject({
  N_Ed_kN: z.number(REQUIRED_NUMBER_MESSAGE),
  V_y_Ed_kN: z.number(REQUIRED_NUMBER_MESSAGE),
  V_z_Ed_kN: z.number(REQUIRED_NUMBER_MESSAGE),
  M_y_Ed_kNm: z.number(REQUIRED_NUMBER_MESSAGE),
  M_z_Ed_kNm: z.number(REQUIRED_NUMBER_MESSAGE),
});

const flexuralBucklingSchema = z.strictObject({
  k_y: z.number(REQUIRED_NUMBER_MESSAGE).positive(POSITIVE_NUMBER_MESSAGE),
  M_y_Ed_shape: z.literal(momentShapeValues),
  psi_y: z
    .number(REQUIRED_NUMBER_MESSAGE)
    .min(-1, MIN_MINUS_ONE_MESSAGE)
    .max(1, MAX_ONE_MESSAGE),
  support_condition_y: z.literal(supportConditionValues),

  k_z: z.number(REQUIRED_NUMBER_MESSAGE).positive(POSITIVE_NUMBER_MESSAGE),
  M_z_Ed_shape: z.literal(momentShapeValues),
  psi_z: z
    .number(REQUIRED_NUMBER_MESSAGE)
    .min(-1, MIN_MINUS_ONE_MESSAGE)
    .max(1, MAX_ONE_MESSAGE),
  support_condition_z: z.literal(supportConditionValues),
});

const stabilityChecksSchema = z.strictObject({
  include_torsional_modes: z.boolean(),
  k_T: z.number(REQUIRED_NUMBER_MESSAGE).positive(POSITIVE_NUMBER_MESSAGE),
  k_LT: z.number(REQUIRED_NUMBER_MESSAGE).positive(POSITIVE_NUMBER_MESSAGE),
  M_y_Ed_shape_LT: z.literal(momentShapeValues),
  psi_y_LT: z
    .number(REQUIRED_NUMBER_MESSAGE)
    .min(-1, MIN_MINUS_ONE_MESSAGE)
    .max(1, MAX_ONE_MESSAGE),
  support_condition_LT: z.literal(supportConditionValues),
  load_LT: z.literal(loadApplicationLTValues),
});

const annexSchema = z.strictObject({
  annex_id: z.literal(annexValues),
  gamma_M0: z.number(REQUIRED_NUMBER_MESSAGE).positive(POSITIVE_NUMBER_MESSAGE),
  gamma_M1: z.number(REQUIRED_NUMBER_MESSAGE).positive(POSITIVE_NUMBER_MESSAGE),
  lambda_LT_0: z
    .number(REQUIRED_NUMBER_MESSAGE)
    .positive(POSITIVE_NUMBER_MESSAGE),
  beta_LT: z.number(REQUIRED_NUMBER_MESSAGE).positive(POSITIVE_NUMBER_MESSAGE),

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
  .and(annexSchema)
  .superRefine(schemaRefiner);

export type Ec3FormValues = z.infer<typeof schema>;
