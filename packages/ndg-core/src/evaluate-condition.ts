import { type Condition, type ConditionOperand } from "./schema";

type Context = Record<string, string | number>; // constants + inputs + computed values

const readKey = (key: string, ctx: Context) => {
  const value = ctx[key];
  if (value === undefined) {
    throw new Error(`Condition references undefined context key: "${key}"`);
  }
  return value;
};

const resolveRightOperand = (operand: ConditionOperand, ctx: Context) => {
  if ("key" in operand) return readKey(operand.key, ctx);
  return operand.value;
};

const assertNumber = (value: number | string, label: string) => {
  if (typeof value !== "number") {
    throw new Error(`Condition ${label} must resolve to a number`);
  }
  return value;
};

/**
 * Evaluate a condition against the merged condition context.
 */
export const evaluateCondition = (
  condition: Condition,
  ctx: Context,
): boolean => {
  switch (true) {
    case "eq" in condition: {
      const [left, right] = condition.eq;
      return readKey(left, ctx) === resolveRightOperand(right, ctx);
    }
    case "lt" in condition: {
      const [left, right] = condition.lt;
      return (
        assertNumber(readKey(left, ctx), "left operand") <
        assertNumber(resolveRightOperand(right, ctx), "right operand")
      );
    }
    case "lte" in condition: {
      const [left, right] = condition.lte;
      return (
        assertNumber(readKey(left, ctx), "left operand") <=
        assertNumber(resolveRightOperand(right, ctx), "right operand")
      );
    }
    case "gt" in condition: {
      const [left, right] = condition.gt;
      return (
        assertNumber(readKey(left, ctx), "left operand") >
        assertNumber(resolveRightOperand(right, ctx), "right operand")
      );
    }
    case "gte" in condition: {
      const [left, right] = condition.gte;
      return (
        assertNumber(readKey(left, ctx), "left operand") >=
        assertNumber(resolveRightOperand(right, ctx), "right operand")
      );
    }
    case "and" in condition:
      return condition.and.every((item) => evaluateCondition(item, ctx));
    case "or" in condition:
      return condition.or.some((item) => evaluateCondition(item, ctx));
    default:
      throw new Error(`Unknown condition: ${JSON.stringify(condition)}`);
  }
};
