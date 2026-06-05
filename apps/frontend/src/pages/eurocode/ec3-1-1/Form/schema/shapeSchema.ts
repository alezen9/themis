import { z } from "zod";

export const shapeSchema = z.strictObject({
  shape: z.literal(["I", "RHS", "CHS"]),
});
