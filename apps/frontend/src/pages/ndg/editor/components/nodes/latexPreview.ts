import { formatNumber } from "@formatters/number";
import { constantCatalog, getBaseUnit, resolveKeyRefs } from "@ndg/ndg-core";

export const SELECT_PREVIEW_TEX =
  "\\left\\langle \\text{select} \\right\\rangle";

const escapeKey = (key: string) => `\\text{${key.replace(/_/g, "\\_")}}`;

export type SymbolByKey = Record<string, string | undefined>;

export const renderKeyPlaceholders = (
  template: string,
  symbolByKey?: SymbolByKey,
) => resolveKeyRefs(template, key => symbolByKey?.[key] ?? escapeKey(key));

type LatexPreviewNode = {
  symbol?: string;
  template?: string;
  key?: string;
  value?: number;
  symbolByKey?: SymbolByKey;
};

export const latexPreview = (node: LatexPreviewNode) => {
  const { symbol, value, template, key, symbolByKey } = node;
  const unit = key ? getBaseUnit(key)?.tex : undefined;
  const constantValue = value ?? constantCatalog[key ?? ""]?.value;
  const formattedValue =
    constantValue !== undefined ? formatNumber(constantValue) : undefined;
  const definition = template
    ? renderKeyPlaceholders(template, symbolByKey)
    : formattedValue;
  const body = [symbol, definition].filter(Boolean).join(" = ");
  if (!body) return unit ? `(${unit})` : "";
  return unit ? `${body} \\quad (${unit})` : body;
};
