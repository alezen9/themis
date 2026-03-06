import type { Node } from "./schemas";
import type { Condition } from "./schemas";
import type {
  InferCache,
  VerificationDefinition,
  EvaluationContext,
} from "./engine";
import { evaluateCondition } from "./evaluate-condition";

export type TraceEntry = {
  nodeId: string;
  type: Node["type"];
  key: string;
  value: number | string;
  unit?: string;
  symbol?: string;
  expression?: string;
  /** LaTeX expression for check nodes (the verification rule). */
  verificationExpression?: string;
  description?: string;
  meta?: Node extends { meta?: infer M } ? M : never;
  /** Cache values that were passed to the evaluator for this node. */
  evaluatorInputs?: Record<string, number | string>;
  children: string[];
};

export type EvaluationResult<
  TNodes extends readonly Node[] = readonly Node[],
> = {
  passed: boolean;
  ratio: number;
  cache: InferCache<TNodes>;
  trace: TraceEntry[];
};

export const evaluate = <TNodes extends readonly Node[]>(
  def: VerificationDefinition<TNodes>,
  context: EvaluationContext,
): EvaluationResult<TNodes> => {
  const nodes = def.nodes as readonly Node[];
  const evaluators = def.evaluate as unknown as Record<
    string,
    (deps: Record<string, number | string>) => number | string
  >;

  // Build node lookup -- detect duplicate IDs
  const nodeById = new Map<string, Node>();
  const nodeByKey = new Map<string, Node>();
  for (const node of nodes) {
    if (nodeById.has(node.id)) {
      throw new Error(
        `Duplicate node ID: "${node.id}" (keys: "${nodeById.get(node.id)!.key}", "${node.key}")`,
      );
    }
    nodeById.set(node.id, node);
    if (nodeByKey.has(node.key)) {
      throw new Error(
        `Duplicate node key: "${node.key}" (ids: "${nodeByKey.get(node.key)!.id}", "${node.id}")`,
      );
    }
    nodeByKey.set(node.key, node);
  }
  for (const node of nodes) {
    for (const child of node.children) {
      if (!nodeById.has(child.nodeId)) {
        throw new Error(
          `Node "${node.id}" (key: "${node.key}") references unknown child "${child.nodeId}"`,
        );
      }
    }
  }

  // Validate evaluator coverage: every computed node needs one, every evaluator key must match a node
  const computedTypes = new Set(["formula", "derived", "table", "check"]);
  const nodeKeys = new Set(nodes.map((n) => n.key));
  for (const node of nodes) {
    if (
      computedTypes.has(node.type) &&
      !evaluators[node.key] &&
      !isAutoSelectorNode(node)
    ) {
      throw new Error(
        `Missing evaluator for ${node.type} node: "${node.key}" (id: ${node.id})`,
      );
    }
  }
  for (const key of Object.keys(evaluators)) {
    if (!nodeKeys.has(key)) {
      throw new Error(
        `Evaluator key "${key}" does not match any node -- possible typo`,
      );
    }
  }

  const checkNodes = nodes.filter((node) => node.type === "check");
  if (checkNodes.length === 0) {
    throw new Error("No check node found in verification");
  }

  // Evaluate only the active graph reachable from check roots
  const cache: Record<string, number | string> = {};
  const trace: TraceEntry[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>();
  let activeNode: Node | undefined;

  const evaluateNode = (nodeId: string): void => {
    if (visited.has(nodeId)) return;
    if (visiting.has(nodeId)) {
      throw new Error(`Circular dependency detected at node: ${nodeId}`);
    }
    visiting.add(nodeId);

    const node = nodeById.get(nodeId);
    if (!node) throw new Error(`Node not found: ${nodeId}`);
    activeNode = node;

    const activeChildren: string[] = [];
    for (const child of node.children) {
      if (child.when) {
        for (const conditionKey of getConditionKeys(child.when)) {
          if (cache[conditionKey] !== undefined) continue;
          if (
            Object.prototype.hasOwnProperty.call(context.inputs, conditionKey)
          ) {
            continue;
          }
          const conditionNode = nodeByKey.get(conditionKey);
          if (!conditionNode) {
            throw new Error(
              `Condition references unknown key: "${conditionKey}"`,
            );
          }
          evaluateNode(conditionNode.id);
        }
      }

      if (
        child.when &&
        !evaluateCondition(child.when, { ...context.inputs, ...cache })
      ) {
        continue;
      }
      evaluateNode(child.nodeId);
      activeChildren.push(child.nodeId);
    }

    const isComputed =
      node.type === "formula" ||
      node.type === "derived" ||
      node.type === "table" ||
      node.type === "check";
    let evaluatorInputs: Record<string, number | string> | undefined;
    if (isComputed) {
      evaluatorInputs = {};
      for (const childId of activeChildren) {
        const childNode = nodeById.get(childId);
        if (childNode) evaluatorInputs[childNode.key] = cache[childNode.key];
      }
    }

    const value = resolveNode(
      node,
      cache,
      evaluators,
      context,
      activeChildren,
      nodeById,
    );
    cache[node.key] = value;

    trace.push({
      nodeId: node.id,
      type: node.type,
      key: node.key,
      value,
      unit: "unit" in node ? (node.unit as string | undefined) : undefined,
      symbol: node.symbol,
      expression:
        "expression" in node
          ? (node.expression as string | undefined)
          : undefined,
      verificationExpression:
        "verificationExpression" in node
          ? (node.verificationExpression as string | undefined)
          : undefined,
      description: node.description,
      meta: "meta" in node ? (node.meta as TraceEntry["meta"]) : undefined,
      evaluatorInputs,
      children: activeChildren,
    });

    visiting.delete(nodeId);
    visited.add(nodeId);
  };

  try {
    for (const checkNode of checkNodes) {
      evaluateNode(checkNode.id);
    }

    const checkNode = checkNodes[checkNodes.length - 1];

    const ratio = cache[checkNode.key];
    if (typeof ratio !== "number") {
      throw new Error(
        `Check node "${checkNode.key}" must evaluate to a number, got ${typeof ratio}`,
      );
    }
    if (!isFinite(ratio)) {
      throw new Error(
        `Check node "${checkNode.key}" produced ${ratio} -- likely division by zero or invalid computation`,
      );
    }

    return {
      passed: ratio <= 1.0,
      ratio,
      cache: cache as InferCache<TNodes>,
      trace,
    };
  } catch (error) {
    if (error instanceof Error && error.name === "Ec3VerificationError") {
      throw error;
    }

    const verificationKeys = checkNodes.map((node) => node.key).join(", ");
    const nodeContext = activeNode
      ? ` at node "${activeNode.key}" (id: "${activeNode.id}")`
      : "";
    const cause = error instanceof Error ? error.message : String(error);

    throw new Error(
      `Unhandled evaluation failure in verification [${verificationKeys}]${nodeContext}: ${cause}`,
    );
  }
};

const getConditionKeys = (condition: Condition): string[] => {
  if ("eq" in condition) return [condition.eq[0]];
  if ("lt" in condition) return [condition.lt[0]];
  if ("lte" in condition) return [condition.lte[0]];
  if ("gt" in condition) return [condition.gt[0]];
  if ("gte" in condition) return [condition.gte[0]];
  if ("and" in condition) {
    return condition.and.flatMap((c) => getConditionKeys(c));
  }
  if ("or" in condition) {
    return condition.or.flatMap((c) => getConditionKeys(c));
  }
  return [];
};

const resolveNode = (
  node: Node,
  cache: Record<string, number | string>,
  evaluators: Record<
    string,
    (deps: Record<string, number | string>) => number | string
  >,
  context: EvaluationContext,
  activeChildren: string[],
  nodeById: Map<string, Node>,
): number | string => {
  switch (node.type) {
    case "user-input": {
      const val = context.inputs[node.key];
      if (val === undefined) {
        throw new Error(`Missing input: "${node.key}"`);
      }
      return val;
    }
    case "constant": {
      if (node.key === "pi") return Math.PI;
      if (node.key === "e") return Math.E;
      throw new Error(`Unsupported constant: "${node.key}"`);
    }
    case "coefficient": {
      const val = context.annex.coefficients[node.key];
      if (val === undefined) {
        throw new Error(
          `Missing coefficient "${node.key}" in annex "${context.annex.id}"`,
        );
      }
      return val;
    }
    case "formula":
    case "derived":
    case "table":
    case "check": {
      const evaluator = evaluators[node.key];
      if (!evaluator) {
        if (!isAutoSelectorNode(node)) {
          throw new Error(
            `Missing evaluator for ${node.type} node: "${node.key}" (id: ${node.id})`,
          );
        }
        if (activeChildren.length !== 1) {
          throw new Error(
            `Auto-selector node "${node.key}" (id: ${node.id}) must have exactly one active child, got ${activeChildren.length}`,
          );
        }
        const selectedChildId = activeChildren[0];
        const selectedChildNode = nodeById.get(selectedChildId);
        if (!selectedChildNode) {
          throw new Error(
            `Auto-selector node "${node.key}" (id: ${node.id}) references unknown child "${selectedChildId}"`,
          );
        }
        const selectedValue = cache[selectedChildNode.key];
        if (selectedValue === undefined) {
          throw new Error(
            `Auto-selector node "${node.key}" (id: ${node.id}) selected child "${selectedChildNode.key}" with undefined value`,
          );
        }
        if (typeof selectedValue === "number" && !isFinite(selectedValue)) {
          throw new Error(
            `Node "${node.key}" (${node.type}) produced ${selectedValue} -- check inputs for division by zero or invalid values`,
          );
        }
        return selectedValue;
      }
      const result = evaluator({ ...context.inputs, ...cache });
      if (typeof result === "number" && !isFinite(result)) {
        throw new Error(
          `Node "${node.key}" (${node.type}) produced ${result} -- check inputs for division by zero or invalid values`,
        );
      }
      return result;
    }
    default: {
      throw new Error(`Unhandled node type: ${(node as Node).type}`);
    }
  }
};

const isAutoSelectorNode = (node: Node): boolean => {
  if (node.type !== "derived") return false;
  return node.expression === undefined && node.children.length > 0;
};
