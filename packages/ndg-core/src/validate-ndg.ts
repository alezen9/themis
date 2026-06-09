import type { EvalCtx, NDGDefinition, NDGInputValue } from "./types";
import {
  isComputedNode,
  isSelectNode,
  type CheckNode,
  type Condition,
  type Node,
} from "./schema";

type Evaluator = (
  deps: Record<string, number | string | boolean>,
  ctx: EvalCtx,
) => number | string | boolean;

export type ValidatedNDG = {
  check: CheckNode;
  evaluators: Record<string, Evaluator>;
  nodeById: Map<string, Node>;
  nodeByKey: Map<string, Node>;
};

export const validateNDG = <
  TNodes extends readonly Node[],
  TValues extends Record<string, NDGInputValue> = Record<string, NDGInputValue>,
>(
  definition: NDGDefinition<TNodes, TValues>,
): ValidatedNDG => {
  const nodes = definition.nodes as readonly Node[];
  const evaluators = definition.evaluate as unknown as Record<
    string,
    Evaluator
  >;
  const nodeById = new Map<string, Node>();
  const nodeByKey = new Map<string, Node>();
  const checkNodes: CheckNode[] = [];

  for (const node of nodes) {
    const existingId = nodeById.get(node.id);
    if (existingId) {
      throw new Error(
        `Duplicate node ID: "${node.id}" (keys: "${existingId.key}", "${node.key}")`,
      );
    }

    const existingKey = nodeByKey.get(node.key);
    if (existingKey) {
      throw new Error(
        `Duplicate node key: "${node.key}" (ids: "${existingKey.id}", "${node.id}")`,
      );
    }

    nodeById.set(node.id, node);
    nodeByKey.set(node.key, node);
    if (node.type === "check") checkNodes.push(node);
  }

  for (const node of nodes) {
    const unknownChild = node.children.find(
      child => !nodeById.has(child.nodeId),
    );
    if (unknownChild) {
      throw new Error(
        `Node "${node.id}" (key: "${node.key}") references unknown child "${unknownChild.nodeId}"`,
      );
    }

    const hasEvaluator = !!evaluators[node.key];
    const needsEvaluator = isComputedNode(node) && !isSelectNode(node);
    if (needsEvaluator && !hasEvaluator) {
      throw new Error(
        `Missing evaluator for ${node.type} node: "${node.key}" (id: ${node.id})`,
      );
    }
    if (isSelectNode(node) && hasEvaluator) {
      throw new Error(
        `Select node "${node.key}" (id: ${node.id}) must not have an evaluator`,
      );
    }

    if (isComputedNode(node) && node.variant === "compute") {
      for (const key of templateKeys(node.template)) {
        if (!nodeByKey.has(key)) {
          throw new Error(
            `Template in node "${node.key}" (id: ${node.id}) references unknown key "${key}"`,
          );
        }
      }
    }

    for (const child of node.children) {
      if (child.when && isUnsatisfiable(child.when)) {
        throw new Error(
          `Node "${node.key}" (id: ${node.id}) has an unsatisfiable condition on child "${child.nodeId}"`,
        );
      }
    }
  }

  const unknownEvaluatorKey = Object.keys(evaluators).find(
    key => !nodeByKey.has(key),
  );
  if (unknownEvaluatorKey) {
    throw new Error(
      `Evaluator key "${unknownEvaluatorKey}" does not match any node -- possible typo`,
    );
  }

  const [check] = checkNodes;
  if (checkNodes.length !== 1 || !check) {
    throw new Error(
      `NDG must contain exactly one check node, got ${checkNodes.length}`,
    );
  }

  validateNoCycles(check.id, nodeById);

  return { check, evaluators, nodeById, nodeByKey };
};

const TEMPLATE_KEY = /\\key\{([^}]+)\}/g;

const templateKeys = (template: string): string[] =>
  [...template.matchAll(TEMPLATE_KEY)]
    .map(match => match[1])
    .filter((key): key is string => !!key);

const comparisonEq = (condition: Condition) => {
  if (!("eq" in condition)) return undefined;
  const [key, operand] = condition.eq;
  if (!("value" in operand)) return undefined;
  return { key, value: String(operand.value) };
};

/** Sound (no false positives) check: flags an `and` that requires one key to equal
 *  two different values, or an `or` whose every branch is unsatisfiable. */
const isUnsatisfiable = (condition: Condition): boolean => {
  if ("and" in condition) {
    if (condition.and.some(isUnsatisfiable)) return true;
    const eqByKey = new Map<string, Set<string>>();
    for (const child of condition.and) {
      const eq = comparisonEq(child);
      if (!eq) continue;
      const values = eqByKey.get(eq.key) ?? new Set<string>();
      values.add(eq.value);
      eqByKey.set(eq.key, values);
    }
    return [...eqByKey.values()].some(values => values.size > 1);
  }
  if ("or" in condition) {
    return condition.or.length > 0 && condition.or.every(isUnsatisfiable);
  }
  return false;
};

const validateNoCycles = (
  rootNodeId: CheckNode["id"],
  nodeById: Map<string, Node>,
) => {
  const visited = new Set<string>();
  const visiting = new Set<string>();
  visitForCycleValidation(rootNodeId, nodeById, visited, visiting);
};

const visitForCycleValidation = (
  nodeId: string,
  nodeById: Map<string, Node>,
  visited: Set<string>,
  visiting: Set<string>,
) => {
  if (visited.has(nodeId)) return;
  if (visiting.has(nodeId)) {
    throw new Error(`Circular dependency detected at node: ${nodeId}`);
  }

  const node = nodeById.get(nodeId);
  if (!node) throw new Error(`Node not found: ${nodeId}`);

  visiting.add(nodeId);
  for (const child of node.children) {
    visitForCycleValidation(child.nodeId, nodeById, visited, visiting);
  }
  visiting.delete(nodeId);
  visited.add(nodeId);
};
