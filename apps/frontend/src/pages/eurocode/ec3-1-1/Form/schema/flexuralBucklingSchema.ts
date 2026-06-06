import { z } from "zod";

import { supportConditionValues } from "../options";
import {
  inactive,
  MAX_ONE_MESSAGE,
  MIN_MINUS_ONE_MESSAGE,
  POSITIVE_NUMBER_MESSAGE,
  REQUIRED_NUMBER_MESSAGE,
} from "./constants";

const psiSchema = z
  .number(REQUIRED_NUMBER_MESSAGE)
  .min(-1, MIN_MINUS_ONE_MESSAGE)
  .max(1, MAX_ONE_MESSAGE);

const momentYSchema = z.discriminatedUnion("M_y_Ed_shape", [
  z.strictObject({
    M_y_Ed_shape: z.literal("uniform"),
    psi_y: inactive(psiSchema),
    support_condition_y: inactive(z.literal(supportConditionValues)),
  }),
  z.strictObject({
    M_y_Ed_shape: z.literal("linear"),
    psi_y: psiSchema,
    support_condition_y: inactive(z.literal(supportConditionValues)),
  }),
  z.strictObject({
    M_y_Ed_shape: z.literal("parabolic"),
    psi_y: inactive(psiSchema),
    support_condition_y: z.literal(supportConditionValues),
  }),
  z.strictObject({
    M_y_Ed_shape: z.literal("triangular"),
    psi_y: inactive(psiSchema),
    support_condition_y: z.literal(supportConditionValues),
  }),
]);

const momentZSchema = z.discriminatedUnion("M_z_Ed_shape", [
  z.strictObject({
    M_z_Ed_shape: z.literal("uniform"),
    psi_z: inactive(psiSchema),
    support_condition_z: inactive(z.literal(supportConditionValues)),
  }),
  z.strictObject({
    M_z_Ed_shape: z.literal("linear"),
    psi_z: psiSchema,
    support_condition_z: inactive(z.literal(supportConditionValues)),
  }),
  z.strictObject({
    M_z_Ed_shape: z.literal("parabolic"),
    psi_z: inactive(psiSchema),
    support_condition_z: z.literal(supportConditionValues),
  }),
  z.strictObject({
    M_z_Ed_shape: z.literal("triangular"),
    psi_z: inactive(psiSchema),
    support_condition_z: z.literal(supportConditionValues),
  }),
]);

export const flexuralBucklingSchema = z
  .strictObject({
    k_y: z.number(REQUIRED_NUMBER_MESSAGE).positive(POSITIVE_NUMBER_MESSAGE),
    k_z: z.number(REQUIRED_NUMBER_MESSAGE).positive(POSITIVE_NUMBER_MESSAGE),
  })
  .and(momentYSchema)
  .and(momentZSchema);
