import type { Node, Child } from "./schemas";
import type {
  InferableNode,
  VerificationDefinition,
  EvaluationContext,
} from "./engine";
import { CONSTANTS } from "./engine";
import { evaluateCondition } from "./evaluate-condition";

// ########################################
//              RESULT TYPES
// ########################################

export interface TraceEntry {
  nodeId: string;
  type: Node["type"];
  key: string;
  value: number | string;
  unit?: string;
  symbol?: string;
  meta?: Node extends { meta?: infer M } ? M : never;
  children: string[];
}

export interface EvaluationResult {
  passed: boolean;
  ratio: number;
  cache: Record<string, number | string>;
  trace: TraceEntry[];
}

// ########################################
//              EVALUATE
// ########################################

/**
 * Evaluate a verification definition against a context.
 * Topologically sorts nodes, resolves values, and produces a traced result.
 */
export function evaluate<TNodes extends readonly InferableNode[]>(
  def: VerificationDefinition<TNodes>,
  context: EvaluationContext,
): EvaluationResult {
  const nodes = def.nodes as unknown as readonly Node[];
  const evaluators = def.evaluate as unknown as Record<
    string,
    (cache: Record<string, number | string>) => number | string
  >;

  // Build node lookup
  const nodeById = new Map<string, Node>();
  for (const node of nodes) {
    nodeById.set(node.id, node);
  }

  // Topological sort (DFS post-order)
  const sorted: Node[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>();

  function visit(nodeId: string): void {
    if (visited.has(nodeId)) return;
    if (visiting.has(nodeId)) {
      throw new Error(`Circular dependency detected at node: ${nodeId}`);
    }
    visiting.add(nodeId);

    const node = nodeById.get(nodeId);
    if (!node) throw new Error(`Node not found: ${nodeId}`);

    for (const child of node.children) {
      visit(child.nodeId);
    }

    visiting.delete(nodeId);
    visited.add(nodeId);
    sorted.push(node);
  }

  // Find root (check node) — visit from all nodes to handle disconnected graphs
  for (const node of nodes) {
    visit(node.id);
  }

  // Evaluate in topological order
  const cache: Record<string, number | string> = {};
  const trace: TraceEntry[] = [];

  for (const node of sorted) {
    // Resolve active children (respecting `when` conditions)
    const activeChildren = resolveChildren(node.children, cache);

    // Resolve value based on node type
    const value = resolveNode(node, cache, evaluators, context);
    cache[node.key] = value;

    trace.push({
      nodeId: node.id,
      type: node.type,
      key: node.key,
      value,
      unit: "unit" in node ? (node.unit as string | undefined) : undefined,
      symbol: node.symbol,
      meta: "meta" in node ? (node.meta as TraceEntry["meta"]) : undefined,
      children: activeChildren,
    });
  }

  // Find the check node (root) — last check node in the array
  const checkNode = [...nodes].reverse().find((n) => n.type === "check");
  if (!checkNode) {
    throw new Error("No check node found in verification");
  }

  const ratio = cache[checkNode.key] as number;

  return {
    passed: ratio <= 1.0,
    ratio,
    cache,
    trace,
  };
}

function resolveChildren(
  children: readonly Child[],
  cache: Record<string, number | string>,
): string[] {
  return children
    .filter((child) => {
      if (!child.when) return true;
      return evaluateCondition(child.when, cache);
    })
    .map((child) => child.nodeId);
}

function resolveNode(
  node: Node,
  cache: Record<string, number | string>,
  evaluators: Record<
    string,
    (cache: Record<string, number | string>) => number | string
  >,
  context: EvaluationContext,
): number | string {
  switch (node.type) {
    case "user-input": {
      const val = context.inputs[node.key];
      if (val === undefined) {
        throw new Error(`Missing input: "${node.key}"`);
      }
      return val;
    }
    case "constant": {
      const val = CONSTANTS[node.key];
      if (val === undefined) {
        throw new Error(`Missing constant: "${node.key}"`);
      }
      return val;
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
        throw new Error(
          `Missing evaluator for ${node.type} node: "${node.key}" (id: ${node.id})`,
        );
      }
      return evaluator(cache);
    }
  }
}
