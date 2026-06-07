import { formatNumber } from "@formatters/number";
import { constantCatalog } from "@ndg/ndg-core";

type LatexPreviewNode = {
  symbol?: string;
  expression?: string;
  expressions?: readonly { expression: string }[];
  unit?: string;
  key?: string;
  value?: number;
};

export const latexPreview = (node: LatexPreviewNode) => {
  const { symbol, unit, value, expression, expressions } = node;
  const constantValue = value ?? constantCatalog[node.key ?? ""]?.value;
  const formattedValue =
    constantValue !== undefined ? formatNumber(constantValue) : undefined;
  const definition = expressions?.length
    ? formulaExpressionsPreview(expressions)
    : expression ?? formattedValue;
  const body = [symbol, definition].filter(Boolean).join(" = ");
  if (!body) return unit ? `(${unit})` : undefined;
  return unit ? `${body} \\quad (${unit})` : body;
};

const formulaExpressionsPreview = (
  expressions: readonly { expression: string }[],
) => {
  if (expressions.length === 1) return expressions[0]?.expression;
  const rows = expressions.map(row => row.expression).join(" \\\\[10pt] ");
  return `\\left\\{ \\begin{array}{l} ${rows} \\end{array} \\right.`;
};
