import { z } from "zod";

import { REQUIRED_NUMBER_MESSAGE } from "./constants";

export const actionsSchema = z.strictObject({
  N_Ed_kN: z.number(REQUIRED_NUMBER_MESSAGE),
  V_y_Ed_kN: z.number(REQUIRED_NUMBER_MESSAGE),
  V_z_Ed_kN: z.number(REQUIRED_NUMBER_MESSAGE),
  M_y_Ed_kNm: z.number(REQUIRED_NUMBER_MESSAGE),
  M_z_Ed_kNm: z.number(REQUIRED_NUMBER_MESSAGE),
});
