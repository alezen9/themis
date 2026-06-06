import { z } from "zod";

import { inactive, REQUIRED_NUMBER_MESSAGE } from "./constants";

export const baseActionsSchema = z.object({
  N_Ed_kN: z.number(REQUIRED_NUMBER_MESSAGE),
  V_y_Ed_kN: z.number(REQUIRED_NUMBER_MESSAGE),
  V_z_Ed_kN: z.number(REQUIRED_NUMBER_MESSAGE),
  M_y_Ed_kNm: z.number(REQUIRED_NUMBER_MESSAGE),
  M_z_Ed_kNm: z.number(REQUIRED_NUMBER_MESSAGE),
});

export const actionsSchema = z.discriminatedUnion("shape", [
  z.strictObject({
    shape: z.literal("I"),
    ...baseActionsSchema.shape,
    T_Ed_kNm: inactive(z.number(REQUIRED_NUMBER_MESSAGE)),
  }),
  z.strictObject({
    shape: z.literal("RHS"),
    ...baseActionsSchema.shape,
    T_Ed_kNm: z.number(REQUIRED_NUMBER_MESSAGE),
  }),
  z.strictObject({
    shape: z.literal("CHS"),
    ...baseActionsSchema.shape,
    T_Ed_kNm: z.number(REQUIRED_NUMBER_MESSAGE),
  }),
]);
