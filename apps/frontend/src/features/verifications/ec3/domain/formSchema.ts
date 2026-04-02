import { z } from "zod";
import { steelGradeById } from "../data/steelGrades";
import {
  BUCKLING_CURVES_LT_POLICY_OPTIONS,
  COEFFICIENT_F_METHOD_OPTIONS,
  FABRICATION_TYPE_OPTIONS,
  INTERACTION_FACTOR_METHOD_OPTIONS,
  LOAD_APPLICATION_LT_OPTIONS,
  SECTION_CLASS_OPTIONS,
  SUPPORT_CONDITION_VALUES,
} from "../options";

const sectionFields = {
  sectionId: z.string().trim().min(1),
  fabricationType: z.literal(FABRICATION_TYPE_OPTIONS),
};

const iGeometrySchema = z.strictObject({
  h: z.number().positive(),
  b: z.number().positive(),
  tw: z.number().positive(),
  tf: z.number().positive(),
  r: z.number().positive(),
});

const rhsGeometrySchema = z.strictObject({
  h: z.number().positive(),
  b: z.number().positive(),
  tw: z.number().positive(),
  ro: z.number().positive(),
  ri: z.number().positive(),
});

const chsGeometrySchema = z.strictObject({
  d: z.number().positive(),
  t: z.number().positive(),
});

const sectionSchema = z
  .discriminatedUnion("shape", [
    z.strictObject({
      ...sectionFields,
      shape: z.literal("I"),
      ...iGeometrySchema.shape,
    }),
    z.strictObject({
      ...sectionFields,
      shape: z.literal("RHS"),
      ...rhsGeometrySchema.shape,
    }),
    z.strictObject({
      ...sectionFields,
      shape: z.literal("CHS"),
      ...chsGeometrySchema.shape,
    }),
  ])
  .refine((section) => section.shape !== "I" || section.h > 2 * section.tf, {
    path: ["h"],
    message: "For I sections, h must be greater than 2 * tf",
  })
  .refine((section) => section.shape !== "I" || section.tw < section.b, {
    path: ["tw"],
    message: "For I sections, tw must be less than b",
  })
  .refine((section) => section.shape !== "I" || section.tf < section.h / 2, {
    path: ["tf"],
    message: "For I sections, tf must be less than h / 2",
  })
  .refine((section) => section.shape !== "RHS" || section.h > 2 * section.tw, {
    path: ["h"],
    message: "For RHS sections, h must be greater than 2 * tw",
  })
  .refine((section) => section.shape !== "RHS" || section.b > 2 * section.tw, {
    path: ["b"],
    message: "For RHS sections, b must be greater than 2 * tw",
  })
  .refine((section) => section.shape !== "RHS" || section.ro >= section.ri, {
    path: ["ro"],
    message: "For RHS sections, ro must be greater than or equal to ri",
  })
  .refine(
    (section) =>
      section.shape !== "RHS" ||
      section.ri <= Math.min(section.h, section.b) / 2,
    {
      path: ["ri"],
      message:
        "For RHS sections, ri must be less than or equal to min(h, b) / 2",
    },
  )
  .refine(
    (section) =>
      section.shape !== "RHS" ||
      section.ro <= Math.min(section.h, section.b) / 2,
    {
      path: ["ro"],
      message:
        "For RHS sections, ro must be less than or equal to min(h, b) / 2",
    },
  )
  .refine((section) => section.shape !== "CHS" || section.d > 2 * section.t, {
    path: ["d"],
    message: "For CHS sections, d must be greater than 2 * t",
  });

const classificationSchema = z.strictObject({
  section_class: z.literal(SECTION_CLASS_OPTIONS),
});

const annexSchema = z.strictObject({
  annexId: z.literal(["italian", "eurocode"]),
  gamma_M0: z.number().positive(),
  gamma_M1: z.number().positive(),
  lambda_LT_0: z.number().positive(),
  beta_LT: z.number().positive(),
});

const materialSchema = z.strictObject({
  gradeId: z
    .string()
    .trim()
    .min(1)
    .refine((gradeId) => steelGradeById.has(gradeId), {
      message: "Unsupported steel grade",
    }),
});

const actionsSchema = z.strictObject({
  N_Ed: z.number(),
  M_y_Ed: z.number(),
  M_z_Ed: z.number(),
  V_y_Ed: z.number(),
  V_z_Ed: z.number(),
});

const bucklingSchema = z.strictObject({
  L: z.number().positive(),
  k_y: z.number().positive(),
  k_z: z.number().positive(),
  interaction_factor_method: z.literal(INTERACTION_FACTOR_METHOD_OPTIONS),
});

const momentYSchema = z.discriminatedUnion("moment_shape_y", [
  z.strictObject({ moment_shape_y: z.literal("uniform") }),
  z.strictObject({
    moment_shape_y: z.literal("linear"),
    psi_y: z.number().min(-1).max(1),
  }),
  z.strictObject({
    moment_shape_y: z.literal("parabolic"),
    support_condition_y: z.literal(SUPPORT_CONDITION_VALUES),
  }),
  z.strictObject({
    moment_shape_y: z.literal("triangular"),
    support_condition_y: z.literal(SUPPORT_CONDITION_VALUES),
  }),
]);

const momentZSchema = z.discriminatedUnion("moment_shape_z", [
  z.strictObject({ moment_shape_z: z.literal("uniform") }),
  z.strictObject({
    moment_shape_z: z.literal("linear"),
    psi_z: z.number().min(-1).max(1),
  }),
  z.strictObject({
    moment_shape_z: z.literal("parabolic"),
    support_condition_z: z.literal(SUPPORT_CONDITION_VALUES),
  }),
  z.strictObject({
    moment_shape_z: z.literal("triangular"),
    support_condition_z: z.literal(SUPPORT_CONDITION_VALUES),
  }),
]);

const ltFields = {
  torsional_deformations: z.literal("yes"),
  k_LT: z.number().positive(),
  k_T: z.number().positive(),
  coefficient_f_method: z.literal(COEFFICIENT_F_METHOD_OPTIONS),
  buckling_curves_LT_policy: z.literal(BUCKLING_CURVES_LT_POLICY_OPTIONS),
};

const momentLtSchema = z.discriminatedUnion("moment_shape_LT", [
  z.object({ moment_shape_LT: z.literal("uniform") }),
  z.object({
    moment_shape_LT: z.literal("linear"),
    psi_LT: z.number().min(-1).max(1),
  }),
  z.object({
    moment_shape_LT: z.literal("parabolic"),
    support_condition_LT: z.literal(SUPPORT_CONDITION_VALUES),
    load_application_LT: z.literal(LOAD_APPLICATION_LT_OPTIONS),
  }),
  z.object({
    moment_shape_LT: z.literal("triangular"),
    support_condition_LT: z.literal(SUPPORT_CONDITION_VALUES),
    load_application_LT: z.literal(LOAD_APPLICATION_LT_OPTIONS),
  }),
]);

const lateralTorsionalSchema = z.union([
  z.object({ torsional_deformations: z.literal("no") }),
  z.object(ltFields).and(momentLtSchema),
]);

const momentSchema = momentYSchema.and(momentZSchema);

export const formSchema = actionsSchema
  .and(bucklingSchema)
  .and(momentSchema)
  .and(lateralTorsionalSchema)
  .and(materialSchema)
  .and(annexSchema)
  .and(classificationSchema)
  .and(sectionSchema);

export type Ec3FormValues = z.infer<typeof formSchema>;
