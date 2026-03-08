import type { VerificationDefinition } from "./engine";
import {
  isAutoSelectorNode,
  isComputedNode,
  type CheckNode,
  type Node,
} from "./schema";

type Evaluator = (deps: Record<string, number | string>) => number | string;

export type ValidatedVerification = {
  check: CheckNode;
  evaluators: Record<string, Evaluator>;
  nodeById: Map<string, Node>;
  nodeByKey: Map<string, Node>;
};

export const validateVerification = <TNodes extends readonly Node[]>(
  definition: VerificationDefinition<TNodes>,
): ValidatedVerification => {
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
      (child) => !nodeById.has(child.nodeId),
    );
    if (unknownChild) {
      throw new Error(
        `Node "${node.id}" (key: "${node.key}") references unknown child "${unknownChild.nodeId}"`,
      );
    }

    const hasEvaluator = !!evaluators[node.key];
    const needsEvaluator = isComputedNode(node) && !isAutoSelectorNode(node);
    if (needsEvaluator && !hasEvaluator) {
      throw new Error(
        `Missing evaluator for ${node.type} node: "${node.key}" (id: ${node.id})`,
      );
    }
  }

  const unknownEvaluatorKey = Object.keys(evaluators).find(
    (key) => !nodeByKey.has(key),
  );
  if (unknownEvaluatorKey) {
    throw new Error(
      `Evaluator key "${unknownEvaluatorKey}" does not match any node -- possible typo`,
    );
  }

  if (checkNodes.length !== 1) {
    throw new Error(
      `Verification must contain exactly one check node, got ${checkNodes.length}`,
    );
  }

  validateNoCycles(checkNodes[0].id, nodeById);

  return { check: checkNodes[0], evaluators, nodeById, nodeByKey };
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
