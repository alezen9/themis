import type { Node } from "./schemas";

export type NationalAnnex = {
  id: string;
  coefficients: Record<string, number>;
};

type ComputedNodeType = "formula" | "derived" | "table" | "check";

export type ValueType =
  | { readonly type: "number"; readonly literal?: readonly number[] }
  | { readonly type: "string"; readonly literal?: readonly string[] };

type NumberValue<TValueType extends ValueType> =
  TValueType extends { type: "number"; literal: readonly number[] }
    ? TValueType["literal"][number]
    : number;

type StringValue<TValueType extends ValueType> =
  TValueType extends { type: "string"; literal: readonly string[] }
    ? TValueType["literal"][number]
    : string;

type ValueFromValueType<TValueType extends ValueType> =
  TValueType extends { type: "number" }
    ? NumberValue<TValueType>
    : StringValue<TValueType>;

type NodeValue<TNode extends Node> = ValueFromValueType<TNode["valueType"]>;

export type InferCache<TNodes extends readonly Node[]> = {
  [N in TNodes[number] as N["key"]]: NodeValue<N>;
};

type InferComputed<TNodes extends readonly Node[]> = {
  [N in TNodes[number] as N["type"] extends ComputedNodeType
    ? N["key"]
    : never]: NodeValue<N>;
};

export type VerificationDefinition<TNodes extends readonly Node[]> = {
  nodes: TNodes;
  evaluate: Evaluate<TNodes>;
};

type Evaluate<TNodes extends readonly Node[]> = {
  [K in keyof InferComputed<TNodes>]: (
    deps: Readonly<InferCache<TNodes>>,
  ) => InferComputed<TNodes>[K];
};

export const defineNodes = <const TNodes extends readonly Node[]>(
  nodes: TNodes,
): TNodes => nodes;

export const defineEvaluators = <const TNodes extends readonly Node[]>(
  evaluators: Evaluate<TNodes>,
): Evaluate<TNodes> => evaluators;

export type EvaluationContext = {
  inputs: Record<string, number | string>;
  annex: NationalAnnex;
};
