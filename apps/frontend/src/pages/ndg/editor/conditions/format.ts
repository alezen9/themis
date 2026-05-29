import type {
  Condition,
  ConditionOperand,
  ConditionTuple,
} from "@ndg/ndg-core";

export const OPERATOR_SYMBOL = {
  eq: "=",
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

export const formatCondition = (condition: Condition): string => {
  if ("eq" in condition) return formatComparison("eq", condition.eq);
  if ("lt" in condition) return formatComparison("lt", condition.lt);
  if ("lte" in condition) return formatComparison("lte", condition.lte);
  if ("gt" in condition) return formatComparison("gt", condition.gt);
  if ("gte" in condition) return formatComparison("gte", condition.gte);
  if ("and" in condition) return condition.and.map(wrapNested).join(" AND ");
  return condition.or.map(wrapNested).join(" OR ");
};
