import { z } from "zod";

import { supportConditionValues } from "../options";
import {
  inactiveFieldSchema,
  MAX_ONE_MESSAGE,
  MIN_MINUS_ONE_MESSAGE,
  POSITIVE_NUMBER_MESSAGE,
  REQUIRED_NUMBER_MESSAGE,
} from "./constants";

const momentYSchema = z.discriminatedUnion("M_y_Ed_shape", [
  z.strictObject({
    M_y_Ed_shape: z.literal("uniform"),
    psi_y: inactiveFieldSchema,
    support_condition_y: inactiveFieldSchema,
  }),
  z.strictObject({
    M_y_Ed_shape: z.literal("linear"),
    psi_y: z
      .number(REQUIRED_NUMBER_MESSAGE)
      .min(-1, MIN_MINUS_ONE_MESSAGE)
      .max(1, MAX_ONE_MESSAGE),
    support_condition_y: inactiveFieldSchema,
  }),
  z.strictObject({
    M_y_Ed_shape: z.literal("parabolic"),
    psi_y: inactiveFieldSchema,
    support_condition_y: z.literal(supportConditionValues),
  }),
  z.strictObject({
    M_y_Ed_shape: z.literal("triangular"),
    psi_y: inactiveFieldSchema,
    support_condition_y: z.literal(supportConditionValues),
  }),
]);

const momentZSchema = z.discriminatedUnion("M_z_Ed_shape", [
  z.strictObject({
    M_z_Ed_shape: z.literal("uniform"),
    psi_z: inactiveFieldSchema,
    support_condition_z: inactiveFieldSchema,
  }),
  z.strictObject({
    M_z_Ed_shape: z.literal("linear"),
    psi_z: z
      .number(REQUIRED_NUMBER_MESSAGE)
      .min(-1, MIN_MINUS_ONE_MESSAGE)
      .max(1, MAX_ONE_MESSAGE),
    support_condition_z: inactiveFieldSchema,
  }),
  z.strictObject({
    M_z_Ed_shape: z.literal("parabolic"),
    psi_z: inactiveFieldSchema,
    support_condition_z: z.literal(supportConditionValues),
  }),
  z.strictObject({
    M_z_Ed_shape: z.literal("triangular"),
    psi_z: inactiveFieldSchema,
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
