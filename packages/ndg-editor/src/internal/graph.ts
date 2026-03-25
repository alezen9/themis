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
  loadError: string | null;
};

const horizontalGap = 320;
const verticalGap = 220;
const childStagger = 72;

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

const validateInitialValue = (initialValue: readonly Node[]) => {
  const parsedNodes = VerificationSchema.safeParse([...initialValue]);
  if (!parsedNodes.success) {
    return {
      error: "Initial graph is not a valid NDG verification.",
      nodes: null,
    } as const;
  }

  const nodesById = new Map<string, Node>();
  for (const node of parsedNodes.data) {
    if (nodesById.has(node.id)) {
      return {
        error: "Initial graph contains duplicate node ids.",
        nodes: null,
      } as const;
    }

    nodesById.set(node.id, node);
  }

  const checkNodes = parsedNodes.data.filter((node) => node.type === "check");
  if (checkNodes.length !== 1) {
    return {
      error: "Initial graph must contain exactly one check node.",
      nodes: null,
    } as const;
  }

  const parentById = new Map<string, string>();

  for (const node of parsedNodes.data) {
    if (node.type === "user-input" && node.children.length > 0) {
      return {
        error: "User input nodes must be leaves.",
        nodes: null,
      } as const;
    }

    for (const child of node.children) {
      if (!nodesById.has(child.nodeId)) {
        return {
          error: "Initial graph references a child node that does not exist.",
          nodes: null,
        } as const;
      }

      if (parentById.has(child.nodeId)) {
        return {
          error: "Initial graph cannot contain multi-parent nodes.",
          nodes: null,
        } as const;
      }

      parentById.set(child.nodeId, node.id);
    }
  }

  const rootNodes = parsedNodes.data.filter((node) => !parentById.has(node.id));
  if (rootNodes.length !== 1 || rootNodes[0]?.type !== "check") {
    return {
      error: "Initial graph must contain exactly one root check node.",
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
      error: "Initial graph must be a single rooted tree.",
      nodes: null,
    } as const;
  }

  return {
    error: null,
    nodes: parsedNodes.data,
  } as const;
};

const hasDuplicateKey = (
  nodesById: Map<string, EditorNode>,
  key: string,
  ignoredNodeId: string,
) =>
  [...nodesById.values()].some(
    (node) => node.id !== ignoredNodeId && node.key.trim() === key,
  );

export const createInitialState = (initialValue?: readonly Node[]): EditorState => {
  const initialNodes = initialValue ? validateInitialValue(initialValue) : null;

  if (initialNodes?.error) {
    return {
      nodesById: new Map(),
      layoutById: {},
      measuredById: {},
      editingNodeId: null,
      dialogError: null,
      loadError: initialNodes.error,
    };
  }

  const nodes = initialNodes?.nodes ?? [createDefaultRootNode()];
  const nodesById = new Map<string, EditorNode>(nodes.map((node) => [node.id, node]));

  return {
    nodesById,
    layoutById: buildInitialLayout(nodesById),
    measuredById: {},
    editingNodeId: null,
    dialogError: null,
    loadError: null,
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
