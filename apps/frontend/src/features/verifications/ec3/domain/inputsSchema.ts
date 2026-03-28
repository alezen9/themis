import { z } from "zod";
import {
  BUCKLING_CURVES_LT_POLICY_OPTIONS,
  COEFFICIENT_F_METHOD_OPTIONS,
  FABRICATION_TYPE_OPTIONS,
  INTERACTION_FACTOR_METHOD_OPTIONS,
  LOAD_APPLICATION_LT_OPTIONS,
  MOMENT_SHAPE_OPTIONS,
  RESOLVED_SECTION_CLASS_OPTIONS,
  SECTION_CLASS_OPTIONS,
  SHAPE_OPTIONS,
  SUPPORT_CONDITION_VALUES,
  TORSIONAL_DEFORMATION_OPTIONS,
} from "../constants";

export const sectionShapeSchema = z.literal(SHAPE_OPTIONS);
export const fabricationTypeSchema = z.literal(FABRICATION_TYPE_OPTIONS);
export const momentShapeSchema = z.literal(MOMENT_SHAPE_OPTIONS);
export const supportConditionSchema = z.literal(SUPPORT_CONDITION_VALUES);
export const loadApplicationLTSchema = z.literal(LOAD_APPLICATION_LT_OPTIONS);
export const torsionalDeformationsSchema = z.literal(
  TORSIONAL_DEFORMATION_OPTIONS,
);
export const interactionFactorMethodSchema = z.literal(
  INTERACTION_FACTOR_METHOD_OPTIONS,
);
export const coefficientFMethodSchema = z.literal(COEFFICIENT_F_METHOD_OPTIONS);
export const bucklingCurvesLtPolicySchema = z.literal(
  BUCKLING_CURVES_LT_POLICY_OPTIONS,
);
export const sectionClassSelectionSchema = z.literal(SECTION_CLASS_OPTIONS);
export const resolvedSectionClassSchema = z.literal(
  RESOLVED_SECTION_CLASS_OPTIONS,
);
export const materialSchema = z.strictObject({
  fy: z.number().positive(),
  E: z.number().positive(),
  G: z.number().positive(),
});

export const verificationSchema = z.strictObject({
  N_Ed: z.number(),
  M_y_Ed: z.number(),
  M_z_Ed: z.number(),
  V_y_Ed: z.number(),
  V_z_Ed: z.number(),
  L: z.number().positive(),
  k_y: z.number().positive(),
  k_z: z.number().positive(),
  LLT_over_L: z.number().positive(),
  LcrT_over_L: z.number().positive(),
  psi_y: z.number(),
  psi_z: z.number(),
  psi_LT: z.number(),
  moment_shape_y: momentShapeSchema,
  moment_shape_z: momentShapeSchema,
  moment_shape_LT: momentShapeSchema,
  support_condition_y: supportConditionSchema,
  support_condition_z: supportConditionSchema,
  support_condition_LT: supportConditionSchema,
  load_application_LT: loadApplicationLTSchema,
  torsional_deformations: torsionalDeformationsSchema,
  interaction_factor_method: interactionFactorMethodSchema,
  coefficient_f_method: coefficientFMethodSchema,
  buckling_curves_LT_policy: bucklingCurvesLtPolicySchema,
  section_class_selection: sectionClassSelectionSchema,
});

export const iSectionSchema = z
  .strictObject({
    shape: z.literal("I"),
    fabricationType: fabricationTypeSchema,
    h: z.number().positive(),
    b: z.number().positive(),
    tw: z.number().positive(),
    tf: z.number().positive(),
    r: z.number().nonnegative(),
  })
  .refine(({ h, tf }) => h > 2 * tf, {
    path: ["h"],
    message: "I-sections require h > 2*tf",
  });

export const rhsSectionSchema = z
  .strictObject({
    shape: z.literal("RHS"),
    fabricationType: fabricationTypeSchema,
    h: z.number().positive(),
    b: z.number().positive(),
    tw: z.number().positive(),
    ro: z.number().nonnegative(),
    ri: z.number().nonnegative(),
  })
  .refine(({ ro, ri }) => ro >= ri, {
    path: ["ro"],
    message: "RHS sections require ro >= ri",
  })
  .refine(({ h, ro }) => h > 2 * ro, {
    path: ["h"],
    message: "RHS sections require h > 2*ro",
  })
  .refine(({ b, ro }) => b > 2 * ro, {
    path: ["b"],
    message: "RHS sections require b > 2*ro",
  })
  .refine(({ h, ri, tw }) => h > 2 * (ri + tw), {
    path: ["h"],
    message: "RHS sections require h > 2*(ri+tw)",
  })
  .refine(({ b, ri, tw }) => b > 2 * (ri + tw), {
    path: ["b"],
    message: "RHS sections require b > 2*(ri+tw)",
  });

export const chsSectionSchema = z
  .strictObject({
    shape: z.literal("CHS"),
    fabricationType: fabricationTypeSchema,
    d: z.number().positive(),
    t: z.number().positive(),
  })
  .refine(({ d, t }) => d > 2 * t, {
    path: ["d"],
    message: "CHS sections require d > 2*t",
  });

export const sectionInputSchema = z.discriminatedUnion("shape", [
  iSectionSchema,
  rhsSectionSchema,
  chsSectionSchema,
]);

const iInputsSchema = z
  .strictObject({
    ...iSectionSchema.shape,
    ...materialSchema.shape,
    ...verificationSchema.shape,
  })
  .refine(({ h, tf }) => h > 2 * tf, {
    path: ["h"],
    message: "I-sections require h > 2*tf",
  });

const rhsInputsSchema = z
  .strictObject({
    ...rhsSectionSchema.shape,
    ...materialSchema.shape,
    ...verificationSchema.shape,
  })
  .refine(({ ro, ri }) => ro >= ri, {
    path: ["ro"],
    message: "RHS sections require ro >= ri",
  })
  .refine(({ h, ro }) => h > 2 * ro, {
    path: ["h"],
    message: "RHS sections require h > 2*ro",
  })
  .refine(({ b, ro }) => b > 2 * ro, {
    path: ["b"],
    message: "RHS sections require b > 2*ro",
  })
  .refine(({ h, ri, tw }) => h > 2 * (ri + tw), {
    path: ["h"],
    message: "RHS sections require h > 2*(ri+tw)",
  })
  .refine(({ b, ri, tw }) => b > 2 * (ri + tw), {
    path: ["b"],
    message: "RHS sections require b > 2*(ri+tw)",
  });

const chsInputsSchema = z
  .strictObject({
    ...chsSectionSchema.shape,
    ...materialSchema.shape,
    ...verificationSchema.shape,
  })
  .refine(({ d, t }) => d > 2 * t, {
    path: ["d"],
    message: "CHS sections require d > 2*t",
  });

export const inputsSchema = z
  .discriminatedUnion("shape", [
    iInputsSchema,
    rhsInputsSchema,
    chsInputsSchema,
  ])
  .refine(
    ({ moment_shape_y, psi_y }) =>
      moment_shape_y !== "linear" || (psi_y >= -1 && psi_y <= 1),
    {
      path: ["psi_y"],
      message: "When moment_shape_y is linear, psi_y must be between -1 and 1",
    },
  )
  .refine(
    ({ moment_shape_z, psi_z }) =>
      moment_shape_z !== "linear" || (psi_z >= -1 && psi_z <= 1),
    {
      path: ["psi_z"],
      message: "When moment_shape_z is linear, psi_z must be between -1 and 1",
    },
  )
  .refine(
    ({ moment_shape_LT, psi_LT }) =>
      moment_shape_LT !== "linear" || (psi_LT >= -1 && psi_LT <= 1),
    {
      path: ["psi_LT"],
      message:
        "When moment_shape_LT is linear, psi_LT must be between -1 and 1",
    },
  );

export const annexCoeffsSchema = z.strictObject({
  gamma_M0: z.number().positive(),
  gamma_M1: z.number().positive(),
  lambda_LT_0: z.number().positive(),
  beta_LT: z.number().positive(),
});

export type SectionShape = z.infer<typeof sectionShapeSchema>;
export type FabricationType = z.infer<typeof fabricationTypeSchema>;
export type ISectionInput = z.infer<typeof iSectionSchema>;
export type RhsSectionInput = z.infer<typeof rhsSectionSchema>;
export type ChsSectionInput = z.infer<typeof chsSectionSchema>;
export type SectionInput = z.infer<typeof sectionInputSchema>;
export type SectionClassSelection = z.infer<typeof sectionClassSelectionSchema>;
export type ResolvedSectionClass = z.infer<typeof resolvedSectionClassSchema>;
export type MomentShape = z.infer<typeof momentShapeSchema>;
export type SupportCondition = z.infer<typeof supportConditionSchema>;
export type LoadApplicationLT = z.infer<typeof loadApplicationLTSchema>;
export type TorsionalDeformations = z.infer<typeof torsionalDeformationsSchema>;
export type InteractionFactorMethod = z.infer<
  typeof interactionFactorMethodSchema
>;
export type CoefficientFMethod = z.infer<typeof coefficientFMethodSchema>;
export type BucklingCurvesLtPolicy = z.infer<
  typeof bucklingCurvesLtPolicySchema
>;
export type Ec3EditableInputs = z.infer<typeof verificationSchema>;
export type Ec3MaterialInputs = z.infer<typeof materialSchema>;
export type Ec3InputValues = z.infer<typeof inputsSchema>;
export type AnnexCoeffs = z.infer<typeof annexCoeffsSchema>;
