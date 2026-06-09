import { z } from "zod";

export const NodeMetaSchema = z.strictObject({
  sectionRef: z.string().optional(),
  paragraphRef: z.string().optional(),
  subParagraphRef: z.string().optional(),
  formulaRef: z.string().optional(),
  tableRef: z.string().optional(),
  verificationRef: z.string().optional(),
});

const ConditionKeySchema = z.string();

const ConditionOperandSchema = z.union([
  z.strictObject({ value: z.union([z.string(), z.number(), z.boolean()]) }),
  z.strictObject({ key: z.string() }),
]);
const ConditionTupleSchema = z
  .tuple([ConditionKeySchema, ConditionOperandSchema])
  .readonly();

const ComparisonConditionSchema = z.union([
  z.strictObject({ eq: ConditionTupleSchema }),
  z.strictObject({ ne: ConditionTupleSchema }),
  z.strictObject({ lt: ConditionTupleSchema }),
  z.strictObject({ lte: ConditionTupleSchema }),
  z.strictObject({ gt: ConditionTupleSchema }),
  z.strictObject({ gte: ConditionTupleSchema }),
]);

const AndConditionSchema = z.strictObject({
  get and() {
    return z.array(ConditionSchema).readonly();
  },
});

const OrConditionSchema = z.strictObject({
  get or() {
    return z.array(ConditionSchema).readonly();
  },
});

export const ConditionSchema = z.union([
  ComparisonConditionSchema,
  AndConditionSchema,
  OrConditionSchema,
]);

export const ChildSchema = z.strictObject({
  nodeId: z.string(),
  when: ConditionSchema.optional(),
});

const BaseNodeSchema = z.strictObject({
  id: z.string(),
  symbol: z.string().optional(), // LaTeX: "N_{cr}", "\bar{\lambda}", "A"
  description: z.string().optional(),
  children: z.array(ChildSchema).readonly(),
});

const NumericValueType = z.strictObject({ type: z.literal("number") });
const StringValueType = z.strictObject({ type: z.literal("string") });
const BooleanValueType = z.strictObject({ type: z.literal("boolean") });

const ValueTypeSchema = z.discriminatedUnion("type", [
  NumericValueType,
  StringValueType,
  BooleanValueType,
]);

/**
 * Root node of a verification, computing the utilisation ratio directly.
 * `template` is a keyed LaTeX string (placeholders `\key{node_key}`).
 * Evaluator returns the utilisation ratio; pass = ratio <= 1.0.
 */
export const CheckComputeNodeSchema = BaseNodeSchema.extend({
  type: z.literal("check"),
  variant: z.literal("compute"),
  key: z.literal("utilisation"),
  name: z.string().min(1),
  valueType: NumericValueType,
  meta: NodeMetaSchema.optional(),
  template: z.string().min(1),
});

/**
 * Root node that selects one of several mutually-exclusive verification branches.
 * Pure: no formula of its own -- inherits the winning branch's display + value at
 * runtime. The engine enforces exactly one active child.
 */
export const CheckSelectNodeSchema = z.strictObject({
  id: z.string(),
  type: z.literal("check"),
  variant: z.literal("select"),
  key: z.literal("utilisation"),
  name: z.string().min(1),
  valueType: NumericValueType,
  children: z.array(ChildSchema).readonly(),
});

export const CheckNodeSchema = z.discriminatedUnion("variant", [
  CheckComputeNodeSchema,
  CheckSelectNodeSchema,
]);

/**
 * Computed value with a keyed LaTeX template (placeholders `\key{node_key}`).
 * Children are the terms referenced by the template.
 */
export const FormulaComputeNodeSchema = BaseNodeSchema.extend({
  type: z.literal("formula"),
  variant: z.literal("compute"),
  key: z.string().min(1),
  valueType: ValueTypeSchema,
  meta: NodeMetaSchema.optional(),
  displayUnit: z.string().optional(),
  template: z.string().min(1),
});

/**
 * Selects one of several mutually-exclusive child branches. Pure key: no template,
 * symbol, unit or meta -- all inherited from the winning child at runtime. The engine
 * enforces exactly one active child and overrides its key with this node's key.
 */
export const FormulaSelectNodeSchema = z.strictObject({
  id: z.string(),
  type: z.literal("formula"),
  variant: z.literal("select"),
  key: z.string().min(1),
  valueType: ValueTypeSchema,
  children: z.array(ChildSchema).readonly(),
});

export const FormulaNodeSchema = z.discriminatedUnion("variant", [
  FormulaComputeNodeSchema,
  FormulaSelectNodeSchema,
]);

/**
 * Value selected from a structured normative or external table.
 * source is documentary; resolution is handled by the evaluator.
 */
export const TableNodeSchema = BaseNodeSchema.extend({
  type: z.literal("table"),
  key: z.string().min(1),
  valueType: ValueTypeSchema,
  meta: NodeMetaSchema.optional(),
  source: z.string().min(1), // e.g. "EC3-Table-6.2"
  displayUnit: z.string().optional(),
});

/**
 * Fixed normative factor (e.g. gamma_M0). Value comes from the national annex.
 */
export const CoefficientNodeSchema = BaseNodeSchema.extend({
  type: z.literal("coefficient"),
  key: z.string().min(1),
  valueType: NumericValueType,
  meta: NodeMetaSchema.optional(),
  displayUnit: z.string().optional(),
});

/**
 * Value provided by the engineer at runtime.
 */
export const UserInputNodeSchema = BaseNodeSchema.extend({
  type: z.literal("user-input"),
  key: z.string().min(1),
  valueType: ValueTypeSchema,
  displayUnit: z.string().optional(),
});

/**
 * Mathematical constant (e.g. pi). Value is resolved by the engine.
 * symbol is required.
 */
export const ConstantNodeSchema = BaseNodeSchema.extend({
  type: z.literal("constant"),
  key: z.string().min(1),
  valueType: NumericValueType,
  displayUnit: z.string().optional(),
  value: z.number().optional(), // inline value for a custom constant; named constants resolve from the registry
});

export const NodeSchema = z.union([
  CheckComputeNodeSchema,
  CheckSelectNodeSchema,
  FormulaComputeNodeSchema,
  FormulaSelectNodeSchema,
  TableNodeSchema,
  CoefficientNodeSchema,
  UserInputNodeSchema,
  ConstantNodeSchema,
]);

export const NDGSchema = z.array(NodeSchema);

export type NodeMeta = z.infer<typeof NodeMetaSchema>;
export type Child = z.infer<typeof ChildSchema>;
export type CheckNode = z.infer<typeof CheckNodeSchema>;
export type FormulaNode = z.infer<typeof FormulaNodeSchema>;
export type Node = z.infer<typeof NodeSchema>;
export type NodeType = Node["type"];

export type Condition = z.infer<typeof ConditionSchema>;
export type ConditionOperand = z.infer<typeof ConditionOperandSchema>;
export type ConditionTuple = z.infer<typeof ConditionTupleSchema>;

export type ComputedNode = CheckNode | FormulaNode;
export type SelectNode =
  | z.infer<typeof CheckSelectNodeSchema>
  | z.infer<typeof FormulaSelectNodeSchema>;

export const isComputedNode = (node: Node): node is ComputedNode => {
  return node.type === "formula" || node.type === "check";
};

export const isSelectNode = (node: Node): node is SelectNode => {
  return isComputedNode(node) && node.variant === "select";
};
