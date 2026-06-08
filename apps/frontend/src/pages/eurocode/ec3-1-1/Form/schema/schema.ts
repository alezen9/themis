import { z } from "zod";

import {
  annexValues,
  betaLTValues,
  bucklingCurvesLTPolicyValues,
  coefficientFMethodValues,
  iFabricationTypeValues,
  interactionFactorMethodValues,
  lambdaLT0Values,
  loadApplicationLTValues,
  momentShapeValues,
  rhsChsFabricationTypeValues,
  sectionClassValues,
  shapeValues,
  supportConditionValues,
} from "../options";
import {
  MAX_ONE_MESSAGE,
  MAX_VALUE_MESSAGE,
  MIN_MINUS_ONE_MESSAGE,
  POSITIVE_NUMBER_MESSAGE,
  REQUIRED_NUMBER_MESSAGE,
  REQUIRED_STRING_MESSAGE,
} from "./constants";
import {
  chsGeometrySchema,
  iGeometrySchema,
  rhsGeometrySchema,
} from "./geometrySchema";

const fieldSchemas = {
  // SHAPE
  shape: z.literal(shapeValues),

  // MATERIAL
  steel_grade_id: z
    .string(REQUIRED_STRING_MESSAGE)
    .min(1, REQUIRED_STRING_MESSAGE),

  // CROSS SECTION
  section_id: z.string(REQUIRED_STRING_MESSAGE).min(1, REQUIRED_STRING_MESSAGE),
  fabrication_type: z.literal([
    ...iFabricationTypeValues,
    ...rhsChsFabricationTypeValues,
  ]),
  section_class: z.literal(sectionClassValues),

  // GEOMETRY
  L_m: z
    .number(REQUIRED_NUMBER_MESSAGE)
    .positive(POSITIVE_NUMBER_MESSAGE)
    .max(500, MAX_VALUE_MESSAGE),
  i_geometry: iGeometrySchema,
  rhs_geometry: rhsGeometrySchema,
  chs_geometry: chsGeometrySchema,

  // ACTIONS
  N_Ed_kN: z.number(REQUIRED_NUMBER_MESSAGE),
  V_y_Ed_kN: z.number(REQUIRED_NUMBER_MESSAGE),
  V_z_Ed_kN: z.number(REQUIRED_NUMBER_MESSAGE),
  M_y_Ed_kNm: z.number(REQUIRED_NUMBER_MESSAGE),
  M_z_Ed_kNm: z.number(REQUIRED_NUMBER_MESSAGE),
  T_Ed_kNm: z.number(REQUIRED_NUMBER_MESSAGE),

  // FLEXURAL BUCKLING
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

  // STABILITY CHECKS
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

  // NATIONAL ANNEX
  annex_id: z.literal(annexValues),
  gamma_M0: z.number(REQUIRED_NUMBER_MESSAGE).positive(POSITIVE_NUMBER_MESSAGE),
  gamma_M1: z.number(REQUIRED_NUMBER_MESSAGE).positive(POSITIVE_NUMBER_MESSAGE),
  eta: z.number(REQUIRED_NUMBER_MESSAGE).positive(POSITIVE_NUMBER_MESSAGE),
  lambda_LT_0: z.literal(lambdaLT0Values),
  beta_LT: z.literal(betaLTValues),
  f_method: z.literal(coefficientFMethodValues),
  interaction_factor_method: z.literal(interactionFactorMethodValues),
  buckling_curves_LT_policy: z.literal(bucklingCurvesLTPolicyValues),
} satisfies Record<string, z.ZodType>;

type FieldKey = keyof typeof fieldSchemas;
type Values = { [K in FieldKey]: z.infer<(typeof fieldSchemas)[K]> };

const ignoreWhen: Partial<Record<FieldKey, (v: Values) => boolean>> = {
  // GEOMETRY
  i_geometry: v => v.shape !== "I",
  rhs_geometry: v => v.shape !== "RHS",
  chs_geometry: v => v.shape !== "CHS",

  // ACTIONS
  T_Ed_kNm: v => v.shape === "I",

  // FLEXURAL BUCKLING
  psi_y: v => v.M_y_Ed_shape !== "linear",
  support_condition_y: v =>
    v.M_y_Ed_shape !== "parabolic" && v.M_y_Ed_shape !== "triangular",
  psi_z: v => v.M_z_Ed_shape !== "linear",
  support_condition_z: v =>
    v.M_z_Ed_shape !== "parabolic" && v.M_z_Ed_shape !== "triangular",

  // STABILITY CHECKS
  k_T: v => !v.include_torsional_modes || v.shape !== "I",
  k_LT: v => !v.include_torsional_modes || v.shape !== "I",
  M_y_Ed_shape_LT: v => !v.include_torsional_modes || v.shape !== "I",
  psi_y_LT: v =>
    !v.include_torsional_modes ||
    v.shape !== "I" ||
    v.M_y_Ed_shape_LT !== "linear",
  support_condition_LT: v =>
    !v.include_torsional_modes ||
    v.shape !== "I" ||
    (v.M_y_Ed_shape_LT !== "parabolic" && v.M_y_Ed_shape_LT !== "triangular"),
  load_LT: v =>
    !v.include_torsional_modes ||
    v.shape !== "I" ||
    (v.M_y_Ed_shape_LT !== "parabolic" && v.M_y_Ed_shape_LT !== "triangular"),

  // NATIONAL ANNEX
  eta: v => v.shape === "CHS",
  lambda_LT_0: v => v.shape !== "I",
  beta_LT: v => v.shape !== "I",
  buckling_curves_LT_policy: v => v.shape !== "I",
  f_method: v =>
    v.shape !== "I" || v.buckling_curves_LT_policy !== "default-rolled-welded",
};

const dynamicSchemas: Partial<Record<FieldKey, (v: Values) => z.ZodType>> = {
  fabrication_type: v =>
    v.shape === "I"
      ? z.literal(iFabricationTypeValues)
      : z.literal(rhsChsFabricationTypeValues),
};

const fieldKeys = Object.keys(fieldSchemas) as FieldKey[];

type RaisedIssue = Parameters<z.RefinementCtx["addIssue"]>[0];

const collectIssues = (v: Values, keys: FieldKey[]) => {
  const issues: RaisedIssue[] = [];
  for (const key of keys) {
    if (ignoreWhen[key]?.(v)) continue;
    const schema = dynamicSchemas[key]?.(v) ?? fieldSchemas[key];
    const result = schema.safeParse(v[key]);
    if (result.success) continue;
    for (const issue of result.error.issues)
      issues.push({ ...issue, path: [key, ...issue.path] });
  }
  return issues;
};

export const validateFields = (v: Values, keys: FieldKey[] = fieldKeys) =>
  collectIssues(v, keys).length === 0;

const carrier = <S extends z.ZodType>(_schema: S) =>
  z.custom<z.infer<S>>(() => true);

const baseSchema = z.strictObject(
  Object.fromEntries(
    fieldKeys.map(key => [key, carrier(fieldSchemas[key])]),
  ) as unknown as { [K in FieldKey]: z.ZodCustom<Values[K], Values[K]> },
);

export const schema = baseSchema.superRefine((v, ctx) => {
  for (const issue of collectIssues(v, fieldKeys)) ctx.addIssue(issue);
});

export type Ec311FormValues = Values;
