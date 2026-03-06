import { VerificationSchema, type Node } from "./schemas";

export type NationalAnnex = {
  id: string;
  coefficients: Record<string, number>;
};

type ComputedNodeType = "formula" | "derived" | "table" | "check";

export type ValueType =
  | { readonly type: "number"; readonly literal?: readonly number[] }
  | { readonly type: "string"; readonly literal?: readonly string[] };

type NumberValue<TValueType extends ValueType> = TValueType extends {
  type: "number";
  literal: readonly number[];
}
  ? TValueType["literal"][number]
  : number;

type StringValue<TValueType extends ValueType> = TValueType extends {
  type: "string";
  literal: readonly string[];
}
  ? TValueType["literal"][number]
  : string;

type ValueFromValueType<TValueType extends ValueType> = TValueType extends {
  type: "number";
}
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

type SelectorDerivedNode<TNodes extends readonly Node[]> = Extract<
  TNodes[number],
  {
    type: "derived";
    expression?: undefined;
    children: readonly [unknown, ...unknown[]];
  }
>;

type SelectorDerivedKey<TNodes extends readonly Node[]> = Extract<
  SelectorDerivedNode<TNodes>["key"],
  keyof InferComputed<TNodes>
>;

type RequiredComputedKey<TNodes extends readonly Node[]> = Exclude<
  keyof InferComputed<TNodes>,
  SelectorDerivedKey<TNodes>
>;

export type EvaluatorArgs<
  TNodes extends readonly Node[],
  TInputs extends EvaluationContext["inputs"] = EvaluationContext["inputs"],
> = Readonly<InferCache<TNodes> & TInputs>;

export type VerificationDefinition<
  TNodes extends readonly Node[],
  TInputs extends EvaluationContext["inputs"] = EvaluationContext["inputs"],
> = { nodes: TNodes; evaluate: Evaluate<TNodes, TInputs> };

type EvaluateRequired<
  TNodes extends readonly Node[],
  TInputs extends EvaluationContext["inputs"],
> = {
  [K in RequiredComputedKey<TNodes>]: (
    deps: EvaluatorArgs<TNodes, TInputs>,
  ) => InferComputed<TNodes>[K];
};

type EvaluateOptional<
  TNodes extends readonly Node[],
  TInputs extends EvaluationContext["inputs"],
> = {
  [K in SelectorDerivedKey<TNodes>]?: (
    deps: EvaluatorArgs<TNodes, TInputs>,
  ) => InferComputed<TNodes>[K];
};

type Evaluate<
  TNodes extends readonly Node[],
  TInputs extends EvaluationContext["inputs"],
> = EvaluateRequired<TNodes, TInputs> & EvaluateOptional<TNodes, TInputs>;

export const defineNodes = <const TNodes extends readonly Node[]>(
  nodes: readonly [...TNodes],
): readonly [...TNodes] => {
  VerificationSchema.parse(nodes);
  return nodes;
};

export const defineEvaluators = <
  const TNodes extends readonly Node[],
  TInputs extends EvaluationContext["inputs"] = EvaluationContext["inputs"],
>(
  evaluators: Evaluate<TNodes, TInputs>,
): Evaluate<TNodes, TInputs> => evaluators;

export type EvaluationContext = {
  inputs: Record<string, number | string>;
  annex: NationalAnnex;
};
