import { z } from "zod";

import { loadApplicationLTValues, supportConditionValues } from "../options";
import {
  inactiveFieldSchema,
  MAX_ONE_MESSAGE,
  MIN_MINUS_ONE_MESSAGE,
  POSITIVE_NUMBER_MESSAGE,
  REQUIRED_NUMBER_MESSAGE,
} from "./constants";

const positiveNumberSchema = z
  .number(REQUIRED_NUMBER_MESSAGE)
  .positive(POSITIVE_NUMBER_MESSAGE);

const uniformMomentShapeSchema = z.strictObject({
  include_torsional_modes: z.literal(true),
  k_T: positiveNumberSchema,
  k_LT: positiveNumberSchema,
  M_y_Ed_shape_LT: z.literal("uniform"),
  psi_y_LT: inactiveFieldSchema,
  support_condition_LT: inactiveFieldSchema,
  load_LT: inactiveFieldSchema,
});

const linearMomentShapeSchema = z.strictObject({
  include_torsional_modes: z.literal(true),
  k_T: positiveNumberSchema,
  k_LT: positiveNumberSchema,
  M_y_Ed_shape_LT: z.literal("linear"),
  psi_y_LT: z
    .number(REQUIRED_NUMBER_MESSAGE)
    .min(-1, MIN_MINUS_ONE_MESSAGE)
    .max(1, MAX_ONE_MESSAGE),
  support_condition_LT: inactiveFieldSchema,
  load_LT: inactiveFieldSchema,
});

const parabolicMomentShapeSchema = z.strictObject({
  include_torsional_modes: z.literal(true),
  k_T: positiveNumberSchema,
  k_LT: positiveNumberSchema,
  M_y_Ed_shape_LT: z.literal("parabolic"),
  psi_y_LT: inactiveFieldSchema,
  support_condition_LT: z.literal(supportConditionValues),
  load_LT: z.literal(loadApplicationLTValues),
});

const triangularMomentShapeSchema = z.strictObject({
  include_torsional_modes: z.literal(true),
  k_T: positiveNumberSchema,
  k_LT: positiveNumberSchema,
  M_y_Ed_shape_LT: z.literal("triangular"),
  psi_y_LT: inactiveFieldSchema,
  support_condition_LT: z.literal(supportConditionValues),
  load_LT: z.literal(loadApplicationLTValues),
});

const enabledLateralTorsionalBucklingSchema = z.discriminatedUnion(
  "M_y_Ed_shape_LT",
  [
    uniformMomentShapeSchema,
    linearMomentShapeSchema,
    parabolicMomentShapeSchema,
    triangularMomentShapeSchema,
  ],
);

const disabledLateralTorsionalBucklingSchema = z.strictObject({
  include_torsional_modes: z.literal(false),
  k_T: inactiveFieldSchema,
  k_LT: inactiveFieldSchema,
  M_y_Ed_shape_LT: inactiveFieldSchema,
  psi_y_LT: inactiveFieldSchema,
  support_condition_LT: inactiveFieldSchema,
  load_LT: inactiveFieldSchema,
});

export const lateralTorsionalBucklingSchema = z.discriminatedUnion(
  "include_torsional_modes",
  [
    disabledLateralTorsionalBucklingSchema,
    enabledLateralTorsionalBucklingSchema,
  ],
);
