import { z } from "zod";

import {
  iFabricationTypeValues,
  rhsChsFabricationTypeValues,
} from "../options";
import { REQUIRED_STRING_MESSAGE } from "./constants";

export const shapeAndCrossSectionSchema = z.discriminatedUnion("shape", [
  z.strictObject({
    shape: z.literal("I"),
    section_id: z
      .string(REQUIRED_STRING_MESSAGE)
      .min(1, REQUIRED_STRING_MESSAGE),
    fabrication_type: z.literal(iFabricationTypeValues),
  }),
  z.strictObject({
    shape: z.literal("RHS"),
    section_id: z
      .string(REQUIRED_STRING_MESSAGE)
      .min(1, REQUIRED_STRING_MESSAGE),
    fabrication_type: z.literal(rhsChsFabricationTypeValues),
  }),
  z.strictObject({
    shape: z.literal("CHS"),
    section_id: z
      .string(REQUIRED_STRING_MESSAGE)
      .min(1, REQUIRED_STRING_MESSAGE),
    fabrication_type: z.literal(rhsChsFabricationTypeValues),
  }),
]);
