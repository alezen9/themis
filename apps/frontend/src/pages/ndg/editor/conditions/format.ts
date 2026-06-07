import {
  ConditionSchema,
  type Condition,
  type ConditionOperand,
  type ConditionTuple,
} from "@ndg/ndg-core";

export const OPERATOR_SYMBOL = {
  eq: "=",
  ne: "≠",
  lt: "<",
  lte: "≤",
  gt: ">",
  gte: "≥",
} as const;

export const formatOperand = (operand: ConditionOperand) => {
  if ("key" in operand) return operand.key;
  return typeof operand.value === "string"
    ? `"${operand.value}"`
    : String(operand.value);
};

const formatComparison = (
  operator: keyof typeof OPERATOR_SYMBOL,
  [key, operand]: ConditionTuple,
) => `${key} ${OPERATOR_SYMBOL[operator]} ${formatOperand(operand)}`;

const wrapNested = (condition: Condition) =>
  "and" in condition || "or" in condition
    ? `(${formatCondition(condition)})`
    : formatCondition(condition);

export const formatCondition = (condition?: unknown): string => {
  if (!condition) return "";
  const result = ConditionSchema.safeParse(condition);
  if (!result.success) return "";
  const value = result.data;
  if ("eq" in value) return formatComparison("eq", value.eq);
  if ("ne" in value) return formatComparison("ne", value.ne);
  if ("lt" in value) return formatComparison("lt", value.lt);
  if ("lte" in value) return formatComparison("lte", value.lte);
  if ("gt" in value) return formatComparison("gt", value.gt);
  if ("gte" in value) return formatComparison("gte", value.gte);
  if ("and" in value) return value.and.map(wrapNested).join(" AND ");
  return value.or.map(wrapNested).join(" OR ");
};
