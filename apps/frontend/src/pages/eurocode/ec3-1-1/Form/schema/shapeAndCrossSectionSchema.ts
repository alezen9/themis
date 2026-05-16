import { z } from "zod";

import {
  iFabricationTypeValues,
  rhsChsFabricationTypeValues,
} from "../options";

export const shapeAndCrossSectionSchema = z.discriminatedUnion("shape", [
  z.strictObject({
    shape: z.literal("I"),
    section_id: z.string(),
    fabrication_type: z.literal(iFabricationTypeValues),
  }),
  z.strictObject({
    shape: z.literal("RHS"),
    section_id: z.string(),
    fabrication_type: z.literal(rhsChsFabricationTypeValues),
  }),
  z.strictObject({
    shape: z.literal("CHS"),
    section_id: z.string(),
    fabrication_type: z.literal(rhsChsFabricationTypeValues),
  }),
]);
