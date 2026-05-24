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
} from "@xyflow/react";
import { Dialog, DialogHeader, DialogTitle } from "@components/Dialog";
import "@xyflow/react/dist/style.css";
import {
  flowEdgeType,
  editorStateToFlowEdges,
  editorStateToFlowNodes,
  edgeIdFromNodes,
  flowNodeType,
} from "./config/adapter";
import { ConditionEdge } from "./components/ConditionEdge";
import { NodeCard } from "./components/NodeCard";
import { Form } from "./Form";
import { runElkAutoLayout } from "./config/elkLayout";
import { createInitialState, getMeasuredNodeSizesById } from "./config/graph";
import {
  draftToEditorState,
  editorStateToDraft,
  type NdgEditorDraftV1,
} from "./config/draft";
import { getUnreachableNodeIds } from "./config/graphQueries";
import { editorReducer } from "./config/editorReducer";
import type { Option } from "@components/inputs/shared";

type NdgEditorProps = { className?: string; inputKeyOptions?: Option[] };

export type { NdgEditorDraftV1 } from "./config/draft";

export type NdgEditorRef = {
  save: () => NdgEditorDraftV1;
  load: (draft: NdgEditorDraftV1) => void;
};

const nodeTypes = { [flowNodeType]: NodeCard };
const edgeTypes = { [flowEdgeType]: ConditionEdge };
const edgeHoverKeepSelector = ".react-flow__edge, .ndg-edge-overlay";

export const NdgEditor = forwardRef<NdgEditorRef, NdgEditorProps>(
  function NdgEditor({ className, inputKeyOptions }, ref) {
    const [state, dispatch] = useReducer(
      editorReducer,
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

    const unreachableNodeIds = useMemo(
      () => getUnreachableNodeIds(state.nodesById),
      [state.nodesById],
    );

    const edgeIds = useMemo(() => {
      const ids = new Set<string>();
      for (const node of state.nodesById.values()) {
        for (const child of node.children) {
          ids.add(edgeIdFromNodes(node.id, child.nodeId));
        }
      }
      return ids;
    }, [state.nodesById]);

    const activeHoveredEdgeId =
      hoveredEdgeId && edgeIds.has(hoveredEdgeId) ? hoveredEdgeId : null;

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
            hoveredEdgeId: activeHoveredEdgeId,
            routedEdgePointsById: state.edgeLayoutById,
            unreachableNodeIds,
          },
        ),
      [
        state.nodesById,
        state.edgeLayoutById,
        activeHoveredEdgeId,
        unreachableNodeIds,
      ],
    );

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

    const nodes = useMemo(
      () =>
        editorStateToFlowNodes(
          state,
          {
            onAddChild: (nodeId) =>
              dispatch({ type: "addChild", parentId: nodeId }),
            onDelete: (nodeId) =>
              dispatch({ type: "deleteNodes", nodeIds: [nodeId] }),
            onEdit: (nodeId) => dispatch({ type: "openDialog", nodeId }),
          },
          { unreachableNodeIds },
        ),
      [state, unreachableNodeIds],
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
          deleteKeyCode={["Delete", "Backspace"]}
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
          onNodesDelete={(deletedNodes) =>
            dispatch({
              type: "deleteNodes",
              nodeIds: deletedNodes.map((node) => node.id),
            })
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

        <Dialog
          open={Boolean(editingNode)}
          onOpenChange={(open) => {
            if (open) return;
            dispatch({ type: "closeDialog" });
          }}
        >
          {editingNode && (
            <>
              <DialogHeader>
                <DialogTitle>Edit node</DialogTitle>
              </DialogHeader>
              <Form
                node={editingNode}
                error={state.dialogError}
                inputKeyOptions={inputKeyOptions}
                onCancel={() => dispatch({ type: "closeDialog" })}
                onSave={(draft) =>
                  dispatch({ type: "saveNode", nodeId: editingNode.id, draft })
                }
              />
            </>
          )}
        </Dialog>
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
