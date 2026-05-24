import { NDGSchema, type Node } from "./schema";
import type {
  Evaluate,
  NDGContext,
  NDGDefinition,
  NDGSuite,
  NDGSuiteItem,
} from "./types";

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
) => {
  void nodes;
  return evaluators;
};

export const defineNDG = <
  const TNodes extends readonly Node[],
  TValues extends NDGContext["values"] = NDGContext["values"],
>(
  definition: NDGDefinition<TNodes, TValues>,
) => definition;

export const defineNDGSuite = <const TItems extends readonly NDGSuiteItem[]>(
  items: readonly [...TItems],
): NDGSuite<TItems> => items;
