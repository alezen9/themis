import { z } from "zod";

import {
  loadApplicationLTValues,
  momentShapeValues,
  supportConditionValues,
} from "../options";
import {
  inactive,
  MAX_ONE_MESSAGE,
  MIN_MINUS_ONE_MESSAGE,
  POSITIVE_NUMBER_MESSAGE,
  REQUIRED_NUMBER_MESSAGE,
} from "./constants";

const positiveNumberSchema = z
  .number(REQUIRED_NUMBER_MESSAGE)
  .positive(POSITIVE_NUMBER_MESSAGE);

const psiLTSchema = z
  .number(REQUIRED_NUMBER_MESSAGE)
  .min(-1, MIN_MINUS_ONE_MESSAGE)
  .max(1, MAX_ONE_MESSAGE);

const uniformMomentShapeSchema = z.strictObject({
  include_torsional_modes: z.literal(true),
  k_T: positiveNumberSchema,
  k_LT: positiveNumberSchema,
  M_y_Ed_shape_LT: z.literal("uniform"),
  psi_y_LT: inactive(psiLTSchema),
  support_condition_LT: inactive(z.literal(supportConditionValues)),
  load_LT: inactive(z.literal(loadApplicationLTValues)),
});

const linearMomentShapeSchema = z.strictObject({
  include_torsional_modes: z.literal(true),
  k_T: positiveNumberSchema,
  k_LT: positiveNumberSchema,
  M_y_Ed_shape_LT: z.literal("linear"),
  psi_y_LT: psiLTSchema,
  support_condition_LT: inactive(z.literal(supportConditionValues)),
  load_LT: inactive(z.literal(loadApplicationLTValues)),
});

const parabolicMomentShapeSchema = z.strictObject({
  include_torsional_modes: z.literal(true),
  k_T: positiveNumberSchema,
  k_LT: positiveNumberSchema,
  M_y_Ed_shape_LT: z.literal("parabolic"),
  psi_y_LT: inactive(psiLTSchema),
  support_condition_LT: z.literal(supportConditionValues),
  load_LT: z.literal(loadApplicationLTValues),
});

const triangularMomentShapeSchema = z.strictObject({
  include_torsional_modes: z.literal(true),
  k_T: positiveNumberSchema,
  k_LT: positiveNumberSchema,
  M_y_Ed_shape_LT: z.literal("triangular"),
  psi_y_LT: inactive(psiLTSchema),
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
  k_T: inactive(positiveNumberSchema),
  k_LT: inactive(positiveNumberSchema),
  M_y_Ed_shape_LT: inactive(z.literal(momentShapeValues)),
  psi_y_LT: inactive(psiLTSchema),
  support_condition_LT: inactive(z.literal(supportConditionValues)),
  load_LT: inactive(z.literal(loadApplicationLTValues)),
});

export const lateralTorsionalBucklingSchema = z.discriminatedUnion(
  "include_torsional_modes",
  [
    disabledLateralTorsionalBucklingSchema,
    enabledLateralTorsionalBucklingSchema,
  ],
);
