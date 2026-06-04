import {
  defineEvaluators as coreDefineEvaluators,
  defineNDG as coreDefineNDG,
} from "@ndg/ndg-core";
import type { Evaluate, NDGDefinition, Node } from "@ndg/ndg-core";
import type { Ec311Inputs } from "./ec311-inputs";

export const defineEvaluators = <const TNodes extends readonly Node[]>(
  nodes: TNodes,
  evaluators: Evaluate<TNodes, Ec311Inputs>,
) => coreDefineEvaluators<TNodes, Ec311Inputs>(nodes, evaluators);

export const defineNDG = <const TNodes extends readonly Node[]>(
  definition: NDGDefinition<TNodes, Ec311Inputs>,
) => coreDefineNDG<TNodes, Ec311Inputs>(definition);
