import { formatNumber } from "@formatters/number";
import { constantCatalog } from "@ndg/ndg-core";
import type { NDGTraceEntry } from "@ndg/ndg-core";

export const latexPreview = (
  node: Pick<NDGTraceEntry, "symbol" | "expression" | "unit"> &
    Partial<Pick<NDGTraceEntry, "key">> & { value?: number },
) => {
  const { symbol, unit, value, expression } = node;
  const constantValue = value ?? constantCatalog[node.key ?? ""]?.value;
  const formattedValue =
    constantValue !== undefined ? formatNumber(constantValue) : undefined;
  const definition = expression ?? formattedValue;
  const body = [symbol, definition].filter(Boolean).join(" = ");
  if (!body) return unit ? `(${unit})` : undefined;
  return unit ? `${body} \\quad (${unit})` : body;
};
