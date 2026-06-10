import type { NDGTraceEntry, NDGValue } from "@ndg/ndg-core";
import { applyDisplayUnit } from "@ndg/ndg-ec3-1-1";

import { formatNumber } from "@formatters/number";

export const formatValue = (value: NDGValue) =>
  typeof value === "number" ? formatNumber(value) : value;

const KEY_PATTERN = /\\key\{([^}]+)\}/g;

const displayTerm = (
  value: NDGValue,
  key: string,
  displayUnit: string | undefined,
) => {
  const converted = applyDisplayUnit(value, key, displayUnit);
  const unit = converted.tex ? `\\,${converted.tex}` : "";
  return `\\text{${formatValue(converted.value)}}${unit}`;
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
    return displayTerm(entry.value, entry.key, entry.displayUnit);
  });

export type Step = {
  symbol: string | undefined;
  template: string;
  value: NDGValue;
  key: string;
  displayUnit: string | undefined;
};

export const stepEquation = (
  step: Step,
  entryByKey: Map<string, NDGTraceEntry>,
) => {
  const symbolic = renderTemplate(step.template, entryByKey, "symbol");
  const numeric = renderTemplate(step.template, entryByKey, "value");
  const result = displayTerm(step.value, step.key, step.displayUnit);
  const lhs = step.symbol ? `${step.symbol} = ` : "";
  return `${lhs}${[symbolic, numeric, result].filter(Boolean).join(" = ")}`;
};
