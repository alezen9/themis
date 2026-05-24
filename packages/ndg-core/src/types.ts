import type { CheckNode, Node, NodeMeta } from "./schema";

export type Prettify<T> = { [K in keyof T]: T[K] } & {};

type ComputedNodeType = "formula" | "check";

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

export type InferCache<TNodes extends readonly Node[]> = Prettify<{
  [N in TNodes[number] as N["key"]]: NodeValue<N>;
}>;

type InferComputed<TNodes extends readonly Node[]> = {
  [N in TNodes[number] as N["type"] extends ComputedNodeType
    ? N["key"]
    : never]: NodeValue<N>;
};

type SelectorNode<TNodes extends readonly Node[]> = Extract<
  TNodes[number],
  {
    type: "formula";
    expression?: undefined;
    children: readonly [unknown, ...unknown[]];
  }
>;

type SelectorKey<TNodes extends readonly Node[]> = Extract<
  SelectorNode<TNodes>["key"],
  keyof InferComputed<TNodes>
>;

type RequiredComputedKey<TNodes extends readonly Node[]> = Exclude<
  keyof InferComputed<TNodes>,
  SelectorKey<TNodes>
>;

export type NDGContext = { values: Record<string, NDGValue> };

export type EvaluatorArgs<
  TNodes extends readonly Node[],
  TValues extends NDGContext["values"] = NDGContext["values"],
> = Readonly<Prettify<InferCache<TNodes> & TValues>>;

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
  [K in SelectorKey<TNodes>]?: (
    deps: EvaluatorArgs<TNodes, TValues>,
  ) => InferComputed<TNodes>[K];
};

export type Evaluate<
  TNodes extends readonly Node[],
  TValues extends NDGContext["values"],
> = Prettify<
  EvaluateRequired<TNodes, TValues> & EvaluateOptional<TNodes, TValues>
>;

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

export type NDGTraceEntry = {
  nodeId: string;
  type: Node["type"];
  key: string;
  value: NDGValue;
  unit?: string;
  symbol?: string;
  expression?: string;
  verificationExpression?: string;
  description?: string;
  meta?: NodeMeta;
  evaluatorInputs?: Record<string, NDGValue>;
  children: string[];
};

export type NDGRunResult<TNodes extends readonly Node[] = readonly Node[]> = {
  check: {
    id: CheckNode["id"];
    key: CheckNode["key"];
    name: CheckNode["name"];
    verificationExpression: CheckNode["verificationExpression"];
    meta?: CheckNode["meta"];
  };
  passed: boolean;
  ratio: number;
  cache: InferCache<TNodes>;
  trace: NDGTraceEntry[];
};

export type NDGSuiteRunRow<TNodes extends readonly Node[] = readonly Node[]> = {
  id: number | string;
  name: string;
  payload:
    | { data: NDGRunResult<TNodes>; error?: undefined }
    | { data?: undefined; error: Error };
};

export type NDGSuiteRunResult = readonly NDGSuiteRunRow[];
