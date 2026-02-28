
export type NationalAnnex = {
  id: string;
  coefficients: Record<string, number>;
};

/**
 * Mathematical constants resolved by the engine for ConstantNode.
 * Single source of truth -- never repeat these values in node definitions.
 */
export const CONSTANTS: Readonly<Record<string, number>> = {
  pi: Math.PI,
  piSq: Math.PI ** 2,
  sqrt3: Math.sqrt(3),
  e: Math.E,
};

type ComputedNodeType = "formula" | "derived" | "table" | "check";

/**
 * Minimal node shape required for cache type inference.
 * Allows `as const` on the whole array without per-property casts.
 * Includes `name` since all node types carry it (BaseNodeSchema).
 */
export type InferableNode = {
  readonly type: string;
  readonly key: string;
  readonly name: string;
  readonly valueType: "number" | "string";
};

/**
 * Infers the full cache type from a const node array.
 * Each node contributes { [key]: number | string } based on its valueType literal.
 *
 * Use `as const` on the entire node array:
 *   const nodes = [{ type: "formula", key: "N_cr", valueType: "number", ... }] as const;
 */
export type InferCache<TNodes extends readonly InferableNode[]> = {
  [N in TNodes[number] as N["key"]]: N extends { valueType: "number" }
    ? number
    : string;
};

/**
 * Subset of InferCache covering only nodes that require evaluators
 * (formula, derived, table, check). Input nodes (user-input, constant,
 * coefficient) are resolved directly from context and need no evaluator.
 */
type InferComputed<TNodes extends readonly InferableNode[]> = {
  [N in TNodes[number] as N["type"] extends ComputedNodeType
    ? N["key"]
    : never]: N extends { valueType: "number" } ? number : string;
};

/**
 * A self-contained verification: the graph (nodes) paired with TypeScript
 * evaluators for every computed node.
 *
 * TNodes must be a const-typed node array so that key and valueType literals
 * are preserved for InferCache to work correctly. Use `as const` on the array:
 *
 *   const nodes = [
 *     { type: "formula", key: "N_cr", valueType: "number", ... },
 *   ] as const;
 *
 *   export const myVerification: VerificationDefinition<typeof nodes> = { ... }
 */
export type VerificationDefinition<TNodes extends readonly InferableNode[]> = {
  nodes: TNodes;
  evaluate: {
    [K in keyof InferComputed<TNodes>]: (
      deps: Readonly<InferCache<TNodes>>,
    ) => InferComputed<TNodes>[K];
  };
};

export type EvaluationContext = {
  /** User-provided runtime values. Keys must match UserInputNode keys. */
  inputs: Record<string, number | string>;
  /** National annex for coefficient resolution. Defaults to Eurocode values. */
  annex: NationalAnnex;
};
