import { z } from "zod";

import {
  iFabricationTypeValues,
  rhsChsFabricationTypeValues,
} from "../options";
import {
  inactiveFieldSchema,
  REQUIRED_NUMBER_MESSAGE,
  REQUIRED_STRING_MESSAGE,
} from "./constants";

export const crossSectionSchema = z.discriminatedUnion("shape", [
  z.strictObject({
    shape: z.literal("I"),
    section_id: z
      .string(REQUIRED_STRING_MESSAGE)
      .min(1, REQUIRED_STRING_MESSAGE),
    fabrication_type: z.literal(iFabricationTypeValues),
    T_Ed_kNm: inactiveFieldSchema,
  }),
  z.strictObject({
    shape: z.literal("RHS"),
    section_id: z
      .string(REQUIRED_STRING_MESSAGE)
      .min(1, REQUIRED_STRING_MESSAGE),
    fabrication_type: z.literal(rhsChsFabricationTypeValues),
    T_Ed_kNm: z.number(REQUIRED_NUMBER_MESSAGE),
  }),
  z.strictObject({
    shape: z.literal("CHS"),
    section_id: z
      .string(REQUIRED_STRING_MESSAGE)
      .min(1, REQUIRED_STRING_MESSAGE),
    fabrication_type: z.literal(rhsChsFabricationTypeValues),
    T_Ed_kNm: z.number(REQUIRED_NUMBER_MESSAGE),
  }),
]);
