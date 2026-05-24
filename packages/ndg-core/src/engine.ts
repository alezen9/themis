import { NDGSchema, type Node } from "./schema";

type ComputedNodeType = "formula" | "derived" | "table" | "check";

export type NDGValue = number | string;

export type ValueType =
  | { readonly type: "number"; readonly oneOf?: readonly number[] }
  | { readonly type: "string"; readonly oneOf?: readonly string[] };

type NumberValue<TValueType extends ValueType> = TValueType extends {
  type: "number";
  oneOf: readonly number[];
}
  ? TValueType["oneOf"][number]
  : number;

type StringValue<TValueType extends ValueType> = TValueType extends {
  type: "string";
  oneOf: readonly string[];
}
  ? TValueType["oneOf"][number]
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
  TValues extends NDGContext["values"] = NDGContext["values"],
> = Readonly<InferCache<TNodes> & TValues>;

export type NDGDefinition<
  TNodes extends readonly Node[],
  TValues extends NDGContext["values"] = NDGContext["values"],
> = { nodes: TNodes; evaluate: Evaluate<TNodes, TValues> };

export type NDGSuiteItem<
  TDefinition extends { nodes: readonly Node[]; evaluate: unknown } = {
    nodes: readonly Node[];
    evaluate: unknown;
  },
> = { id: number | string; ndg: TDefinition };

export type NDGSuite<
  TItems extends readonly NDGSuiteItem[] = readonly NDGSuiteItem[],
> = readonly [...TItems];

type EvaluateRequired<
  TNodes extends readonly Node[],
  TValues extends NDGContext["values"],
> = {
  [K in RequiredComputedKey<TNodes>]: (
    deps: EvaluatorArgs<TNodes, TValues>,
  ) => InferComputed<TNodes>[K];
};

type EvaluateOptional<
  TNodes extends readonly Node[],
  TValues extends NDGContext["values"],
> = {
  [K in SelectorDerivedKey<TNodes>]?: (
    deps: EvaluatorArgs<TNodes, TValues>,
  ) => InferComputed<TNodes>[K];
};

type Evaluate<
  TNodes extends readonly Node[],
  TValues extends NDGContext["values"],
> = EvaluateRequired<TNodes, TValues> & EvaluateOptional<TNodes, TValues>;

export const defineNodes = <const TNodes extends readonly Node[]>(
  nodes: readonly [...TNodes],
): readonly [...TNodes] => {
  NDGSchema.parse(nodes);
  return nodes;
};

export const defineEvaluators = <
  const TNodes extends readonly Node[],
  TValues extends NDGContext["values"] = NDGContext["values"],
>(
  nodes: TNodes,
  evaluators: Evaluate<TNodes, TValues>,
): Evaluate<TNodes, TValues> => {
  void nodes;
  return evaluators;
};

export const defineNDG = <
  const TNodes extends readonly Node[],
  TValues extends NDGContext["values"] = NDGContext["values"],
>(
  definition: NDGDefinition<TNodes, TValues>,
): NDGDefinition<TNodes, TValues> => definition;

export const defineNDGSuite = <const TItems extends readonly NDGSuiteItem[]>(
  items: readonly [...TItems],
): NDGSuite<TItems> => items;

export type NDGContext = { values: Record<string, NDGValue> };
