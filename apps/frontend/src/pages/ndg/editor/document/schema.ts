import { ConditionSchema } from "@ndg/ndg-core";
import { z } from "zod";

import { EDITOR_DOCUMENT_VERSION } from "./types";

export const editorDocumentSchema = z.object({
  version: z.literal(EDITOR_DOCUMENT_VERSION),
  nodes: z.array(
    z.object({
      id: z.string(),
      position: z.object({ x: z.number(), y: z.number() }),
      type: z.string(),
      data: z.record(z.string(), z.unknown()),
    }),
  ),
  edges: z.array(
    z.object({
      id: z.string(),
      source: z.string(),
      target: z.string(),
      data: z.object({ condition: ConditionSchema.optional() }).optional(),
    }),
  ),
});
