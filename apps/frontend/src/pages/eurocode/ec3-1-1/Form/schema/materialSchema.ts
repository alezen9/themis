import { z } from "zod";

import { REQUIRED_STRING_MESSAGE } from "./constants";

export const materialSchema = z.strictObject({
  steel_grade_id: z
    .string(REQUIRED_STRING_MESSAGE)
    .min(1, REQUIRED_STRING_MESSAGE),
});
