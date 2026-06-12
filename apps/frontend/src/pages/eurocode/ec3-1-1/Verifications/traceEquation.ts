import {
  resolveKeyRefs,
  scaleToUnit,
  type NDGTraceEntry,
  type NDGValue,
} from "@ndg/ndg-core";

import { formatNumber } from "@formatters/number";

export const formatValue = (value: NDGValue) =>
  typeof value === "number" ? formatNumber(value) : value;

export const varClass = (key: string) =>
  `var-${key.replace(/[^a-zA-Z0-9_]/g, "-")}`;

export const tagVar = (key: string, body: string) =>
  `\\class{${varClass(key)}}{${body}}`;

// Formula terms also get a transparent bbox: it paints a rect behind the glyph
// (a hoverable hit area in every browser) that the drawer fills to highlight.
const tagTerm = (key: string, body: string) =>
  `\\class{${varClass(key)}}{\\bbox[4px,transparent]{${body}}}`;

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

export type StepParts = {
  symbolTex: string;
  symbolicTex: string;
  numericTex: string;
  resultTex: string;
};

export const buildStepParts = (
  entry: NDGTraceEntry,
  byKey: Map<string, NDGTraceEntry>,
): StepParts => {
  const template = entry.template ?? "";
  const symbolicTex = resolveKeyRefs(template, key =>
    tagTerm(key, byKey.get(key)?.symbol ?? key),
  );
  const numericTex = resolveKeyRefs(template, key => {
    const child = byKey.get(key);
    return tagTerm(key, child ? formatValueTex(child) : key);
  });

  return {
    symbolTex: entry.symbol ? tagTerm(entry.key, entry.symbol) : "",
    symbolicTex,
    numericTex,
    resultTex: tagTerm(entry.key, formatValueTex(entry)),
  };
};
