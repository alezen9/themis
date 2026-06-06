import {
  CheckNodeSchema,
  CoefficientNodeSchema,
  ConstantNodeSchema,
  FormulaNodeSchema,
  TableNodeSchema,
  UserInputNodeSchema,
} from "@ndg/ndg-core";
import { z } from "zod";

import { EDITOR_DOCUMENT_VERSION } from "./types";

const position = z.object({ x: z.number(), y: z.number() });

const draftData = <Schema extends z.ZodObject>(schema: Schema) =>
  schema.omit({ id: true, type: true, children: true }).partial().strip();

const draftNodeSchema = z.discriminatedUnion("type", [
  z.object({
    id: z.string(),
    position,
    type: z.literal("check"),
    data: draftData(CheckNodeSchema).default({}),
  }),
  z.object({
    id: z.string(),
    position,
    type: z.literal("user-input"),
    data: draftData(UserInputNodeSchema).default({}),
  }),
  z.object({
    id: z.string(),
    position,
    type: z.literal("formula"),
    data: draftData(FormulaNodeSchema).default({}),
  }),
  z.object({
    id: z.string(),
    position,
    type: z.literal("coefficient"),
    data: draftData(CoefficientNodeSchema).default({}),
  }),
  z.object({
    id: z.string(),
    position,
    type: z.literal("constant"),
    data: draftData(ConstantNodeSchema).default({}),
  }),
  z.object({
    id: z.string(),
    position,
    type: z.literal("table"),
    data: draftData(TableNodeSchema).default({}),
  }),
]);

const draftEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  data: z.object({ condition: z.unknown() }).optional(),
});

export const editorDocumentSchema = z.object({
  version: z.literal(EDITOR_DOCUMENT_VERSION),
  nodes: z.array(draftNodeSchema),
  edges: z.array(draftEdgeSchema),
});
