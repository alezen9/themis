import { VerificationSchema, type Child, type Node } from "@ndg/ndg-core";
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
const autoLayoutHorizontalGap = 96;
const autoLayoutVerticalGap = 120;
const autoLayoutMargin = 48;

const getNodeById = (nodesById: Map<string, EditorNode>, nodeId: string) =>
  nodesById.get(nodeId) ?? null;

const replaceNodeChildren = (node: EditorNode, children: readonly Child[]) => ({
  ...node,
  children,
});

const hasChildReference = (node: EditorNode, childId: string) =>
  node.children.some((child) => child.nodeId === childId);

export const buildParentById = (nodesById: Map<string, EditorNode>) => {
  const parentById = new Map<string, string>();

  for (const node of nodesById.values()) {
    for (const child of node.children) {
      parentById.set(child.nodeId, node.id);
    }
  }

  return parentById;
};

const isCheckNode = (node: EditorNode) => node.type === "check";

export const isRootCheckNode = (
  node: EditorNode,
  parentById: Map<string, string>,
) => node.type === "check" && !parentById.has(node.id);

const getRootNodeId = (
  nodesById: Map<string, EditorNode>,
  parentById: Map<string, string>,
) => {
  for (const node of nodesById.values()) {
    if (isCheckNode(node) && !parentById.has(node.id)) return node.id;
  }

  return null;
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

const collectSubtreeIds = (
  nodesById: Map<string, EditorNode>,
  startNodeId: string,
) => {
  const removedIds = new Set<string>();
  const stack = [startNodeId];

  while (stack.length > 0) {
    const currentNodeId = stack.pop();
    if (!currentNodeId || removedIds.has(currentNodeId)) continue;

    removedIds.add(currentNodeId);
    const currentNode = nodesById.get(currentNodeId);
    if (!currentNode) continue;

    for (const child of currentNode.children) {
      stack.push(child.nodeId);
    }
  }

  return removedIds;
};

const removeLayoutEntries = (
  layoutById: Record<string, XYPosition>,
  removedIds: ReadonlySet<string>,
) => {
  const nextLayoutById = { ...layoutById };

  for (const removedId of removedIds) {
    delete nextLayoutById[removedId];
  }

  return nextLayoutById;
};

const removeMeasuredEntries = (
  measuredById: Record<string, { width: number; height: number }>,
  removedIds: ReadonlySet<string>,
) => {
  const nextMeasuredById = { ...measuredById };

  for (const removedId of removedIds) {
    delete nextMeasuredById[removedId];
  }

  return nextMeasuredById;
};

const getChildOffset = (childIndex: number) => {
  if (childIndex === 0) return 0;

  const direction = childIndex % 2 === 0 ? 1 : -1;
  const step = Math.ceil(childIndex / 2);
  return direction * step * childStagger;
};

const buildInitialLayout = (nodesById: Map<string, EditorNode>) => {
  const parentById = buildParentById(nodesById);
  const rootNodeId = getRootNodeId(nodesById, parentById);
  if (!rootNodeId) return {};

  const nodesByDepth = new Map<number, string[]>();
  const queue = [{ depth: 0, nodeId: rootNodeId }];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const currentItem = queue.shift();
    if (!currentItem || visited.has(currentItem.nodeId)) continue;

    visited.add(currentItem.nodeId);

    const row = nodesByDepth.get(currentItem.depth) ?? [];
    row.push(currentItem.nodeId);
    nodesByDepth.set(currentItem.depth, row);

    const currentNode = nodesById.get(currentItem.nodeId);
    if (!currentNode) continue;

    for (const child of currentNode.children) {
      queue.push({
        depth: currentItem.depth + 1,
        nodeId: child.nodeId,
      });
    }
  }

  const layoutById: Record<string, XYPosition> = {};

  for (const [depth, nodeIds] of nodesByDepth) {
    nodeIds.forEach((nodeId, index) => {
      layoutById[nodeId] = {
        x: index * horizontalGap,
        y: depth * verticalGap,
      };
    });
  }

  return layoutById;
};

type MeasuredNodeSize = { width: number; height: number };

type ValidateNodesResult =
  | { error: string; nodes: null }
  | { error: null; nodes: readonly Node[] };

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

  const parentById = new Map<string, string>();

  for (const node of parsedNodes.data) {
    if (node.type === "user-input" && node.children.length > 0) {
      return {
        error: "User input nodes must be leaves",
        nodes: null,
      } as const;
    }

    for (const child of node.children) {
      if (!nodesById.has(child.nodeId)) {
        return {
          error: "Graph references a child node that does not exist",
          nodes: null,
        } as const;
      }

      if (parentById.has(child.nodeId)) {
        return {
          error: "Graph cannot contain multi-parent nodes",
          nodes: null,
        } as const;
      }

      parentById.set(child.nodeId, node.id);
    }
  }

  const rootNodes = parsedNodes.data.filter((node) => !parentById.has(node.id));
  if (rootNodes.length !== 1 || rootNodes[0]?.type !== "check") {
    return {
      error: "Graph must contain exactly one root check node",
      nodes: null,
    } as const;
  }

  const visited = new Set<string>();
  const stack = [rootNodes[0].id];

  while (stack.length > 0) {
    const currentNodeId = stack.pop();
    if (!currentNodeId || visited.has(currentNodeId)) continue;

    visited.add(currentNodeId);
    const currentNode = nodesById.get(currentNodeId);
    if (!currentNode) continue;

    for (const child of currentNode.children) {
      stack.push(child.nodeId);
    }
  }

  if (visited.size !== parsedNodes.data.length) {
    return {
      error: "Graph must be a single rooted tree",
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

const buildTidyTreeLayout = (
  nodesById: Map<string, EditorNode>,
  measuredNodeSizesById: Record<string, MeasuredNodeSize>,
) => {
  const parentById = buildParentById(nodesById);
  const rootNodeId = getRootNodeId(nodesById, parentById);
  if (!rootNodeId) return {};

  const depthById = new Map<string, number>();
  const maxHeightByDepth = new Map<number, number>();
  const queue: Array<{ depth: number; nodeId: string }> = [
    { depth: 0, nodeId: rootNodeId },
  ];
  const visited = new Set<string>();
  let maxDepth = 0;

  while (queue.length > 0) {
    const currentItem = queue.shift();
    if (!currentItem || visited.has(currentItem.nodeId)) continue;

    visited.add(currentItem.nodeId);
    depthById.set(currentItem.nodeId, currentItem.depth);

    const measuredNodeSize = measuredNodeSizesById[currentItem.nodeId];
    if (measuredNodeSize) {
      const currentMaxHeight = maxHeightByDepth.get(currentItem.depth) ?? 0;
      if (measuredNodeSize.height > currentMaxHeight) {
        maxHeightByDepth.set(currentItem.depth, measuredNodeSize.height);
      }
    }

    if (currentItem.depth > maxDepth) {
      maxDepth = currentItem.depth;
    }

    const currentNode = nodesById.get(currentItem.nodeId);
    if (!currentNode) continue;

    for (const child of currentNode.children) {
      queue.push({
        depth: currentItem.depth + 1,
        nodeId: child.nodeId,
      });
    }
  }

  const depthStartYByDepth = new Map<number, number>();
  let currentDepthY = autoLayoutMargin;

  for (let depth = 0; depth <= maxDepth; depth += 1) {
    depthStartYByDepth.set(depth, currentDepthY);
    const depthBandHeight = maxHeightByDepth.get(depth) ?? 0;
    currentDepthY += depthBandHeight + autoLayoutVerticalGap;
  }

  const subtreeWidthById = new Map<string, number>();

  const getSubtreeWidth = (nodeId: string): number => {
    const cachedSubtreeWidth = subtreeWidthById.get(nodeId);
    if (cachedSubtreeWidth !== undefined) return cachedSubtreeWidth;

    const currentNode = nodesById.get(nodeId);
    const measuredNodeSize = measuredNodeSizesById[nodeId];
    if (!currentNode || !measuredNodeSize) return 0;

    if (currentNode.children.length === 0) {
      subtreeWidthById.set(nodeId, measuredNodeSize.width);
      return measuredNodeSize.width;
    }

    let childrenTotalWidth = 0;
    for (const [index, child] of currentNode.children.entries()) {
      const childSubtreeWidth = getSubtreeWidth(child.nodeId);
      if (index > 0) childrenTotalWidth += autoLayoutHorizontalGap;
      childrenTotalWidth += childSubtreeWidth;
    }

    const subtreeWidth = Math.max(measuredNodeSize.width, childrenTotalWidth);
    subtreeWidthById.set(nodeId, subtreeWidth);
    return subtreeWidth;
  };

  const layoutById: Record<string, XYPosition> = {};

  const placeNode = (nodeId: string, centerX: number) => {
    const currentNode = nodesById.get(nodeId);
    const measuredNodeSize = measuredNodeSizesById[nodeId];
    if (!currentNode || !measuredNodeSize) return;

    const depth = depthById.get(nodeId) ?? 0;
    const depthStartY = depthStartYByDepth.get(depth) ?? autoLayoutMargin;

    layoutById[nodeId] = {
      x: centerX - measuredNodeSize.width / 2,
      y: depthStartY,
    };

    if (currentNode.children.length === 0) return;

    let childrenTotalWidth = 0;
    for (const [index, child] of currentNode.children.entries()) {
      const childSubtreeWidth = subtreeWidthById.get(child.nodeId) ?? 0;
      if (index > 0) childrenTotalWidth += autoLayoutHorizontalGap;
      childrenTotalWidth += childSubtreeWidth;
    }

    let nextChildStartX = centerX - childrenTotalWidth / 2;
    for (const child of currentNode.children) {
      const childSubtreeWidth = subtreeWidthById.get(child.nodeId) ?? 0;
      const childCenterX = nextChildStartX + childSubtreeWidth / 2;

      placeNode(child.nodeId, childCenterX);
      nextChildStartX += childSubtreeWidth + autoLayoutHorizontalGap;
    }
  };

  const rootSubtreeWidth = getSubtreeWidth(rootNodeId);
  if (rootSubtreeWidth <= 0) return {};

  placeNode(rootNodeId, autoLayoutMargin + rootSubtreeWidth / 2);

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
    if (!isValidPosition(position)) {
      continue;
    }

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

  const nextLayoutById = buildTidyTreeLayout(
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
    replaceNodeChildren(parentNode, [
      ...parentNode.children,
      { nodeId: childNode.id },
    ]),
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

export const connectUnattachedNode = (
  state: EditorState,
  parentId: string,
  childId: string,
) => {
  const parentNode = getNodeById(state.nodesById, parentId);
  const childNode = getNodeById(state.nodesById, childId);
  if (!parentNode || !childNode || parentId === childId) return state;

  const parentById = buildParentById(state.nodesById);
  if (
    !canNodeHaveChildren(parentNode) ||
    isCheckNode(childNode) ||
    parentById.has(childId) ||
    hasChildReference(parentNode, childId) ||
    hasPath(state.nodesById, childId, parentId)
  )
    return state;

  const nextNodesById = new Map(state.nodesById);
  nextNodesById.set(
    parentId,
    replaceNodeChildren(parentNode, [
      ...parentNode.children,
      { nodeId: childId },
    ]),
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

  const parentById = buildParentById(state.nodesById);
  const isRootNode = !parentById.has(nodeId);
  const isEditingRootCheckNode = isRootNode && isCheckNode(currentNode);

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

  if (isEditingRootCheckNode && nextNodeResult.node.type !== "check") {
    return {
      ...state,
      dialogError: "The root node must remain the check node.",
    };
  }

  if (nextNodeResult.node.type === "check" && !isEditingRootCheckNode) {
    return {
      ...state,
      dialogError: "Only the root node can be a check node.",
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

export const deleteSubtree = (state: EditorState, nodeId: string) => {
  const currentNode = getNodeById(state.nodesById, nodeId);
  if (!currentNode || isCheckNode(currentNode)) return state;

  const removedIds = collectSubtreeIds(state.nodesById, nodeId);
  const nextNodesById = new Map<string, EditorNode>();

  for (const node of state.nodesById.values()) {
    if (removedIds.has(node.id)) continue;

    nextNodesById.set(
      node.id,
      replaceNodeChildren(
        node,
        node.children.filter((child) => !removedIds.has(child.nodeId)),
      ),
    );
  }

  return {
    ...state,
    nodesById: nextNodesById,
    layoutById: removeLayoutEntries(state.layoutById, removedIds),
    measuredById: removeMeasuredEntries(state.measuredById, removedIds),
    dialogError: null,
    editingNodeId:
      state.editingNodeId && removedIds.has(state.editingNodeId)
        ? null
        : state.editingNodeId,
  };
};
