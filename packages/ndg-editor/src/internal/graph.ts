import {
  VerificationSchema,
  type Child,
  type Condition,
  type Node,
} from "@ndg/ndg-core";
import type { XYPosition } from "@xyflow/react";
import {
  buildNodeFromDraft,
  canNodeHaveChildren,
  createDefaultChildNode,
  createDefaultRootNode,
  type EditorNode,
  type NodeDraft,
} from "./node-factory";

export type EditorState = {
  nodesById: Map<string, EditorNode>;
  layoutById: Record<string, XYPosition>;
  measuredById: Record<string, { width: number; height: number }>;
  editingNodeId: string | null;
  dialogError: string | null;
  autoLayoutError: string | null;
  autoLayoutVersion: number;
};

export const ndgEditorDraftFormat = "ndg-editor-draft" as const;
export const ndgEditorDraftVersion = 1 as const;

export type NdgEditorDraftV1 = {
  format: typeof ndgEditorDraftFormat;
  version: typeof ndgEditorDraftVersion;
  nodesById: Record<string, Node>;
  layoutById: Record<string, XYPosition>;
};

const horizontalGap = 320;
const verticalGap = 220;
const childStagger = 72;
const autoLayoutHorizontalGap = 80;
const autoLayoutVerticalGap = 132;
const autoLayoutComponentGap = 240;
const autoLayoutMargin = 48;

const getNodeById = (nodesById: Map<string, EditorNode>, nodeId: string) =>
  nodesById.get(nodeId) ?? null;

const replaceNodeChildren = (node: EditorNode, children: readonly Child[]) => ({
  ...node,
  children,
});

const hasChildReference = (node: EditorNode, childId: string) =>
  node.children.some((child) => child.nodeId === childId);

const isCheckNode = (node: EditorNode) => node.type === "check";

const getCheckNodeId = (nodesById: Map<string, EditorNode>) => {
  for (const node of nodesById.values()) {
    if (isCheckNode(node)) return node.id;
  }

  return null;
};

export const buildParentsByChildId = (nodesById: Map<string, EditorNode>) => {
  const parentsByChildId = new Map<string, Set<string>>();

  for (const node of nodesById.values()) {
    for (const child of node.children) {
      const parentIds = parentsByChildId.get(child.nodeId) ?? new Set<string>();
      parentIds.add(node.id);
      parentsByChildId.set(child.nodeId, parentIds);
    }
  }

  return parentsByChildId;
};

export const buildReachableNodeIds = (nodesById: Map<string, EditorNode>) => {
  const checkNodeId = getCheckNodeId(nodesById);
  if (!checkNodeId) return new Set<string>();

  const visited = new Set<string>();
  const stack = [checkNodeId];

  while (stack.length > 0) {
    const nodeId = stack.pop();
    if (!nodeId || visited.has(nodeId)) continue;

    visited.add(nodeId);
    const node = nodesById.get(nodeId);
    if (!node) continue;

    for (const child of node.children) {
      stack.push(child.nodeId);
    }
  }

  return visited;
};

export const getUnreachableNodeIds = (nodesById: Map<string, EditorNode>) => {
  const reachableNodeIds = buildReachableNodeIds(nodesById);
  const unreachableNodeIds = new Set<string>();

  for (const nodeId of nodesById.keys()) {
    if (reachableNodeIds.has(nodeId)) continue;
    unreachableNodeIds.add(nodeId);
  }

  return unreachableNodeIds;
};

const hasPath = (
  nodesById: Map<string, EditorNode>,
  startNodeId: string,
  targetNodeId: string,
) => {
  const visited = new Set<string>();
  const stack = [startNodeId];

  while (stack.length > 0) {
    const currentNodeId = stack.pop();
    if (!currentNodeId || visited.has(currentNodeId)) continue;

    if (currentNodeId === targetNodeId) return true;

    visited.add(currentNodeId);
    const currentNode = nodesById.get(currentNodeId);
    if (!currentNode) continue;

    for (const child of currentNode.children) {
      stack.push(child.nodeId);
    }
  }

  return false;
};

const buildWeakAdjacency = (nodesById: Map<string, EditorNode>) => {
  const adjacency = new Map<string, Set<string>>();

  for (const nodeId of nodesById.keys()) {
    adjacency.set(nodeId, new Set<string>());
  }

  for (const node of nodesById.values()) {
    for (const child of node.children) {
      if (!nodesById.has(child.nodeId)) continue;

      adjacency.get(node.id)?.add(child.nodeId);
      adjacency.get(child.nodeId)?.add(node.id);
    }
  }

  return adjacency;
};

const collectWeakComponents = (
  nodeIds: readonly string[],
  adjacency: Map<string, Set<string>>,
  preferredFirstId: string | null,
) => {
  const visited = new Set<string>();
  const orderedSeeds = [...nodeIds].sort((left, right) => left.localeCompare(right));

  if (preferredFirstId) {
    const preferredIndex = orderedSeeds.indexOf(preferredFirstId);
    if (preferredIndex >= 0) {
      orderedSeeds.splice(preferredIndex, 1);
      orderedSeeds.unshift(preferredFirstId);
    }
  }

  const components: string[][] = [];

  for (const seedNodeId of orderedSeeds) {
    if (visited.has(seedNodeId)) continue;

    const queue = [seedNodeId];
    const component: string[] = [];

    while (queue.length > 0) {
      const nodeId = queue.shift();
      if (!nodeId || visited.has(nodeId)) continue;

      visited.add(nodeId);
      component.push(nodeId);

      const neighbors = adjacency.get(nodeId);
      if (!neighbors) continue;

      for (const neighborId of neighbors) {
        if (visited.has(neighborId)) continue;
        queue.push(neighborId);
      }
    }

    components.push(component);
  }

  return components;
};

const getChildOffset = (childIndex: number) => {
  if (childIndex === 0) return 0;

  const direction = childIndex % 2 === 0 ? 1 : -1;
  const step = Math.ceil(childIndex / 2);
  return direction * step * childStagger;
};

const buildInitialLayout = (nodesById: Map<string, EditorNode>) => {
  if (nodesById.size === 0) return {};

  const components = collectWeakComponents(
    [...nodesById.keys()],
    buildWeakAdjacency(nodesById),
    getCheckNodeId(nodesById),
  );

  const layoutById: Record<string, XYPosition> = {};
  let componentOffsetX = autoLayoutMargin;

  for (const componentNodeIds of components) {
    const componentNodeIdSet = new Set(componentNodeIds);
    const indegreeById = new Map<string, number>(
      componentNodeIds.map((nodeId) => [nodeId, 0]),
    );

    for (const nodeId of componentNodeIds) {
      const node = nodesById.get(nodeId);
      if (!node) continue;

      for (const child of node.children) {
        if (!componentNodeIdSet.has(child.nodeId)) continue;
        indegreeById.set(child.nodeId, (indegreeById.get(child.nodeId) ?? 0) + 1);
      }
    }

    const roots = componentNodeIds.filter((nodeId) => (indegreeById.get(nodeId) ?? 0) === 0);
    const queue = roots.length > 0 ? [...roots] : [componentNodeIds[0]];
    const visited = new Set<string>();
    const depthById = new Map<string, number>();
    const nodeIdsByDepth = new Map<number, string[]>();

    for (const rootId of queue) {
      depthById.set(rootId, 0);
    }

    while (queue.length > 0) {
      const nodeId = queue.shift();
      if (!nodeId || visited.has(nodeId)) continue;

      visited.add(nodeId);
      const depth = depthById.get(nodeId) ?? 0;
      const row = nodeIdsByDepth.get(depth) ?? [];
      row.push(nodeId);
      nodeIdsByDepth.set(depth, row);

      const node = nodesById.get(nodeId);
      if (!node) continue;

      for (const child of node.children) {
        if (!componentNodeIdSet.has(child.nodeId)) continue;

        const nextDepth = depth + 1;
        const currentDepth = depthById.get(child.nodeId) ?? Number.NEGATIVE_INFINITY;
        if (nextDepth > currentDepth) depthById.set(child.nodeId, nextDepth);

        queue.push(child.nodeId);
      }
    }

    for (const nodeId of componentNodeIds) {
      if (visited.has(nodeId)) continue;

      const row = nodeIdsByDepth.get(0) ?? [];
      row.push(nodeId);
      nodeIdsByDepth.set(0, row);
    }

    const sortedDepths = [...nodeIdsByDepth.keys()].sort((left, right) => left - right);
    let maxRowLength = 0;

    for (const depth of sortedDepths) {
      const row = nodeIdsByDepth.get(depth) ?? [];
      if (row.length > maxRowLength) maxRowLength = row.length;

      row.forEach((nodeId, index) => {
        layoutById[nodeId] = {
          x: componentOffsetX + index * horizontalGap,
          y: autoLayoutMargin + depth * verticalGap,
        };
      });
    }

    const componentWidth = Math.max(1, maxRowLength) * horizontalGap;
    componentOffsetX += componentWidth + horizontalGap;
  }

  return layoutById;
};

type MeasuredNodeSize = { width: number; height: number };

type ValidateNodesResult =
  | { error: string; nodes: null }
  | { error: null; nodes: readonly Node[] };

const findCycleNodeId = (nodesById: Map<string, Node>) => {
  const stateById = new Map<string, 0 | 1 | 2>();

  const visit = (nodeId: string): string | null => {
    const nodeState = stateById.get(nodeId) ?? 0;
    if (nodeState === 1) return nodeId;
    if (nodeState === 2) return null;

    stateById.set(nodeId, 1);
    const node = nodesById.get(nodeId);
    if (node) {
      for (const child of node.children) {
        const cycleNodeId = visit(child.nodeId);
        if (cycleNodeId) return cycleNodeId;
      }
    }

    stateById.set(nodeId, 2);
    return null;
  };

  for (const nodeId of nodesById.keys()) {
    const cycleNodeId = visit(nodeId);
    if (cycleNodeId) return cycleNodeId;
  }

  return null;
};

const validateNodes = (nodes: readonly Node[]): ValidateNodesResult => {
  const parsedNodes = VerificationSchema.safeParse([...nodes]);
  if (!parsedNodes.success) {
    return {
      error: "Graph is not a valid NDG verification",
      nodes: null,
    } as const;
  }

  const nodesById = new Map<string, Node>();
  for (const node of parsedNodes.data) {
    if (nodesById.has(node.id)) {
      return {
        error: "Graph contains duplicate node ids",
        nodes: null,
      } as const;
    }

    nodesById.set(node.id, node);
  }

  const checkNodes = parsedNodes.data.filter((node) => node.type === "check");
  if (checkNodes.length !== 1) {
    return {
      error: "Graph must contain exactly one check node",
      nodes: null,
    } as const;
  }

  for (const node of parsedNodes.data) {
    if (node.type === "user-input" && node.children.length > 0) {
      return {
        error: "User input nodes must be leaves",
        nodes: null,
      } as const;
    }

    const childIdSet = new Set<string>();

    for (const child of node.children) {
      if (!nodesById.has(child.nodeId)) {
        return {
          error: "Graph references a child node that does not exist",
          nodes: null,
        } as const;
      }

      if (childIdSet.has(child.nodeId)) {
        return {
          error: `Node "${node.id}" contains duplicate edge to "${child.nodeId}"`,
          nodes: null,
        } as const;
      }

      childIdSet.add(child.nodeId);

      const childNode = nodesById.get(child.nodeId);
      if (!childNode) continue;
      if (childNode.type !== "check") continue;

      return {
        error: "Check node cannot be a child node",
        nodes: null,
      } as const;
    }
  }

  const cycleNodeId = findCycleNodeId(nodesById);
  if (cycleNodeId) {
    return {
      error: `Graph cannot contain cycles (found at "${cycleNodeId}")`,
      nodes: null,
    } as const;
  }

  return {
    error: null,
    nodes: parsedNodes.data,
  } as const;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const isValidPosition = (value: unknown): value is XYPosition =>
  isRecord(value) && isFiniteNumber(value.x) && isFiniteNumber(value.y);

const hasDuplicateKey = (
  nodesById: Map<string, EditorNode>,
  key: string,
  ignoredNodeId: string,
) =>
  [...nodesById.values()].some(
    (node) => node.id !== ignoredNodeId && node.key.trim() === key,
  );

const isValidMeasuredNodeSize = (
  value: { width: number; height: number } | undefined,
): value is MeasuredNodeSize => {
  if (!value) return false;
  if (!isFiniteNumber(value.width) || !isFiniteNumber(value.height)) return false;
  if (value.width <= 0 || value.height <= 0) return false;
  return true;
};

const getMeasuredNodeSizesById = (state: EditorState) => {
  const sizesById: Record<string, MeasuredNodeSize> = {};

  for (const nodeId of state.nodesById.keys()) {
    const measuredNodeSize = state.measuredById[nodeId];
    if (!isValidMeasuredNodeSize(measuredNodeSize)) {
      return {
        error: "Auto layout unavailable until all nodes are measured",
        sizesById: null,
      } as const;
    }

    sizesById[nodeId] = measuredNodeSize;
  }

  return {
    error: null,
    sizesById,
  } as const;
};

type ComponentLayout = {
  width: number;
  height: number;
  positionsByNodeId: Record<string, XYPosition>;
};

const buildComponentLayout = (
  nodesById: Map<string, EditorNode>,
  measuredNodeSizesById: Record<string, MeasuredNodeSize>,
  componentNodeIds: readonly string[],
): ComponentLayout | null => {
  const componentNodeIdSet = new Set(componentNodeIds);
  const indegreeById = new Map<string, number>(
    componentNodeIds.map((nodeId) => [nodeId, 0]),
  );
  const parentIdsByNodeId = new Map<string, string[]>(
    componentNodeIds.map((nodeId) => [nodeId, []]),
  );
  const childIdsByNodeId = new Map<string, string[]>(
    componentNodeIds.map((nodeId) => [nodeId, []]),
  );

  for (const nodeId of componentNodeIds) {
    const node = nodesById.get(nodeId);
    if (!node) continue;

    for (const child of node.children) {
      if (!componentNodeIdSet.has(child.nodeId)) continue;

      indegreeById.set(child.nodeId, (indegreeById.get(child.nodeId) ?? 0) + 1);
      const parentIds = parentIdsByNodeId.get(child.nodeId) ?? [];
      parentIds.push(nodeId);
      parentIdsByNodeId.set(child.nodeId, parentIds);
      const childIds = childIdsByNodeId.get(nodeId) ?? [];
      childIds.push(child.nodeId);
      childIdsByNodeId.set(nodeId, childIds);
    }
  }

  const roots = componentNodeIds
    .filter((nodeId) => (indegreeById.get(nodeId) ?? 0) === 0)
    .sort((left, right) => left.localeCompare(right));
  const queue = roots.length > 0 ? [...roots] : [componentNodeIds[0]];
  const mutableIndegreeById = new Map(indegreeById);
  const depthById = new Map<string, number>();
  const topologicalOrder: string[] = [];

  for (const rootId of queue) {
    depthById.set(rootId, 0);
  }

  while (queue.length > 0) {
    const nodeId = queue.shift();
    if (!nodeId) continue;

    topologicalOrder.push(nodeId);
    const depth = depthById.get(nodeId) ?? 0;
    const node = nodesById.get(nodeId);
    if (!node) continue;

    for (const child of node.children) {
      if (!componentNodeIdSet.has(child.nodeId)) continue;

      const nextDepth = depth + 1;
      const currentDepth = depthById.get(child.nodeId) ?? Number.NEGATIVE_INFINITY;
      if (nextDepth > currentDepth) depthById.set(child.nodeId, nextDepth);

      const nextIndegree = (mutableIndegreeById.get(child.nodeId) ?? 0) - 1;
      mutableIndegreeById.set(child.nodeId, nextIndegree);
      if (nextIndegree === 0) queue.push(child.nodeId);
    }
  }

  if (topologicalOrder.length !== componentNodeIds.length) return null;

  const nodeIdsByDepth = new Map<number, string[]>();
  let maxDepth = 0;

  for (const nodeId of topologicalOrder) {
    const depth = depthById.get(nodeId) ?? 0;
    if (depth > maxDepth) maxDepth = depth;

    const row = nodeIdsByDepth.get(depth) ?? [];
    row.push(nodeId);
    nodeIdsByDepth.set(depth, row);
  }

  const average = (values: readonly number[]) =>
    values.reduce((accumulator, value) => accumulator + value, 0) / values.length;

  const reorderLayerByNeighborBarycenter = (
    depth: number,
    getNeighborIds: (nodeId: string) => readonly string[],
    neighborIndexByNodeId: Map<string, number>,
  ) => {
    const layer = nodeIdsByDepth.get(depth) ?? [];
    if (layer.length <= 1) return;

    const currentIndexByNodeId = new Map<string, number>(
      layer.map((nodeId, index) => [nodeId, index]),
    );

    const layerScores = new Map<string, number>();
    for (const nodeId of layer) {
      const neighborIndexes = getNeighborIds(nodeId)
        .map((neighborId) => neighborIndexByNodeId.get(neighborId))
        .filter((index): index is number => typeof index === "number");
      if (neighborIndexes.length > 0) {
        layerScores.set(nodeId, average(neighborIndexes));
        continue;
      }

      layerScores.set(nodeId, currentIndexByNodeId.get(nodeId) ?? 0);
    }

    const reorderedLayer = [...layer].sort((leftNodeId, rightNodeId) => {
      const leftScore = layerScores.get(leftNodeId) ?? 0;
      const rightScore = layerScores.get(rightNodeId) ?? 0;
      if (leftScore !== rightScore) return leftScore - rightScore;

      const leftIndex = currentIndexByNodeId.get(leftNodeId) ?? 0;
      const rightIndex = currentIndexByNodeId.get(rightNodeId) ?? 0;
      if (leftIndex !== rightIndex) return leftIndex - rightIndex;

      return leftNodeId.localeCompare(rightNodeId);
    });

    nodeIdsByDepth.set(depth, reorderedLayer);
  };

  for (let passIndex = 0; passIndex < 6; passIndex += 1) {
    for (let depth = 1; depth <= maxDepth; depth += 1) {
      const previousLayer = nodeIdsByDepth.get(depth - 1) ?? [];
      const previousIndexByNodeId = new Map<string, number>(
        previousLayer.map((nodeId, index) => [nodeId, index]),
      );
      reorderLayerByNeighborBarycenter(
        depth,
        (nodeId) => parentIdsByNodeId.get(nodeId) ?? [],
        previousIndexByNodeId,
      );
    }

    for (let depth = maxDepth - 1; depth >= 0; depth -= 1) {
      const nextLayer = nodeIdsByDepth.get(depth + 1) ?? [];
      const nextIndexByNodeId = new Map<string, number>(
        nextLayer.map((nodeId, index) => [nodeId, index]),
      );
      reorderLayerByNeighborBarycenter(
        depth,
        (nodeId) => childIdsByNodeId.get(nodeId) ?? [],
        nextIndexByNodeId,
      );
    }
  }

  const maxHeightByDepth = new Map<number, number>();
  const depthYByDepth = new Map<number, number>();
  let currentY = 0;

  for (let depth = 0; depth <= maxDepth; depth += 1) {
    const layer = nodeIdsByDepth.get(depth) ?? [];
    let layerHeight = 0;
    layer.forEach((nodeId) => {
      const measuredNodeSize = measuredNodeSizesById[nodeId];
      if (!measuredNodeSize) return;

      if (measuredNodeSize.height > layerHeight) layerHeight = measuredNodeSize.height;
    });

    maxHeightByDepth.set(depth, layerHeight);
    depthYByDepth.set(depth, currentY);
    currentY += layerHeight + autoLayoutVerticalGap;
  }

  const positionsByNodeId: Record<string, XYPosition> = {};
  const centerXByNodeId = new Map<string, number>();
  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;

  for (let depth = 0; depth <= maxDepth; depth += 1) {
    const layer = nodeIdsByDepth.get(depth) ?? [];
    const y = depthYByDepth.get(depth) ?? 0;
    let nextLeft = 0;
    const leftByNodeId = new Map<string, number>();
    const desiredCenterByNodeId = new Map<string, number>();

    for (const nodeId of layer) {
      const parentCenters = (parentIdsByNodeId.get(nodeId) ?? [])
        .map((parentId) => centerXByNodeId.get(parentId))
        .filter((center): center is number => typeof center === "number");
      if (parentCenters.length === 0) continue;

      desiredCenterByNodeId.set(nodeId, average(parentCenters));
    }

    for (const nodeId of layer) {
      const measuredNodeSize = measuredNodeSizesById[nodeId];
      if (!measuredNodeSize) continue;

      const desiredCenter = desiredCenterByNodeId.get(nodeId);
      const desiredLeft =
        typeof desiredCenter === "number"
          ? desiredCenter - measuredNodeSize.width / 2
          : nextLeft;
      const left = desiredLeft < nextLeft ? nextLeft : desiredLeft;
      leftByNodeId.set(nodeId, left);
      nextLeft = left + measuredNodeSize.width + autoLayoutHorizontalGap;
    }

    const desiredCenters = [...desiredCenterByNodeId.values()];
    if (desiredCenters.length > 0 && leftByNodeId.size > 0) {
      let layerMinLeft = Number.POSITIVE_INFINITY;
      let layerMaxRight = Number.NEGATIVE_INFINITY;
      for (const nodeId of layer) {
        const measuredNodeSize = measuredNodeSizesById[nodeId];
        const left = leftByNodeId.get(nodeId);
        if (!measuredNodeSize || typeof left !== "number") continue;

        if (left < layerMinLeft) layerMinLeft = left;
        const right = left + measuredNodeSize.width;
        if (right > layerMaxRight) layerMaxRight = right;
      }

      if (Number.isFinite(layerMinLeft) && Number.isFinite(layerMaxRight)) {
        const desiredLayerCenter = average(desiredCenters);
        const currentLayerCenter = (layerMinLeft + layerMaxRight) / 2;
        const shift = desiredLayerCenter - currentLayerCenter;
        if (shift !== 0) {
          for (const nodeId of layer) {
            const left = leftByNodeId.get(nodeId);
            if (typeof left !== "number") continue;
            leftByNodeId.set(nodeId, left + shift);
          }
        }
      }
    }

    for (const nodeId of layer) {
      const measuredNodeSize = measuredNodeSizesById[nodeId];
      if (!measuredNodeSize) continue;
      const left = leftByNodeId.get(nodeId);
      if (typeof left !== "number") continue;

      positionsByNodeId[nodeId] = {
        x: left,
        y,
      };
      centerXByNodeId.set(nodeId, left + measuredNodeSize.width / 2);
      if (left < minX) minX = left;
      const right = left + measuredNodeSize.width;
      if (right > maxX) maxX = right;
    }
  }

  if (!Number.isFinite(minX) || !Number.isFinite(maxX)) return null;

  const normalizedPositionsByNodeId: Record<string, XYPosition> = {};
  const normalizedOffsetX = minX < 0 ? -minX : 0;
  for (const [nodeId, position] of Object.entries(positionsByNodeId)) {
    normalizedPositionsByNodeId[nodeId] = {
      x: position.x + normalizedOffsetX,
      y: position.y,
    };
  }

  const componentWidth = maxX - minX;
  const lastLayerHeight = maxHeightByDepth.get(maxDepth) ?? 0;
  const componentHeight = (depthYByDepth.get(maxDepth) ?? 0) + lastLayerHeight;

  return {
    width: componentWidth,
    height: componentHeight,
    positionsByNodeId: normalizedPositionsByNodeId,
  };
};

const buildLayeredDagLayout = (
  nodesById: Map<string, EditorNode>,
  measuredNodeSizesById: Record<string, MeasuredNodeSize>,
) => {
  const components = collectWeakComponents(
    [...nodesById.keys()],
    buildWeakAdjacency(nodesById),
    getCheckNodeId(nodesById),
  );

  const layoutById: Record<string, XYPosition> = {};
  let currentOffsetX = autoLayoutMargin;

  for (const componentNodeIds of components) {
    const componentLayout = buildComponentLayout(
      nodesById,
      measuredNodeSizesById,
      componentNodeIds,
    );
    if (!componentLayout) return {};

    for (const [nodeId, position] of Object.entries(componentLayout.positionsByNodeId)) {
      layoutById[nodeId] = {
        x: position.x + currentOffsetX,
        y: position.y + autoLayoutMargin,
      };
    }

    currentOffsetX += Math.max(componentLayout.width, 1) + autoLayoutComponentGap;
  }

  const positionedNodes = Object.values(layoutById);
  if (positionedNodes.length === 0) return {};

  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  for (const position of positionedNodes) {
    if (position.x < minX) minX = position.x;
    if (position.y < minY) minY = position.y;
  }

  const offsetX = autoLayoutMargin - minX;
  const offsetY = autoLayoutMargin - minY;
  if (offsetX === 0 && offsetY === 0) return layoutById;

  const normalizedLayoutById: Record<string, XYPosition> = {};
  for (const [nodeId, position] of Object.entries(layoutById)) {
    normalizedLayoutById[nodeId] = {
      x: position.x + offsetX,
      y: position.y + offsetY,
    };
  }

  return normalizedLayoutById;
};

export const createInitialState = (): EditorState => {
  const nodes = [createDefaultRootNode()];
  const nodesById = new Map<string, EditorNode>(nodes.map((node) => [node.id, node]));

  return {
    nodesById,
    layoutById: buildInitialLayout(nodesById),
    measuredById: {},
    editingNodeId: null,
    dialogError: null,
    autoLayoutError: null,
    autoLayoutVersion: 0,
  };
};

export const editorStateToDraft = (state: EditorState): NdgEditorDraftV1 => {
  const nodesById: Record<string, Node> = {};

  for (const node of state.nodesById.values()) {
    nodesById[node.id] = node;
  }

  return {
    format: ndgEditorDraftFormat,
    version: ndgEditorDraftVersion,
    nodesById,
    layoutById: { ...state.layoutById },
  };
};

export const draftToEditorState = (draft: unknown) => {
  if (!isRecord(draft)) {
    return {
      error: "Draft must be a JSON object",
      state: null,
    } as const;
  }

  if (draft.format !== ndgEditorDraftFormat) {
    return {
      error: `Draft format must be "${ndgEditorDraftFormat}"`,
      state: null,
    } as const;
  }

  if (draft.version !== ndgEditorDraftVersion) {
    return {
      error: `Draft version must be ${ndgEditorDraftVersion}`,
      state: null,
    } as const;
  }

  if (!isRecord(draft.nodesById)) {
    return {
      error: "Draft nodesById must be an object",
      state: null,
    } as const;
  }

  if (!isRecord(draft.layoutById)) {
    return {
      error: "Draft layoutById must be an object",
      state: null,
    } as const;
  }

  const rawNodesById = draft.nodesById;
  const rawNodes: Node[] = [];

  for (const [nodeId, nodeValue] of Object.entries(rawNodesById)) {
    if (!isRecord(nodeValue)) {
      return {
        error: `Draft node "${nodeId}" must be an object`,
        state: null,
      } as const;
    }

    if (nodeValue.id !== nodeId) {
      return {
        error: `Draft node key "${nodeId}" must match node.id`,
        state: null,
      } as const;
    }

    rawNodes.push(nodeValue as Node);
  }

  const validatedNodes = validateNodes(rawNodes);
  if (validatedNodes.error || !validatedNodes.nodes) {
    return {
      error: validatedNodes.error ?? "Draft graph is invalid",
      state: null,
    } as const;
  }

  const nodesById = new Map<string, EditorNode>(
    validatedNodes.nodes.map((node) => [node.id, node]),
  );

  const initialLayout = buildInitialLayout(nodesById);
  const rawLayoutById = draft.layoutById;
  const layoutById: Record<string, XYPosition> = { ...initialLayout };

  for (const nodeId of nodesById.keys()) {
    const position = rawLayoutById[nodeId];
    if (!isValidPosition(position)) continue;

    layoutById[nodeId] = {
      x: position.x,
      y: position.y,
    };
  }

  return {
    error: null,
    state: {
      nodesById,
      layoutById,
      measuredById: {},
      editingNodeId: null,
      dialogError: null,
      autoLayoutError: null,
      autoLayoutVersion: 0,
    } satisfies EditorState,
  } as const;
};

export const autoLayoutTree = (state: EditorState) => {
  const measuredNodeSizes = getMeasuredNodeSizesById(state);
  if (measuredNodeSizes.error || !measuredNodeSizes.sizesById) {
    return {
      ...state,
      autoLayoutError:
        measuredNodeSizes.error ?? "Auto layout unavailable until all nodes are measured",
    };
  }

  const nextLayoutById = buildLayeredDagLayout(
    state.nodesById,
    measuredNodeSizes.sizesById,
  );
  if (Object.keys(nextLayoutById).length === 0) {
    return {
      ...state,
      autoLayoutError: "Auto layout could not compute positions",
    };
  }

  return {
    ...state,
    layoutById: nextLayoutById,
    autoLayoutError: null,
    autoLayoutVersion: state.autoLayoutVersion + 1,
  };
};

export const openNodeDialog = (state: EditorState, nodeId: string) => {
  if (!state.nodesById.has(nodeId)) return state;

  return {
    ...state,
    dialogError: null,
    editingNodeId: nodeId,
  };
};

export const closeNodeDialog = (state: EditorState) => ({
  ...state,
  dialogError: null,
  editingNodeId: null,
});

export const updateNodePositions = (
  state: EditorState,
  layoutUpdates: Record<string, XYPosition>,
  measuredUpdates: Record<string, { width: number; height: number }> = {},
) => ({
  ...state,
  layoutById: {
    ...state.layoutById,
    ...layoutUpdates,
  },
  measuredById: {
    ...state.measuredById,
    ...measuredUpdates,
  },
});

export const addChildNode = (state: EditorState, parentId: string) => {
  const parentNode = getNodeById(state.nodesById, parentId);
  if (!parentNode || !canNodeHaveChildren(parentNode)) return state;

  const childNode = createDefaultChildNode(state.nodesById);
  const nextNodesById = new Map(state.nodesById);
  const childIndex = parentNode.children.length;
  const parentPosition = state.layoutById[parentId] ?? { x: 0, y: 0 };

  nextNodesById.set(
    parentId,
    replaceNodeChildren(parentNode, [...parentNode.children, { nodeId: childNode.id }]),
  );
  nextNodesById.set(childNode.id, childNode);

  return {
    ...state,
    nodesById: nextNodesById,
    layoutById: {
      ...state.layoutById,
      [childNode.id]: {
        x: parentPosition.x + getChildOffset(childIndex),
        y: parentPosition.y + verticalGap,
      },
    },
    dialogError: null,
    editingNodeId: childNode.id,
  };
};

export const connectEdge = (
  state: EditorState,
  sourceNodeId: string,
  targetNodeId: string,
) => {
  const sourceNode = getNodeById(state.nodesById, sourceNodeId);
  const targetNode = getNodeById(state.nodesById, targetNodeId);
  if (!sourceNode || !targetNode) return state;
  if (sourceNodeId === targetNodeId) return state;
  if (!canNodeHaveChildren(sourceNode)) return state;
  if (isCheckNode(targetNode)) return state;
  if (hasChildReference(sourceNode, targetNodeId)) return state;
  if (hasPath(state.nodesById, targetNodeId, sourceNodeId)) return state;

  const nextNodesById = new Map(state.nodesById);
  nextNodesById.set(
    sourceNodeId,
    replaceNodeChildren(sourceNode, [...sourceNode.children, { nodeId: targetNodeId }]),
  );

  return {
    ...state,
    nodesById: nextNodesById,
    dialogError: null,
  };
};

const findChildIndex = (node: EditorNode, childNodeId: string) =>
  node.children.findIndex((child) => child.nodeId === childNodeId);

export const reconnectEdge = (
  state: EditorState,
  oldSourceNodeId: string,
  oldTargetNodeId: string,
  newSourceNodeId: string,
  newTargetNodeId: string,
) => {
  const oldSourceNode = getNodeById(state.nodesById, oldSourceNodeId);
  const newSourceNode = getNodeById(state.nodesById, newSourceNodeId);
  const newTargetNode = getNodeById(state.nodesById, newTargetNodeId);
  if (!oldSourceNode || !newSourceNode || !newTargetNode) return state;

  const oldChildIndex = findChildIndex(oldSourceNode, oldTargetNodeId);
  if (oldChildIndex < 0) return state;
  if (!canNodeHaveChildren(newSourceNode)) return state;
  if (isCheckNode(newTargetNode)) return state;
  if (newSourceNodeId === newTargetNodeId) return state;

  const oldChild = oldSourceNode.children[oldChildIndex];
  if (!oldChild) return state;

  const nodesWithoutOldEdge = new Map(state.nodesById);
  nodesWithoutOldEdge.set(
    oldSourceNodeId,
    replaceNodeChildren(
      oldSourceNode,
      oldSourceNode.children.filter((_, childIndex) => childIndex !== oldChildIndex),
    ),
  );

  const sourceAfterRemoval = nodesWithoutOldEdge.get(newSourceNodeId);
  if (!sourceAfterRemoval) return state;
  if (hasChildReference(sourceAfterRemoval, newTargetNodeId)) return state;
  if (hasPath(nodesWithoutOldEdge, newTargetNodeId, newSourceNodeId)) return state;

  const edgeToAdd: Child = oldChild.when
    ? { nodeId: newTargetNodeId, when: oldChild.when }
    : { nodeId: newTargetNodeId };

  const nextNodesById = new Map(nodesWithoutOldEdge);
  nextNodesById.set(
    newSourceNodeId,
    replaceNodeChildren(sourceAfterRemoval, [...sourceAfterRemoval.children, edgeToAdd]),
  );

  return {
    ...state,
    nodesById: nextNodesById,
    dialogError: null,
  };
};

export const disconnectEdge = (
  state: EditorState,
  sourceNodeId: string,
  targetNodeId: string,
) => {
  const sourceNode = getNodeById(state.nodesById, sourceNodeId);
  if (!sourceNode) return state;

  const childIndex = findChildIndex(sourceNode, targetNodeId);
  if (childIndex < 0) return state;

  const nextNodesById = new Map(state.nodesById);
  nextNodesById.set(
    sourceNodeId,
    replaceNodeChildren(
      sourceNode,
      sourceNode.children.filter((_, index) => index !== childIndex),
    ),
  );

  return {
    ...state,
    nodesById: nextNodesById,
    dialogError: null,
  };
};

export const setEdgeCondition = (
  state: EditorState,
  sourceNodeId: string,
  targetNodeId: string,
  when?: Condition,
) => {
  const sourceNode = getNodeById(state.nodesById, sourceNodeId);
  if (!sourceNode) return state;

  const childIndex = findChildIndex(sourceNode, targetNodeId);
  if (childIndex < 0) return state;

  const nextNodesById = new Map(state.nodesById);
  nextNodesById.set(
    sourceNodeId,
    replaceNodeChildren(
      sourceNode,
      sourceNode.children.map((child, index) => {
        if (index !== childIndex) return child;
        if (!when) return { nodeId: child.nodeId };
        return { nodeId: child.nodeId, when };
      }),
    ),
  );

  return {
    ...state,
    nodesById: nextNodesById,
    dialogError: null,
  };
};

export const saveNode = (
  state: EditorState,
  nodeId: string,
  draft: NodeDraft,
) => {
  const currentNode = getNodeById(state.nodesById, nodeId);
  if (!currentNode) return state;

  const checkNodeId = getCheckNodeId(state.nodesById);
  const isEditingCheckNode = checkNodeId === nodeId;

  const nextNodeResult = buildNodeFromDraft({
    currentNode,
    draft,
    nodesById: state.nodesById,
  });

  if (nextNodeResult.error || !nextNodeResult.node) {
    return {
      ...state,
      dialogError: nextNodeResult.error ?? "The node could not be saved.",
    };
  }

  if (isEditingCheckNode && nextNodeResult.node.type !== "check") {
    return {
      ...state,
      dialogError: "The check node must remain the check node.",
    };
  }

  if (!isEditingCheckNode && nextNodeResult.node.type === "check") {
    return {
      ...state,
      dialogError: "Only one check node is allowed.",
    };
  }

  if (hasDuplicateKey(state.nodesById, nextNodeResult.node.key.trim(), nodeId)) {
    return {
      ...state,
      dialogError: `Another node already uses the key "${nextNodeResult.node.key}".`,
    };
  }

  const nextNodesById = new Map(state.nodesById);
  nextNodesById.set(nodeId, nextNodeResult.node);

  return {
    ...state,
    nodesById: nextNodesById,
    dialogError: null,
    editingNodeId: null,
  };
};
