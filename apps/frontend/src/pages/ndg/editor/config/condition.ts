import {
  ConditionSchema,
  type Condition,
  type ConditionOperand,
  type ConditionTuple,
} from "@ndg/ndg-core";

type UnionKeys<T> = T extends unknown ? keyof T : never;
type ConditionKey = UnionKeys<Condition>;
type OperandLiteralValue = Extract<
  ConditionOperand,
  { value: unknown }
>["value"];

type ParseResult =
  | { condition: Condition; error: null }
  | { condition: null; error: string };

export type ComparisonOperator = {
  [K in ConditionKey]: Extract<
    Condition,
    Record<K, unknown>
  >[K] extends ConditionTuple
    ? K
    : never;
}[ConditionKey];

export type GroupOperator = {
  [K in ConditionKey]: Extract<
    Condition,
    Record<K, unknown>
  >[K] extends Condition[]
    ? K
    : never;
}[ConditionKey];

export type OperandMode = UnionKeys<ConditionOperand>;

export type OperandValueType = OperandLiteralValue extends infer T
  ? T extends number
    ? "number"
    : T extends string
      ? "string"
      : never
  : never;

export type ConditionDraftRule = {
  kind: "rule";
  id: string;
  operator: ComparisonOperator;
  leftKey: string;
  rightMode: OperandMode;
  rightKey: string;
  rightValue: string;
  rightValueType: OperandValueType;
};

export type ConditionDraftGroup = {
  kind: "group";
  id: string;
  operator: GroupOperator;
  items: ConditionDraftEntry[];
};

export type ConditionDraftEntry = ConditionDraftGroup | ConditionDraftRule;

const comparisonOperators = [
  "eq",
  "lt",
  "lte",
  "gt",
  "gte",
] as const satisfies readonly ComparisonOperator[];
const comparisonSymbolByOperator: Record<ComparisonOperator, string> = {
  eq: "=",
  lt: "<",
  lte: "<=",
  gt: ">",
  gte: ">=",
};

const createDraftId = () => globalThis.crypto.randomUUID();

const formatSchemaIssue = (issue: { path: PropertyKey[]; message: string }) => {
  const pathLabel = issue.path.map((segment) => String(segment)).join(".");
  if (!pathLabel) return issue.message;
  return `${pathLabel}: ${issue.message}`;
};

const formatConditionOperand = (operand: ConditionOperand) =>
  "key" in operand ? operand.key : JSON.stringify(operand.value);

const buildComparisonCondition = (
  operator: ComparisonOperator,
  leftKey: string,
  rightOperand: ConditionOperand,
): Condition => {
  if (operator === "eq") return { eq: [leftKey, rightOperand] };
  if (operator === "lt") return { lt: [leftKey, rightOperand] };
  if (operator === "lte") return { lte: [leftKey, rightOperand] };
  if (operator === "gt") return { gt: [leftKey, rightOperand] };
  return { gte: [leftKey, rightOperand] };
};

const getComparisonTuple = (
  condition: Condition,
): [ComparisonOperator, ConditionTuple] | null => {
  const typedCondition = condition as Partial<
    Record<ComparisonOperator, ConditionTuple>
  >;
  for (const operator of comparisonOperators) {
    const tuple = typedCondition[operator];
    if (!tuple) continue;
    return [operator, tuple];
  }
  return null;
};

const conditionToRuleDraft = (
  operator: ComparisonOperator,
  tuple: ConditionTuple,
): ConditionDraftRule => {
  const [leftKey, rightOperand] = tuple;
  if ("key" in rightOperand) {
    return {
      kind: "rule",
      id: createDraftId(),
      operator,
      leftKey,
      rightMode: "key",
      rightKey: rightOperand.key,
      rightValue: "",
      rightValueType: "string",
    };
  }

  return {
    kind: "rule",
    id: createDraftId(),
    operator,
    leftKey,
    rightMode: "value",
    rightKey: "",
    rightValue: `${rightOperand.value}`,
    rightValueType: typeof rightOperand.value as OperandValueType,
  };
};

const parseConditionDraft = (entry: ConditionDraftEntry): ParseResult => {
  if (entry.kind === "group") {
    if (entry.items.length < 2) {
      return {
        condition: null,
        error: "Condition groups must contain at least two entries",
      };
    }

    const conditions: Condition[] = [];
    for (const item of entry.items) {
      const parsed = parseConditionDraft(item);
      if (parsed.error || !parsed.condition) return parsed;
      conditions.push(parsed.condition);
    }

    if (entry.operator === "and")
      return { condition: { and: conditions }, error: null };
    return { condition: { or: conditions }, error: null };
  }

  const leftKey = entry.leftKey.trim();
  if (!leftKey) return { condition: null, error: "Left key is required" };

  if (entry.rightMode === "key") {
    const rightKey = entry.rightKey.trim();
    if (!rightKey) return { condition: null, error: "Right key is required" };

    return {
      condition: buildComparisonCondition(entry.operator, leftKey, {
        key: rightKey,
      }),
      error: null,
    };
  }

  const rawValue = entry.rightValue.trim();
  if (!rawValue) return { condition: null, error: "Right value is required" };

  if (entry.operator !== "eq" || entry.rightValueType === "number") {
    const parsedNumber = Number(rawValue);
    if (Number.isNaN(parsedNumber)) {
      return {
        condition: null,
        error: "Right value must be a number for this operator",
      };
    }

    return {
      condition: buildComparisonCondition(entry.operator, leftKey, {
        value: parsedNumber,
      }),
      error: null,
    };
  }

  return {
    condition: buildComparisonCondition(entry.operator, leftKey, {
      value: rawValue,
    }),
    error: null,
  };
};

const patchEntry = (
  entry: ConditionDraftEntry,
  targetId: string,
  updater: (entry: ConditionDraftEntry) => ConditionDraftEntry,
): ConditionDraftEntry => {
  if (entry.id === targetId) return updater(entry);
  if (entry.kind === "rule") return entry;

  return {
    ...entry,
    items: entry.items.map((item) => patchEntry(item, targetId, updater)),
  };
};

export const formatCondition = (condition: Condition): string => {
  const comparison = getComparisonTuple(condition);
  if (comparison) {
    const [operator, [left, right]] = comparison;
    return `${left} ${comparisonSymbolByOperator[operator]} ${formatConditionOperand(right)}`;
  }
  if ("and" in condition) {
    return condition.and
      .map((entry) => `(${formatCondition(entry)})`)
      .join(" AND ");
  }
  if ("or" in condition) {
    return condition.or
      .map((entry) => `(${formatCondition(entry)})`)
      .join(" OR ");
  }
  return "";
};

export const validateCondition = (condition: Condition): ParseResult => {
  const parseResult = ConditionSchema.safeParse(condition);
  if (!parseResult.success) {
    return {
      condition: null,
      error: `Invalid condition: ${formatSchemaIssue(parseResult.error.issues[0])}`,
    };
  }

  return { condition: parseResult.data, error: null };
};

export const createDefaultRuleDraft = (): ConditionDraftRule => ({
  kind: "rule",
  id: createDraftId(),
  operator: "eq",
  leftKey: "",
  rightMode: "value",
  rightKey: "",
  rightValue: "",
  rightValueType: "string",
});

export const createDefaultGroupDraft = (
  operator: GroupOperator = "and",
): ConditionDraftGroup => ({
  kind: "group",
  id: createDraftId(),
  operator,
  items: [createDefaultRuleDraft(), createDefaultRuleDraft()],
});

export const createDefaultConditionDraft = (): ConditionDraftEntry =>
  createDefaultRuleDraft();

export const conditionToDraft = (condition: Condition): ConditionDraftEntry => {
  const comparison = getComparisonTuple(condition);
  if (comparison) return conditionToRuleDraft(comparison[0], comparison[1]);

  if ("and" in condition) {
    return {
      kind: "group",
      id: createDraftId(),
      operator: "and",
      items: condition.and.map((entry) => conditionToDraft(entry)),
    };
  }
  if ("or" in condition) {
    return {
      kind: "group",
      id: createDraftId(),
      operator: "or",
      items: condition.or.map((entry) => conditionToDraft(entry)),
    };
  }
  return createDefaultConditionDraft();
};

export const buildConditionFromDraft = (
  draft: ConditionDraftEntry,
): ParseResult => {
  const parsed = parseConditionDraft(draft);
  if (parsed.error || !parsed.condition) return parsed;

  const validated = validateCondition(parsed.condition);
  if (validated.error || !validated.condition) {
    return {
      condition: null,
      error: validated.error ?? "Condition is invalid",
    };
  }

  return { condition: validated.condition, error: null };
};

export const withGroup = (
  entry: ConditionDraftEntry,
  groupId: string,
  updater: (entry: ConditionDraftGroup) => ConditionDraftGroup,
): ConditionDraftEntry =>
  patchEntry(entry, groupId, (currentEntry) => {
    if (currentEntry.kind !== "group") return currentEntry;
    return updater(currentEntry);
  });

export const withRule = (
  entry: ConditionDraftEntry,
  ruleId: string,
  updater: (entry: ConditionDraftRule) => ConditionDraftRule,
): ConditionDraftEntry =>
  patchEntry(entry, ruleId, (currentEntry) => {
    if (currentEntry.kind !== "rule") return currentEntry;
    return updater(currentEntry);
  });
