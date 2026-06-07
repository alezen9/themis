import {
  CheckNodeSchema,
  CoefficientNodeSchema,
  ConstantNodeSchema,
  FormulaNodeSchema,
  TableNodeSchema,
  UserInputNodeSchema,
} from "@ndg/ndg-core";
import { z } from "zod";

import {
  EDITOR_DOCUMENT_VERSION,
  LEGACY_EDITOR_DOCUMENT_VERSION,
} from "./types";

const position = z.object({ x: z.number(), y: z.number() });

const draftData = <Schema extends z.ZodObject>(schema: Schema) =>
  schema.omit({ id: true, type: true, children: true }).partial().strip();

const isObject = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

const migrateFormulaData = (data: unknown) => {
  if (!isObject(data)) return data;
  if ("expressions" in data || typeof data.expression !== "string") return data;

  const { expression, ...rest } = data;
  return expression.trim()
    ? { ...rest, expressions: [{ expression }] }
    : rest;
};

const migrateEditorDocument = (document: unknown) => {
  if (!isObject(document)) return document;
  if (
    document.version !== LEGACY_EDITOR_DOCUMENT_VERSION &&
    document.version !== EDITOR_DOCUMENT_VERSION
  )
    return document;
  if (!Array.isArray(document.nodes)) return document;

  return {
    ...document,
    version: EDITOR_DOCUMENT_VERSION,
    nodes: document.nodes.map(node => {
      if (!isObject(node) || node.type !== "formula") return node;
      return { ...node, data: migrateFormulaData(node.data) };
    }),
  };
};

const formulaDraftData = z.preprocess(
  migrateFormulaData,
  draftData(FormulaNodeSchema),
);

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
    data: formulaDraftData.default({}),
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

export const editorDocumentSchema = z.preprocess(
  migrateEditorDocument,
  z.object({
    version: z.literal(EDITOR_DOCUMENT_VERSION),
    nodes: z.array(draftNodeSchema),
    edges: z.array(draftEdgeSchema),
  }),
);
