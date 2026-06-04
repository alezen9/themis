import type { CheckNode, Node } from "../schema";
import type {
  InferCache,
  NDGContext,
  NDGDefinition,
  NDGRunResult,
  NDGSuite,
  NDGSuiteRunResult,
} from "../types";
import { validateNDG } from "../validate-ndg";
import { INTERNAL_CONSTANTS } from "./constants";
import { evaluateNode, type EvaluationState } from "./evaluate";

export const runNDG = <
  TNodes extends readonly Node[],
  TValues extends NDGContext["values"] = NDGContext["values"],
>(
  definition: NDGDefinition<TNodes, TValues>,
  context: NDGContext,
): NDGRunResult<TNodes> => {
  const validated = validateNDG(definition);
  const state: EvaluationState = {
    ...validated,
    runtime: { ...context, constants: INTERNAL_CONSTANTS },
    lookup: { ...INTERNAL_CONSTANTS },
    cache: {},
    trace: [],
    visited: new Set(),
    activeNode: undefined,
  };
  const { check, cache, trace } = state;

  try {
    evaluateNode(check.id, state);

    const utilisation = cache[check.key];
    if (typeof utilisation !== "number") {
      throw new Error(
        `Check node "${check.key}" must evaluate to a number, got ${typeof utilisation}`,
      );
    }
    if (!isFinite(utilisation)) {
      throw new Error(
        `Check node "${check.key}" produced ${utilisation} -- likely division by zero or invalid computation`,
      );
    }

    return {
      check: {
        id: check.id,
        key: check.key,
        name: check.name,
        verificationExpression: check.verificationExpression,
        meta: check.meta,
      },
      passed: utilisation <= 1.0,
      utilisation,
      cache: cache as InferCache<TNodes>,
      trace,
    };
  } catch (error) {
    throw wrapRunError(error, check, state.activeNode);
  }
};

export const runNDGSuite = (
  suite: NDGSuite,
  context: NDGContext,
): NDGSuiteRunResult =>
  suite.map(({ id, ndg }) => {
    const check = getCheckNode(ndg.nodes);
    const definition = ndg as NDGDefinition<readonly Node[]>;

    try {
      return {
        id,
        name: check.name ?? check.key,
        payload: { data: runNDG(definition, context) },
      };
    } catch (error) {
      return {
        id,
        name: check.name ?? check.key,
        payload: {
          error: error instanceof Error ? error : new Error(String(error)),
        },
      };
    }
  });

const getCheckNode = (nodes: readonly Node[]) => {
  const check = nodes.find((node): node is CheckNode => node.type === "check");
  if (!check) throw new Error("NDG must contain a check node");
  return check;
};

const wrapRunError = (
  error: unknown,
  check: CheckNode,
  activeNode: Node | undefined,
) => {
  if (error instanceof Error && error.name === "Ec3VerificationError") {
    return error;
  }

  const nodeContext = activeNode
    ? ` at node "${activeNode.key}" (id: "${activeNode.id}")`
    : "";
  const cause = error instanceof Error ? error.message : String(error);

  return new Error(
    `Unhandled NDG run failure [${check.key}]${nodeContext}: ${cause}`,
  );
};
