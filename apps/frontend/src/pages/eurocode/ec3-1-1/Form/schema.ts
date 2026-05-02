import { z } from "zod";
import {
  bucklingCurvesLTPolicyValues,
  coefficientFMethodValues,
  fabricationTypeValues,
  interactionFactorMethodValues,
  loadApplicationLTValues,
  sectionClassValues,
  supportConditionValues,
} from "./options";

const sectionFields = {
  sectionId: z.string().trim().min(1),
  fabricationType: z.literal(fabricationTypeValues),
};

const iGeometrySchema = z.strictObject({
  h: z.number("Invalid value").positive("Value must be a positive number"),
  b: z.number("Invalid value").positive("Value must be a positive number"),
  tw: z.number("Invalid value").positive("Value must be a positive number"),
  tf: z.number("Invalid value").positive("Value must be a positive number"),
  r: z.number("Invalid value").positive("Value must be a positive number"),
});

const rhsGeometrySchema = z.strictObject({
  h: z.number("Invalid value").positive("Value must be a positive number"),
  b: z.number("Invalid value").positive("Value must be a positive number"),
  tw: z.number("Invalid value").positive("Value must be a positive number"),
  ro: z.number("Invalid value").positive("Value must be a positive number"),
  ri: z.number("Invalid value").positive("Value must be a positive number"),
});

const chsGeometrySchema = z.strictObject({
  d: z.number("Invalid value").positive("Value must be a positive number"),
  t: z.number("Invalid value").positive("Value must be a positive number"),
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
  section_class: z.literal(sectionClassValues),
});

const annexSchema = z.strictObject({
  annexId: z.literal(["italian", "eurocode"]),
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
});

const materialSchema = z.strictObject({ gradeId: z.string().trim().min(1) });

const actionsSchema = z.strictObject({
  N_Ed: z.number("Invalid value"),
  M_y_Ed: z.number("Invalid value"),
  M_z_Ed: z.number("Invalid value"),
  V_y_Ed: z.number("Invalid value"),
  V_z_Ed: z.number("Invalid value"),
});

const bucklingSchema = z.strictObject({
  L: z.number("Invalid value").positive("Value must be a positive number"),
  k_y: z.number("Invalid value").positive("Value must be a positive number"),
  k_z: z.number("Invalid value").positive("Value must be a positive number"),
  interaction_factor_method: z.literal(interactionFactorMethodValues),
});

const momentYSchema = z.discriminatedUnion("moment_shape_y", [
  z.strictObject({ moment_shape_y: z.literal("uniform") }),
  z.strictObject({
    moment_shape_y: z.literal("linear"),
    psi_y: z
      .number("Invalid value")
      .min(-1, "Value cannot be smaller than -1")
      .max(1, "Value cannot be greater than 1"),
  }),
  z.strictObject({
    moment_shape_y: z.literal("parabolic"),
    support_condition_y: z.literal(supportConditionValues),
  }),
  z.strictObject({
    moment_shape_y: z.literal("triangular"),
    support_condition_y: z.literal(supportConditionValues),
  }),
]);

const momentZSchema = z.discriminatedUnion("moment_shape_z", [
  z.strictObject({ moment_shape_z: z.literal("uniform") }),
  z.strictObject({
    moment_shape_z: z.literal("linear"),
    psi_z: z
      .number("Invalid value")
      .min(-1, "Value cannot be smaller than -1")
      .max(1, "Value cannot be greater than 1"),
  }),
  z.strictObject({
    moment_shape_z: z.literal("parabolic"),
    support_condition_z: z.literal(supportConditionValues),
  }),
  z.strictObject({
    moment_shape_z: z.literal("triangular"),
    support_condition_z: z.literal(supportConditionValues),
  }),
]);

const ltFields = {
  torsional_deformations: z.literal("yes"),
  k_LT: z.number("Invalid value").positive("Value must be a positive number"),
  k_T: z.number("Invalid value").positive("Value must be a positive number"),
  coefficient_f_method: z.literal(coefficientFMethodValues),
  buckling_curves_LT_policy: z.literal(bucklingCurvesLTPolicyValues),
};

const momentLtSchema = z.discriminatedUnion("moment_shape_LT", [
  z.object({ moment_shape_LT: z.literal("uniform") }),
  z.object({
    moment_shape_LT: z.literal("linear"),
    psi_LT: z
      .number("Invalid value")
      .min(-1, "Value cannot be smaller than -1")
      .max(1, "Value cannot be greater than 1"),
  }),
  z.object({
    moment_shape_LT: z.literal("parabolic"),
    support_condition_LT: z.literal(supportConditionValues),
    load_application_LT: z.literal(loadApplicationLTValues),
  }),
  z.object({
    moment_shape_LT: z.literal("triangular"),
    support_condition_LT: z.literal(supportConditionValues),
    load_application_LT: z.literal(loadApplicationLTValues),
  }),
]);

const lateralTorsionalSchema = z.union([
  z.object({ torsional_deformations: z.literal("no") }),
  z.object(ltFields).and(momentLtSchema),
]);

const momentSchema = momentYSchema.and(momentZSchema);

export const schema = actionsSchema
  .and(bucklingSchema)
  .and(momentSchema)
  .and(lateralTorsionalSchema)
  .and(materialSchema)
  .and(annexSchema)
  .and(classificationSchema)
  .and(sectionSchema);

export type Ec3FormValues = z.infer<typeof schema>;
