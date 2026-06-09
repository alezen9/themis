import type { NDGTraceEntry, NDGValue } from "@ndg/ndg-core";

import { formatNumber } from "@formatters/number";

export const formatValue = (value: NDGValue) =>
  typeof value === "number" ? formatNumber(value) : value;

const KEY_PATTERN = /\\key\{([^}]+)\}/g;

const formatTerm = (entry: NDGTraceEntry) => {
  const unit = entry.unit ? `\\,${entry.unit}` : "";
  return `\\text{${formatValue(entry.value)}}${unit}`;
};

const resultTerm = (value: NDGValue, unit: string | undefined) => {
  const tail = unit ? `\\,${unit}` : "";
  return `\\text{${formatValue(value)}}${tail}`;
};

const renderTemplate = (
  template: string,
  entryByKey: Map<string, NDGTraceEntry>,
  mode: "symbol" | "value",
) =>
  template.replace(KEY_PATTERN, (_match, key: string) => {
    const entry = entryByKey.get(key);
    if (!entry) return key;
    if (mode === "symbol") return entry.symbol ?? key;
    return formatTerm(entry);
  });

export type Step = {
  symbol: string | undefined;
  template: string;
  value: NDGValue;
  unit: string | undefined;
};

export const stepEquation = (
  step: Step,
  entryByKey: Map<string, NDGTraceEntry>,
) => {
  const symbolic = renderTemplate(step.template, entryByKey, "symbol");
  const numeric = renderTemplate(step.template, entryByKey, "value");
  const lhs = step.symbol ? `${step.symbol} = ` : "";
  return `${lhs}${[symbolic, numeric, resultTerm(step.value, step.unit)]
    .filter(Boolean)
    .join(" = ")}`;
};
