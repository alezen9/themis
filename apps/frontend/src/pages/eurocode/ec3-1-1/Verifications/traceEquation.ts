import type { FormulaExpression, NDGTraceEntry, NDGValue } from "@ndg/ndg-core";

import { formatNumber } from "@formatters/number";

export const formatValue = (value: NDGValue) =>
  typeof value === "number" ? formatNumber(value) : value;

const PLACEHOLDER_PATTERN = /\$[A-Za-z_][A-Za-z0-9_.]*/g;

const formatTerm = (entry: NDGTraceEntry) => {
  const unit = entry.unit ? `\\,${entry.unit}` : "";
  return `\\text{${formatValue(entry.value)}}${unit}`;
};

const resultTerm = (value: NDGValue, unit: string | undefined) => {
  const tail = unit ? `\\,${unit}` : "";
  return `\\text{${formatValue(value)}}${tail}`;
};

const resolveCalculation = (
  calculation: string | undefined,
  inputs: Record<string, NDGValue> | undefined,
  entryByKey: Map<string, NDGTraceEntry>,
) => {
  if (!calculation) return undefined;
  const keys = [...calculation.matchAll(PLACEHOLDER_PATTERN)].map(match =>
    match[0].slice(1),
  );
  const missingKey = keys.find(key => {
    const entry = entryByKey.get(key);
    if (!entry) return true;
    if (entry.type === "formula" || entry.type === "check")
      return inputs?.[key] === undefined;
    return false;
  });
  if (missingKey) return undefined;

  return calculation.replace(PLACEHOLDER_PATTERN, placeholder => {
    const key = placeholder.slice(1);
    const entry = entryByKey.get(key);
    return entry ? formatTerm(entry) : placeholder;
  });
};

const rowEquation = (
  row: FormulaExpression,
  calculation: string | undefined,
  result: string | undefined,
) => [row.expression, calculation, result].filter(Boolean).join(" = ");

const singleStepEquation = (
  symbol: string | undefined,
  expression: FormulaExpression,
  calculation: string | undefined,
  value: NDGValue,
  unit: string | undefined,
) => {
  const lhs = symbol ? `${symbol} = ` : "";
  return `${lhs}${rowEquation(expression, calculation, resultTerm(value, unit))}`;
};

const multiStepEquation = (
  symbol: string | undefined,
  expressions: readonly FormulaExpression[],
  calculations: readonly (string | undefined)[],
  value: NDGValue,
  unit: string | undefined,
) => {
  const lhs = symbol ? `${symbol} = ` : "";
  const winningIndex = calculations.findIndex(Boolean);
  const rows = expressions.map((expression, index) =>
    rowEquation(
      expression,
      calculations[index],
      index === winningIndex ? resultTerm(value, unit) : undefined,
    ),
  );
  return `${lhs}\\left\\{ \\begin{array}{l} ${rows.join(
    " \\\\[10pt] ",
  )} \\end{array} \\right.`;
};

export const stepEquation = (
  step: {
    symbol: string | undefined;
    expressions: readonly FormulaExpression[];
    value: NDGValue;
    unit: string | undefined;
    evaluatorInputs: Record<string, NDGValue> | undefined;
  },
  entryByKey: Map<string, NDGTraceEntry>,
) => {
  const calculations = step.expressions.map(expression =>
    resolveCalculation(expression.calculation, step.evaluatorInputs, entryByKey),
  );

  if (step.expressions.length === 1 && step.expressions[0])
    return singleStepEquation(
      step.symbol,
      step.expressions[0],
      calculations[0],
      step.value,
      step.unit,
    );

  return multiStepEquation(
    step.symbol,
    step.expressions,
    calculations,
    step.value,
    step.unit,
  );
};
