import type { Condition, NodeMeta } from "./schemas";

type Child = { nodeId: string; when?: Condition };
type Dep = string | { key: string; when: Condition };

/**
 * Node ID = `${prefix}-${key}` with underscores replaced by hyphens.
 * e.g. prefix="tension", key="N_pl_Rd" → id="tension-N-pl-Rd"
 * Children reference the same convention, so deps are just key strings.
 */
function toId(prefix: string, key: string): string {
  return `${prefix}-${key.replace(/_/g, "-")}`;
}

function depsToChildren(prefix: string, deps: readonly Dep[]): Child[] {
  return deps.map((dep) => {
    if (typeof dep === "string") return { nodeId: toId(prefix, dep) };
    return { nodeId: toId(prefix, dep.key), when: dep.when };
  });
}

// ── Leaf nodes (no dependencies) ──

export function input<K extends string>(
  prefix: string,
  key: K,
  name: string,
  opts?: { unit?: string; symbol?: string; description?: string },
) {
  return {
    type: "user-input" as const,
    key,
    valueType: "number" as const,
    id: toId(prefix, key),
    name,
    symbol: opts?.symbol,
    description: opts?.description,
    unit: opts?.unit,
    children: [] as Child[],
  };
}

export function stringInput<K extends string>(
  prefix: string,
  key: K,
  name: string,
  opts?: { unit?: string; symbol?: string; description?: string },
) {
  return {
    type: "user-input" as const,
    key,
    valueType: "string" as const,
    id: toId(prefix, key),
    name,
    symbol: opts?.symbol,
    description: opts?.description,
    unit: opts?.unit,
    children: [] as Child[],
  };
}

export function coeff<K extends string>(
  prefix: string,
  key: K,
  name: string,
  meta: NodeMeta,
  opts?: { symbol?: string; description?: string },
) {
  return {
    type: "coefficient" as const,
    key,
    valueType: "number" as const,
    id: toId(prefix, key),
    name,
    symbol: opts?.symbol,
    description: opts?.description,
    meta,
    children: [] as Child[],
  };
}

// ── Computed nodes (have dependencies) ──

export function formula<K extends string>(
  prefix: string,
  key: K,
  name: string,
  deps: readonly Dep[],
  opts: {
    expression: string;
    meta: NodeMeta & { formulaRef: string };
    unit?: string;
    symbol?: string;
    description?: string;
  },
) {
  return {
    type: "formula" as const,
    key,
    valueType: "number" as const,
    id: toId(prefix, key),
    name,
    symbol: opts.symbol,
    description: opts.description,
    expression: opts.expression,
    unit: opts.unit,
    meta: opts.meta,
    children: depsToChildren(prefix, deps),
  };
}

export function derived<K extends string>(
  prefix: string,
  key: K,
  name: string,
  deps: readonly Dep[],
  opts?: {
    expression?: string;
    meta?: NodeMeta;
    unit?: string;
    symbol?: string;
    description?: string;
  },
) {
  return {
    type: "derived" as const,
    key,
    valueType: "number" as const,
    id: toId(prefix, key),
    name,
    symbol: opts?.symbol,
    description: opts?.description,
    expression: opts?.expression,
    unit: opts?.unit,
    meta: opts?.meta,
    children: depsToChildren(prefix, deps),
  };
}

export function check<K extends string>(
  prefix: string,
  key: K,
  name: string,
  deps: readonly Dep[],
  opts: {
    verificationExpression: string;
    meta?: NodeMeta;
  },
) {
  return {
    type: "check" as const,
    key,
    valueType: "number" as const,
    id: toId(prefix, key),
    name,
    verificationExpression: opts.verificationExpression,
    meta: opts.meta,
    children: depsToChildren(prefix, deps),
  };
}
