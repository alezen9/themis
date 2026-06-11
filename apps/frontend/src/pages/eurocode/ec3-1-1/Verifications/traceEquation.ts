import {
  resolveKeyRefs,
  scaleToUnit,
  type NDGTraceEntry,
  type NDGValue,
} from "@ndg/ndg-core";

import { formatNumber } from "@formatters/number";

export const formatValue = (value: NDGValue) =>
  typeof value === "number" ? formatNumber(value) : value;

const formatValueTex = (entry: {
  value: NDGValue;
  key: string;
  displayUnit?: string;
}) => {
  const { value, tex } = scaleToUnit(entry.value, entry.key, entry.displayUnit);
  return tex
    ? `\\text{${formatValue(value)}}\\,${tex}`
    : `\\text{${formatValue(value)}}`;
};

export const buildStepEquation = (
  entry: NDGTraceEntry,
  byKey: Map<string, NDGTraceEntry>,
) => {
  const template = entry.template ?? "";
  const symbolic = resolveKeyRefs(
    template,
    key => byKey.get(key)?.symbol ?? key,
  );
  const numeric = resolveKeyRefs(template, key => {
    const child = byKey.get(key);
    return child ? formatValueTex(child) : key;
  });
  const result = formatValueTex(entry);
  const lhs = entry.symbol ? `${entry.symbol} = ` : "";
  return `${lhs}${[symbolic, numeric, result].filter(Boolean).join(" = ")}`;
};
