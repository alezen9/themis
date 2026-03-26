import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  Background,
  ControlButton,
  Controls,
  Panel,
  ReactFlow,
  type XYPosition,
  type Connection,
  type NodeChange,
} from "@xyflow/react";
import type { Condition } from "@ndg/ndg-core";
import "@xyflow/react/dist/style.css";
import {
  applyConnection,
  applyNodePositionChanges,
  applyReconnect,
  flowEdgeType,
  editorStateToFlowEdges,
  editorStateToFlowNodes,
  flowNodeType,
} from "./internal/adapter";
import { ConditionEdge } from "./internal/components/ConditionEdge";
import { NodeCard } from "./internal/components/NodeCard";
import { NodeDialog } from "./internal/components/NodeDialog";
import { runElkAutoLayout } from "./internal/elk-layout";
import {
  addChildNode,
  applyAutoLayout,
  closeNodeDialog,
  createInitialState,
  disconnectEdge,
  draftToEditorState,
  editorStateToDraft,
  getMeasuredNodeSizesById,
  getUnreachableNodeIds,
  setAutoLayoutError,
  type NdgEditorDraftV1,
  openNodeDialog,
  saveNode,
  setEdgeCondition,
  type EditorState,
} from "./internal/graph";
import type { NodeDraft } from "./internal/node-factory";

type NdgEditorProps = { className?: string };

export type NdgEditorRef = {
  save: () => NdgEditorDraftV1;
  load: (draft: NdgEditorDraftV1) => void;
};

type NdgEditorAction =
  | { type: "addChild"; parentId: string }
  | {
      type: "applyEdgeCondition";
      sourceId: string;
      targetId: string;
      when: Condition;
    }
  | {
      type: "applyAutoLayout";
      edgeLayoutById: Record<string, XYPosition[]>;
      layoutById: Record<string, XYPosition>;
    }
  | { type: "applyConnection"; connection: Connection }
  | { type: "applyNodeChanges"; changes: NodeChange[] }
  | { type: "autoLayoutError"; error: string }
  | { type: "clearEdgeCondition"; sourceId: string; targetId: string }
  | { type: "closeDialog" }
  | { type: "disconnectEdge"; sourceId: string; targetId: string }
  | {
      type: "reconnectEdge";
      oldEdge: { source?: string | null; target?: string | null };
      connection: Connection;
    }
  | { type: "hydrate"; state: EditorState }
  | { type: "openDialog"; nodeId: string }
  | { type: "saveNode"; nodeId: string; draft: NodeDraft };

const nodeTypes = { [flowNodeType]: NodeCard };
const edgeTypes = { [flowEdgeType]: ConditionEdge };
const edgeHoverKeepSelector = ".react-flow__edge, .ndg-edge-overlay";

const getMovedNodeIds = (changes: readonly NodeChange[]) => {
  const movedNodeIds = new Set<string>();

  for (const change of changes) {
    if (change.type !== "position" || !change.position) continue;
    movedNodeIds.add(change.id);
  }

  return movedNodeIds;
};

const pruneEdgeLayoutByMovedNodeIds = (
  edgeLayoutById: Record<string, XYPosition[]>,
  movedNodeIds: ReadonlySet<string>,
) => {
  if (movedNodeIds.size === 0) return edgeLayoutById;

  let hasPrunedEdge = false;
  const nextEdgeLayoutById: Record<string, XYPosition[]> = {};

  for (const [edgeId, points] of Object.entries(edgeLayoutById)) {
    const separatorIndex = edgeId.indexOf(":");
    if (separatorIndex < 0) {
      nextEdgeLayoutById[edgeId] = points;
      continue;
    }

    const sourceNodeId = edgeId.slice(0, separatorIndex);
    const targetNodeId = edgeId.slice(separatorIndex + 1);
    if (movedNodeIds.has(sourceNodeId) || movedNodeIds.has(targetNodeId)) {
      hasPrunedEdge = true;
      continue;
    }

    nextEdgeLayoutById[edgeId] = points;
  }

  if (!hasPrunedEdge) return edgeLayoutById;
  return nextEdgeLayoutById;
};

const reducer = (state: EditorState, action: NdgEditorAction) => {
  switch (action.type) {
    case "addChild":
      return { ...addChildNode(state, action.parentId), edgeLayoutById: {} };
    case "applyEdgeCondition":
      return setEdgeCondition(
        state,
        action.sourceId,
        action.targetId,
        action.when,
      );
    case "applyAutoLayout":
      return applyAutoLayout(state, action.layoutById, action.edgeLayoutById);
    case "applyConnection":
      return {
        ...applyConnection(state, action.connection),
        edgeLayoutById: {},
      };
    case "applyNodeChanges": {
      const nextState = applyNodePositionChanges(state, action.changes);
      if (nextState === state) return state;
      if (Object.keys(state.edgeLayoutById).length === 0) return nextState;
      const movedNodeIds = getMovedNodeIds(action.changes);
      const nextEdgeLayoutById = pruneEdgeLayoutByMovedNodeIds(
        state.edgeLayoutById,
        movedNodeIds,
      );
      if (nextEdgeLayoutById === state.edgeLayoutById) return nextState;
      return { ...nextState, edgeLayoutById: nextEdgeLayoutById };
    }
    case "autoLayoutError":
      return setAutoLayoutError(state, action.error);
    case "clearEdgeCondition":
      return setEdgeCondition(state, action.sourceId, action.targetId);
    case "closeDialog":
      return closeNodeDialog(state);
    case "disconnectEdge":
      return {
        ...disconnectEdge(state, action.sourceId, action.targetId),
        edgeLayoutById: {},
      };
    case "reconnectEdge":
      return {
        ...applyReconnect(state, action.oldEdge, action.connection),
        edgeLayoutById: {},
      };
    case "hydrate":
      return action.state;
    case "openDialog":
      return openNodeDialog(state, action.nodeId);
    case "saveNode":
      return {
        ...saveNode(state, action.nodeId, action.draft),
        edgeLayoutById: {},
      };
  }
};

export const NdgEditor = forwardRef<NdgEditorRef, NdgEditorProps>(
  function NdgEditor({ className }, ref) {
    const [state, dispatch] = useReducer(
      reducer,
      undefined,
      createInitialState,
    );
    const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);
    const [isAutoLayouting, setIsAutoLayouting] = useState(false);
    const stateRef = useRef(state);
    const autoLayoutRunIdRef = useRef(0);

    useEffect(() => {
      stateRef.current = state;
    }, [state]);

    const onAutoLayout = useCallback(async () => {
      const currentState = stateRef.current;
      const measuredNodeSizes = getMeasuredNodeSizesById(currentState);
      if (measuredNodeSizes.error || !measuredNodeSizes.sizesById) {
        dispatch({
          type: "autoLayoutError",
          error:
            measuredNodeSizes.error ??
            "Auto layout unavailable until all nodes are measured",
        });
        return;
      }

      const runId = autoLayoutRunIdRef.current + 1;
      autoLayoutRunIdRef.current = runId;
      setIsAutoLayouting(true);

      const layoutResult = await runElkAutoLayout({
        measuredNodeSizesById: measuredNodeSizes.sizesById,
        nodesById: currentState.nodesById,
      });

      if (autoLayoutRunIdRef.current !== runId) return;
      if (
        stateRef.current.nodesById !== currentState.nodesById ||
        stateRef.current.measuredById !== currentState.measuredById
      ) {
        setIsAutoLayouting(false);
        return;
      }

      setIsAutoLayouting(false);

      if (layoutResult.error || !layoutResult.layoutById) {
        dispatch({
          type: "autoLayoutError",
          error: layoutResult.error ?? "Auto layout failed",
        });
        return;
      }

      dispatch({
        type: "applyAutoLayout",
        edgeLayoutById: layoutResult.edgeLayoutById ?? {},
        layoutById: layoutResult.layoutById,
      });
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        save: () => editorStateToDraft(state),
        load: (draft) => {
          const parsedState = draftToEditorState(draft);
          if (parsedState.error || !parsedState.state) {
            throw new Error(parsedState.error ?? "Draft could not be loaded");
          }

          autoLayoutRunIdRef.current += 1;
          setIsAutoLayouting(false);
          setHoveredEdgeId(null);
          dispatch({ type: "hydrate", state: parsedState.state });
        },
      }),
      [state],
    );

    const unreachableNodeIds = useMemo(
      () => getUnreachableNodeIds(state.nodesById),
      [state.nodesById],
    );

    const nodes = useMemo(
      () =>
        editorStateToFlowNodes(
          state,
          {
            onAddChild: (nodeId) =>
              dispatch({ type: "addChild", parentId: nodeId }),
            onEdit: (nodeId) => dispatch({ type: "openDialog", nodeId }),
          },
          { unreachableNodeIds },
        ),
      [state, unreachableNodeIds],
    );

    const edges = useMemo(
      () =>
        editorStateToFlowEdges(
          state.nodesById,
          {
            onApplyCondition: (sourceId, targetId, when) =>
              dispatch({
                type: "applyEdgeCondition",
                sourceId,
                targetId,
                when,
              }),
            onClearCondition: (sourceId, targetId) =>
              dispatch({ type: "clearEdgeCondition", sourceId, targetId }),
            onDisconnect: (sourceId, targetId) =>
              dispatch({ type: "disconnectEdge", sourceId, targetId }),
          },
          {
            hoveredEdgeId,
            routedEdgePointsById: state.edgeLayoutById,
            unreachableNodeIds,
          },
        ),
      [
        state.nodesById,
        state.edgeLayoutById,
        hoveredEdgeId,
        unreachableNodeIds,
      ],
    );

    const editingNode = state.editingNodeId
      ? (state.nodesById.get(state.editingNodeId) ?? null)
      : null;

    return (
      <div className={className}>
        <ReactFlow
          fitView
          className="h-full"
          minZoom={0.05}
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          deleteKeyCode={null}
          elementsSelectable
          edgesFocusable
          edgesReconnectable
          reconnectRadius={28}
          connectionRadius={38}
          nodesDraggable
          nodesConnectable
          onConnect={(connection) =>
            dispatch({ type: "applyConnection", connection })
          }
          onReconnect={(oldEdge, connection) =>
            dispatch({ type: "reconnectEdge", oldEdge, connection })
          }
          onEdgeMouseEnter={(_, edge) => setHoveredEdgeId(edge.id)}
          onEdgeMouseLeave={(event, edge) => {
            const relatedTarget = event.relatedTarget;
            if (
              relatedTarget instanceof Element &&
              relatedTarget.closest(edgeHoverKeepSelector)
            ) {
              return;
            }

            setHoveredEdgeId((currentEdgeId) => {
              if (currentEdgeId !== edge.id) return currentEdgeId;
              return null;
            });
          }}
          onNodeMouseMove={() => setHoveredEdgeId(null)}
          onPaneClick={() => setHoveredEdgeId(null)}
          onPaneMouseMove={(event) => {
            const target = event.target;
            if (
              target instanceof Element &&
              target.closest(edgeHoverKeepSelector)
            ) {
              return;
            }

            setHoveredEdgeId(null);
          }}
          onNodesChange={(changes) =>
            dispatch({ type: "applyNodeChanges", changes })
          }
          proOptions={{ hideAttribution: true }}
        >
          <Background color="rgba(17, 24, 39, 0.12)" gap={20} />
          <Controls>
            <ControlButton
              aria-label="Auto layout"
              disabled={isAutoLayouting}
              onClick={() => {
                void onAutoLayout();
              }}
              title={
                state.autoLayoutError ??
                (isAutoLayouting ? "Auto layout running..." : "Auto layout")
              }
            >
              <AutoLayoutIcon />
            </ControlButton>
          </Controls>
          {state.autoLayoutError ? (
            <Panel
              position="bottom-left"
              className="pointer-events-none mb-1 ml-16"
            >
              <div className="rounded-sm border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-800">
                {state.autoLayoutError}
              </div>
            </Panel>
          ) : null}
          {unreachableNodeIds.size > 0 ? (
            <Panel position="top-right" className="mr-2 mt-2">
              <div className="rounded-sm border border-amber-300 bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-800">
                {unreachableNodeIds.size} unreachable node
                {unreachableNodeIds.size === 1 ? "" : "s"}
              </div>
            </Panel>
          ) : null}
        </ReactFlow>

        {editingNode ? (
          <NodeDialog
            node={editingNode}
            error={state.dialogError}
            onClose={() => dispatch({ type: "closeDialog" })}
            onSave={(draft) =>
              dispatch({ type: "saveNode", nodeId: editingNode.id, draft })
            }
          />
        ) : null}
      </div>
    );
  },
);

const AutoLayoutIcon = () => (
  <svg
    aria-hidden="true"
    className="h-3.5 w-3.5"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1.8}
    viewBox="0 0 24 24"
  >
    <circle cx="5" cy="5" r="2" />
    <circle cx="19" cy="5" r="2" />
    <circle cx="12" cy="19" r="2" />
    <path d="M7 6.5l3.8 9.2" />
    <path d="M17 6.5l-3.8 9.2" />
    <path d="M7 5h10" />
  </svg>
);
