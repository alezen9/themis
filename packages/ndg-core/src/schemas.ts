import { z } from "zod";

// ########################################
//              META
// ########################################

export const NodeMetaSchema = z.object({
  sectionId: z.string().optional(),
  paragraphId: z.string().optional(),
  subParagraphId: z.string().optional(),
  formulaId: z.string().optional(),
  verificationConditionId: z.string().optional(),
  tableId: z.string().optional(),
});

// ########################################
//              CONDITION (recursive)
// ########################################

// Type must be declared explicitly for recursive Zod schemas
export type Condition =
  | { eq: [string, unknown] }
  | { lt: [string, number] }
  | { lte: [string, number] }
  | { gt: [string, number] }
  | { gte: [string, number] }
  | { and: Condition[] }
  | { or: Condition[] };

export const ConditionSchema: z.ZodType<Condition> = z.lazy(() =>
  z.union([
    z.object({ eq: z.tuple([z.string(), z.unknown()]) }),
    z.object({ lt: z.tuple([z.string(), z.number()]) }),
    z.object({ lte: z.tuple([z.string(), z.number()]) }),
    z.object({ gt: z.tuple([z.string(), z.number()]) }),
    z.object({ gte: z.tuple([z.string(), z.number()]) }),
    z.object({ and: z.array(ConditionSchema) }),
    z.object({ or: z.array(ConditionSchema) }),
  ]),
);

// ########################################
//              CHILD
// ########################################

export const ChildSchema = z.object({
  nodeId: z.string(),
  when: ConditionSchema.optional(),
});

// ########################################
//              PAYLOADS
// ########################################

export const CheckPayloadSchema = z.object({
  label: z.string(),
  verificationExpression: z.string(),
  description: z.string().optional(),
});

export const FormulaPayloadSchema = z.object({
  key: z.string(),
  latex: z.string(),
  unit: z.string().optional(),
});

export const UserInputPayloadSchema = z.object({
  key: z.string(),
  label: z.string().optional(),
  value: z.number(),
  unit: z.string(),
});

export const TablePayloadSchema = z.object({
  tableKey: z.string(),
  selectedRow: z.string().optional(),
  selectedColumn: z.string().optional(),
  unit: z.string().optional(),
});

export const CoefficientPayloadSchema = z.object({
  key: z.string(),
  value: z.number(),
  unit: z.string().optional(),
});

export const DerivedCoefficientPayloadSchema = z.object({
  key: z.string(),
  latex: z.string().optional(),
  unit: z.string().optional(),
});

export const ConstantPayloadSchema = z.object({
  key: z.string(),
  value: z.number(),
  description: z.string().optional(),
});

// ########################################
//              NODES
// ########################################

const BaseNodeSchema = z.object({
  id: z.string(),
  label: z.string().optional(),
  children: z.array(ChildSchema),
});

export const CheckNodeSchema = BaseNodeSchema.extend({
  type: z.literal("check"),
  meta: NodeMetaSchema,
  payload: CheckPayloadSchema,
});

export const FormulaNodeSchema = BaseNodeSchema.extend({
  type: z.literal("formula"),
  meta: NodeMetaSchema,
  payload: FormulaPayloadSchema,
});

export const UserInputNodeSchema = BaseNodeSchema.extend({
  type: z.literal("user-input"),
  payload: UserInputPayloadSchema,
});

export const TableNodeSchema = BaseNodeSchema.extend({
  type: z.literal("table"),
  meta: NodeMetaSchema,
  payload: TablePayloadSchema,
});

export const CoefficientNodeSchema = BaseNodeSchema.extend({
  type: z.literal("coefficient"),
  meta: NodeMetaSchema,
  payload: CoefficientPayloadSchema,
});

export const DerivedCoefficientNodeSchema = BaseNodeSchema.extend({
  type: z.literal("derived-coefficient"),
  meta: NodeMetaSchema,
  payload: DerivedCoefficientPayloadSchema,
});

export const ConstantNodeSchema = BaseNodeSchema.extend({
  type: z.literal("constant"),
  payload: ConstantPayloadSchema,
});

export const NodeSchema = z.discriminatedUnion("type", [
  CheckNodeSchema,
  FormulaNodeSchema,
  UserInputNodeSchema,
  TableNodeSchema,
  CoefficientNodeSchema,
  DerivedCoefficientNodeSchema,
  ConstantNodeSchema,
]);

export const VerificationSchema = z.array(NodeSchema);

// ########################################
//              DERIVED TYPES
// ########################################

export type NodeMeta = z.infer<typeof NodeMetaSchema>;
export type Child = z.infer<typeof ChildSchema>;
export type CheckPayload = z.infer<typeof CheckPayloadSchema>;
export type FormulaPayload = z.infer<typeof FormulaPayloadSchema>;
export type UserInputPayload = z.infer<typeof UserInputPayloadSchema>;
export type TablePayload = z.infer<typeof TablePayloadSchema>;
export type CoefficientPayload = z.infer<typeof CoefficientPayloadSchema>;
export type DerivedCoefficientPayload = z.infer<
  typeof DerivedCoefficientPayloadSchema
>;
export type ConstantPayload = z.infer<typeof ConstantPayloadSchema>;
export type CheckNode = z.infer<typeof CheckNodeSchema>;
export type FormulaNode = z.infer<typeof FormulaNodeSchema>;
export type UserInputNode = z.infer<typeof UserInputNodeSchema>;
export type TableNode = z.infer<typeof TableNodeSchema>;
export type CoefficientNode = z.infer<typeof CoefficientNodeSchema>;
export type DerivedCoefficientNode = z.infer<typeof DerivedCoefficientNodeSchema>;
export type ConstantNode = z.infer<typeof ConstantNodeSchema>;
export type Node = z.infer<typeof NodeSchema>;
export type NodeId = string;
export type NodeType = Node["type"];
