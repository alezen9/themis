import {
  evaluateCondition,
  type Condition,
  type ConditionOperand,
  type Ec3VerificationCatalogEntry,
  type Node,
  type TraceEntry,
} from "@ndg/ndg-ec3";
import {
  hasData,
  hasError,
  isNotApplicable,
  type VerificationRow,
} from "../ec3/use-ec3-evaluate";

const INTERNAL_CONSTANTS = { e: Math.E, pi: Math.PI } satisfies Record<
  string,
  number
>;

export type VerificationCheckStatus =
  | "passed"
  | "failed"
  | "not-applicable"
  | "error";

export type BranchStatus = "taken" | "skipped" | "unevaluated" | "not-reached";

export type NodeExecutionStatus = "executed" | "skipped" | "not-reached";

export type VerificationDebuggerContextGroup = {
  id: string;
  title: string;
  description?: string;
  values: Record<string, unknown>;
};

export type VerificationDebuggerTreeEdge = {
  childNodeId: string;
  status: BranchStatus;
  condition?: Condition;
  conditionLabel?: string;
  child: VerificationDebuggerTreeNode;
};

export type VerificationDebuggerTreeNode = {
  id: string;
  key: string;
  name: string;
  type: Node["type"];
  symbol?: string;
  description?: string;
  unit?: string;
  expression?: string;
  verificationExpression?: string;
  source?: string;
  meta?: Record<string, string | undefined>;
  rawValue?: string | number;
  status: NodeExecutionStatus;
  isActivePath: boolean;
  children: VerificationDebuggerTreeEdge[];
};

export type VerificationDebuggerTraceItem = {
  index: number;
  entry: TraceEntry;
};

export type VerificationDebuggerCacheEntry = {
  key: string;
  value: unknown;
  isTraced: boolean;
};

export type VerificationDebuggerCheckDetail = {
  checkId: number;
  name: string;
  status: VerificationCheckStatus;
  ratio?: number;
  applicable: boolean;
  definition: Ec3VerificationCatalogEntry;
  root: VerificationDebuggerTreeNode | null;
  trace: VerificationDebuggerTraceItem[];
  cacheEntries: VerificationDebuggerCacheEntry[];
  resultPayload: VerificationRow["payload"] | null;
  errorMessage?: string;
  executionAvailable: boolean;
};

export type VerificationDebuggerCheck = {
  checkId: number;
  name: string;
  status: VerificationCheckStatus;
  applicable: boolean;
  ratio?: number;
  ratioLabel: string;
  detail: VerificationDebuggerCheckDetail;
};

export const formatCondition = (condition: Condition): string => {
  if ("eq" in condition) {
    return `${condition.eq[0]} = ${formatConditionOperand(condition.eq[1])}`;
  }
  if ("lt" in condition) {
    return `${condition.lt[0]} < ${formatConditionOperand(condition.lt[1])}`;
  }
  if ("lte" in condition) {
    return `${condition.lte[0]} <= ${formatConditionOperand(condition.lte[1])}`;
  }
  if ("gt" in condition) {
    return `${condition.gt[0]} > ${formatConditionOperand(condition.gt[1])}`;
  }
  if ("gte" in condition) {
    return `${condition.gte[0]} >= ${formatConditionOperand(condition.gte[1])}`;
  }
  if ("and" in condition) {
    return condition.and
      .map((item) => `(${formatCondition(item)})`)
      .join(" AND ");
  }
  return condition.or.map((item) => `(${formatCondition(item)})`).join(" OR ");
};

const formatConditionOperand = (operand: ConditionOperand): string =>
  "key" in operand ? operand.key : JSON.stringify(operand.value);

export const getActivePathNodeIds = (trace: readonly TraceEntry[]) =>
  new Set(trace.map((entry) => entry.nodeId));

export const deriveBranchStatus = ({
  activeChildIds,
  childNodeId,
  condition,
  conditionContext,
  parentExecuted,
}: {
  activeChildIds: ReadonlySet<string>;
  childNodeId: string;
  condition?: Condition;
  conditionContext?: Record<string, string | number>;
  parentExecuted: boolean;
}): BranchStatus => {
  if (!parentExecuted) return "not-reached";
  if (activeChildIds.has(childNodeId)) return "taken";
  if (!condition) return "not-reached";

  try {
    const didMatch = evaluateCondition(condition, {
      ...INTERNAL_CONSTANTS,
      ...conditionContext,
    });
    return didMatch ? "not-reached" : "skipped";
  } catch {
    return "unevaluated";
  }
};

export const getDefaultSelectedCheckId = (
  checks: readonly Pick<
    VerificationDebuggerCheck,
    "checkId" | "status" | "applicable"
  >[],
): number | null => {
  const attentionCheck = checks.find(
    (check) =>
      check.applicable &&
      (check.status === "failed" || check.status === "error"),
  );
  if (attentionCheck) return attentionCheck.checkId;

  const firstApplicable = checks.find((check) => check.applicable);
  if (firstApplicable) return firstApplicable.checkId;

  return checks[0]?.checkId ?? null;
};

export const getVerificationCheckStatus = (
  row: VerificationRow | undefined,
): VerificationCheckStatus => {
  if (!row) return "error";
  if (isNotApplicable(row)) return "not-applicable";
  if (hasData(row)) return row.payload.data.passed ? "passed" : "failed";
  return "error";
};

const formatRatio = (ratio: number | undefined) =>
  ratio === undefined ? "—" : ratio.toFixed(3);

const edgeStatusToNodeStatus = (
  edgeStatus: BranchStatus,
): NodeExecutionStatus => {
  switch (edgeStatus) {
    case "taken":
      return "executed";
    case "skipped":
      return "skipped";
    default:
      return "not-reached";
  }
};

const getNodeMeta = (node: Node) => ("meta" in node ? node.meta : undefined);

const buildTreeNode = ({
  conditionContext,
  definition,
  incomingStatus,
  nodeId,
  nodeById,
  traceByNodeId,
  activePathNodeIds,
  visited,
}: {
  conditionContext: Record<string, string | number>;
  definition: Ec3VerificationCatalogEntry;
  incomingStatus: NodeExecutionStatus;
  nodeId: string;
  nodeById: Map<string, Node>;
  traceByNodeId: Map<string, TraceEntry>;
  activePathNodeIds: ReadonlySet<string>;
  visited: Set<string>;
}): VerificationDebuggerTreeNode | null => {
  if (visited.has(nodeId)) return null;

  const node = nodeById.get(nodeId);
  if (!node) return null;

  const nextVisited = new Set(visited);
  nextVisited.add(nodeId);

  const traceEntry = traceByNodeId.get(nodeId);
  const executed = traceEntry !== undefined;
  const activeChildren = new Set(traceEntry?.children ?? []);
  const status = executed ? "executed" : incomingStatus;

  return {
    id: node.id,
    key: node.key,
    name: node.name,
    type: node.type,
    symbol: node.symbol,
    description: node.description,
    unit: "unit" in node ? node.unit : undefined,
    expression: "expression" in node ? node.expression : undefined,
    verificationExpression:
      node.type === "check" ? node.verificationExpression : undefined,
    source: "source" in node ? node.source : undefined,
    meta: getNodeMeta(node),
    rawValue: traceEntry?.value,
    status,
    isActivePath: activePathNodeIds.has(node.id),
    children: node.children.flatMap((child) => {
      const edgeStatus = deriveBranchStatus({
        activeChildIds: activeChildren,
        childNodeId: child.nodeId,
        condition: child.when,
        conditionContext,
        parentExecuted: executed,
      });
      const childNode = buildTreeNode({
        conditionContext,
        definition,
        incomingStatus: executed
          ? edgeStatusToNodeStatus(edgeStatus)
          : "not-reached",
        nodeId: child.nodeId,
        nodeById,
        traceByNodeId,
        activePathNodeIds,
        visited: nextVisited,
      });

      if (!childNode) return [];

      return [
        {
          childNodeId: child.nodeId,
          status: edgeStatus,
          condition: child.when,
          conditionLabel: child.when ? formatCondition(child.when) : undefined,
          child: childNode,
        },
      ];
    }),
  };
};

const buildCacheEntries = (
  trace: readonly TraceEntry[],
  cache: Record<string, unknown>,
) => {
  const orderedKeys = new Set<string>();

  for (const entry of trace) {
    orderedKeys.add(entry.key);
  }

  const remainingKeys = Object.keys(cache)
    .filter((key) => !orderedKeys.has(key))
    .sort((left, right) => left.localeCompare(right));

  return [...Array.from(orderedKeys), ...remainingKeys].map((key) => ({
    key,
    value: cache[key],
    isTraced: orderedKeys.has(key),
  }));
};

export const buildVerificationDebuggerCheck = ({
  conditionContext,
  definition,
  row,
}: {
  conditionContext?: Record<string, string | number>;
  definition: Ec3VerificationCatalogEntry;
  row: VerificationRow | undefined;
}): VerificationDebuggerCheck => {
  const status = getVerificationCheckStatus(row);
  const applicable = status !== "not-applicable";
  const resultData = row && hasData(row) ? row.payload.data : undefined;
  const trace = resultData?.trace ?? [];
  const cache = (resultData?.cache ?? {}) as Record<string, unknown>;
  const activePathNodeIds = getActivePathNodeIds(trace);
  const traceByNodeId = new Map(trace.map((entry) => [entry.nodeId, entry]));
  const nodeById = new Map(definition.nodes.map((node) => [node.id, node]));
  const root = buildTreeNode({
    conditionContext: { ...conditionContext, ...cache } as Record<
      string,
      string | number
    >,
    definition,
    incomingStatus: "not-reached",
    nodeId: definition.check.id,
    nodeById,
    traceByNodeId,
    activePathNodeIds,
    visited: new Set<string>(),
  });

  const detail: VerificationDebuggerCheckDetail = {
    checkId: definition.checkId,
    name: definition.name,
    status,
    ratio: resultData?.ratio,
    applicable,
    definition,
    root,
    trace: trace.map((entry, index) => ({ entry, index })),
    cacheEntries: buildCacheEntries(trace, cache),
    resultPayload: row?.payload ?? null,
    errorMessage: row && hasError(row) ? row.payload.error.message : undefined,
    executionAvailable: resultData !== undefined,
  };

  return {
    checkId: definition.checkId,
    name: definition.name,
    status,
    applicable,
    ratio: resultData?.ratio,
    ratioLabel: formatRatio(resultData?.ratio),
    detail,
  };
};
