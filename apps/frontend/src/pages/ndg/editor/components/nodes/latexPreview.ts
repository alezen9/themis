import type { NDGTraceEntry } from "@ndg/ndg-core";

export const latexPreview = (
  node: Pick<NDGTraceEntry, "symbol" | "expression" | "unit">,
) => {
  const { symbol, expression, unit } = node;
  const body = [symbol, expression].filter(Boolean).join(" = ");
  if (!body) return unit ? `(${unit})` : undefined;
  return unit ? `${body} \\quad (${unit})` : body;
};
