import { z } from "zod";

import {
  annexValues,
  coefficientFMethodValues,
  interactionFactorMethodValues,
} from "../options";
import {
  inactiveFieldSchema,
  POSITIVE_NUMBER_MESSAGE,
  REQUIRED_NUMBER_MESSAGE,
} from "./constants";

const annexCoefficientsSchema = z.strictObject({
  annex_id: z.literal(annexValues),
  gamma_M0: z.number(REQUIRED_NUMBER_MESSAGE).positive(POSITIVE_NUMBER_MESSAGE),
  gamma_M1: z.number(REQUIRED_NUMBER_MESSAGE).positive(POSITIVE_NUMBER_MESSAGE),
  eta: z.number(REQUIRED_NUMBER_MESSAGE).positive(POSITIVE_NUMBER_MESSAGE),
  lambda_LT_0: z
    .number(REQUIRED_NUMBER_MESSAGE)
    .positive(POSITIVE_NUMBER_MESSAGE),
  beta_LT: z.number(REQUIRED_NUMBER_MESSAGE).positive(POSITIVE_NUMBER_MESSAGE),
  interaction_factor_method: z.literal(interactionFactorMethodValues),
});

const bucklingCurvesSchema = z.discriminatedUnion("buckling_curves_LT_policy", [
  z.strictObject({
    buckling_curves_LT_policy: z.literal("default-rolled-welded"),
    f_method: z.literal(coefficientFMethodValues),
  }),
  z.strictObject({
    buckling_curves_LT_policy: z.literal("general"),
    f_method: inactiveFieldSchema,
  }),
]);

export const nationalAnnexSchema =
  annexCoefficientsSchema.and(bucklingCurvesSchema);
