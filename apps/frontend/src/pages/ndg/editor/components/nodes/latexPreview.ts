import { formatNumber } from "@formatters/number";
import { constantCatalog } from "@ndg/ndg-core";

export const SELECT_PREVIEW_TEX = "\\left\\langle \\text{select} \\right\\rangle";

const KEY_PATTERN = /\\key\{([^}]+)\}/g;

const escapeKey = (key: string) => `\\text{${key.replace(/_/g, "\\_")}}`;

export type SymbolByKey = Record<string, string | undefined>;

export const renderKeyPlaceholders = (
  template: string,
  symbolByKey?: SymbolByKey,
) =>
  template.replace(
    KEY_PATTERN,
    (_match, key: string) => symbolByKey?.[key] ?? escapeKey(key),
  );

type LatexPreviewNode = {
  symbol?: string;
  template?: string;
  unit?: string;
  key?: string;
  value?: number;
  symbolByKey?: SymbolByKey;
};

export const latexPreview = (node: LatexPreviewNode) => {
  const { symbol, unit, value, template, key, symbolByKey } = node;
  const constantValue = value ?? constantCatalog[key ?? ""]?.value;
  const formattedValue =
    constantValue !== undefined ? formatNumber(constantValue) : undefined;
  const definition = template
    ? renderKeyPlaceholders(template, symbolByKey)
    : formattedValue;
  const body = [symbol, definition].filter(Boolean).join(" = ");
  if (!body) return unit ? `(${unit})` : undefined;
  return unit ? `${body} \\quad (${unit})` : body;
};
