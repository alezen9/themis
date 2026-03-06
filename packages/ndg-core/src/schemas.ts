import { z } from "zod";

export const NodeMetaSchema = z.strictObject({
  sectionRef: z.string().optional(),
  paragraphRef: z.string().optional(),
  subParagraphRef: z.string().optional(),
  formulaRef: z.string().optional(),
  tableRef: z.string().optional(),
  verificationRef: z.string().optional(),
});

// Explicit type declaration required for recursive Zod schemas
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
    z.strictObject({ eq: z.tuple([z.string(), z.unknown()]) }),
    z.strictObject({ lt: z.tuple([z.string(), z.number()]) }),
    z.strictObject({ lte: z.tuple([z.string(), z.number()]) }),
    z.strictObject({ gt: z.tuple([z.string(), z.number()]) }),
    z.strictObject({ gte: z.tuple([z.string(), z.number()]) }),
    z.strictObject({ and: z.array(ConditionSchema) }),
    z.strictObject({ or: z.array(ConditionSchema) }),
  ]),
);

export const ChildSchema = z.strictObject({
  nodeId: z.string(),
  when: ConditionSchema.optional(),
});

const BaseNodeSchema = z.strictObject({
  id: z.string(),
  name: z.string(),
  symbol: z.string().optional(), // LaTeX: "N_{cr}", "\\bar{\\lambda}", "A"
  description: z.string().optional(),
  children: z.array(ChildSchema).readonly(),
});

const NumericValueType = z.strictObject({
  type: z.literal("number"),
  literal: z.array(z.number()).readonly().optional(),
});

const StringValueType = z.strictObject({
  type: z.literal("string"),
  literal: z.array(z.string()).readonly().optional(),
});

const AnyValueType = z.union([NumericValueType, StringValueType]);

/**
 * Root node of a verification.
 * Evaluator returns the utilisation ratio; pass = ratio <= 1.0.
 */
export const CheckNodeSchema = BaseNodeSchema.extend({
  type: z.literal("check"),
  key: z.string(),
  valueType: NumericValueType,
  meta: NodeMetaSchema.optional(),
  verificationExpression: z.string(), // LaTeX: "\\frac{N_{Ed}}{N_{c,Rd}} \\leq 1.0"
});

/**
 * Numbered Eurocode equation. formulaRef is required.
 */
export const FormulaNodeSchema = BaseNodeSchema.extend({
  type: z.literal("formula"),
  key: z.string(),
  valueType: NumericValueType,
  meta: NodeMetaSchema.extend({ formulaRef: z.string() }),
  expression: z.string(), // LaTeX: "\\frac{A \\cdot f_y}{\\gamma_{M0}}"
  unit: z.string().optional(),
});

/**
 * Computed value not tied to a numbered equation (e.g. derived from geometry,
 * selected from logic, or a categorical result).
 */
export const DerivedNodeSchema = BaseNodeSchema.extend({
  type: z.literal("derived"),
  key: z.string(),
  valueType: AnyValueType,
  meta: NodeMetaSchema.optional(),
  expression: z.string().optional(), // LaTeX, optional
  unit: z.string().optional(),
});

/**
 * Value selected from a structured normative or external table.
 * source is documentary; resolution is handled by the evaluator.
 */
export const TableNodeSchema = BaseNodeSchema.extend({
  type: z.literal("table"),
  key: z.string(),
  valueType: AnyValueType,
  meta: NodeMetaSchema.optional(),
  source: z.string(), // e.g. "EC3-Table-6.2"
  unit: z.string().optional(),
});

/**
 * Fixed normative factor (e.g. gamma_M0). Value comes from the national annex.
 */
export const CoefficientNodeSchema = BaseNodeSchema.extend({
  type: z.literal("coefficient"),
  key: z.string(),
  valueType: NumericValueType,
  meta: NodeMetaSchema,
  unit: z.string().optional(),
});

/**
 * Value provided by the engineer at runtime.
 */
export const UserInputNodeSchema = BaseNodeSchema.extend({
  type: z.literal("user-input"),
  key: z.string(),
  valueType: AnyValueType,
  unit: z.string().optional(),
});

/**
 * Mathematical constant (e.g. pi). Value is resolved by the engine.
 * symbol is required.
 */
export const ConstantNodeSchema = BaseNodeSchema.extend({
  type: z.literal("constant"),
  key: z.string(),
  valueType: NumericValueType,
  symbol: z.string(), // overrides BaseNode's optional symbol -- required here
});

export const NodeSchema = z.discriminatedUnion("type", [
  CheckNodeSchema,
  FormulaNodeSchema,
  DerivedNodeSchema,
  TableNodeSchema,
  CoefficientNodeSchema,
  UserInputNodeSchema,
  ConstantNodeSchema,
]);

export const VerificationSchema = z.array(NodeSchema);

export type NodeMeta = z.infer<typeof NodeMetaSchema>;
export type Child = z.infer<typeof ChildSchema>;
export type CheckNode = z.infer<typeof CheckNodeSchema>;
export type FormulaNode = z.infer<typeof FormulaNodeSchema>;
export type DerivedNode = z.infer<typeof DerivedNodeSchema>;
export type TableNode = z.infer<typeof TableNodeSchema>;
export type CoefficientNode = z.infer<typeof CoefficientNodeSchema>;
export type UserInputNode = z.infer<typeof UserInputNodeSchema>;
export type ConstantNode = z.infer<typeof ConstantNodeSchema>;
export type Node = z.infer<typeof NodeSchema>;
export type Verification = z.infer<typeof VerificationSchema>;
export type NodeId = string;
export type NodeType = Node["type"];
