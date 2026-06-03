import { z } from "zod";

const numericValueType = z.object({ type: z.literal("number") });
const anyValueType = z.discriminatedUnion("type", [
  z.object({ type: z.literal("number") }),
  z.object({ type: z.literal("string") }),
]);

const base = { key: z.string().min(1), symbol: z.string().optional() };

const meta = z.object({
  sectionRef: z.string().optional(),
  paragraphRef: z.string().optional(),
  subParagraphRef: z.string().optional(),
  formulaRef: z.string().optional(),
  tableRef: z.string().optional(),
  verificationRef: z.string().optional(),
});

export const nodeFormSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("check"),
    ...base,
    key: z.literal("utilisation"),
    valueType: numericValueType,
    verificationExpression: z.string().min(1),
    meta: meta.optional(),
  }),
  z.object({
    type: z.literal("user-input"),
    ...base,
    valueType: anyValueType,
    unit: z.string().optional(),
  }),
  z.object({
    type: z.literal("formula"),
    ...base,
    valueType: anyValueType,
    expression: z.string().optional(),
    unit: z.string().optional(),
    meta: meta.optional(),
  }),
  z.object({
    type: z.literal("coefficient"),
    ...base,
    valueType: numericValueType,
    unit: z.string().optional(),
    meta: meta.optional(),
  }),
  z.object({
    type: z.literal("constant"),
    key: z.string().min(1),
    symbol: z.string().min(1),
    valueType: numericValueType,
  }),
  z.object({
    type: z.literal("table"),
    ...base,
    valueType: anyValueType,
    source: z.string().min(1),
    unit: z.string().optional(),
    meta: meta.optional(),
  }),
]);

export type NodeFormValues = z.infer<typeof nodeFormSchema>;
