import {
  forwardRef,
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
  type ReactFlowInstance,
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
  type EditorFlowEdge,
  type EditorFlowNode,
  editorStateToFlowEdges,
  editorStateToFlowNodes,
  flowNodeType,
} from "./internal/adapter";
import { ConditionEdge } from "./internal/components/ConditionEdge";
import { NodeCard } from "./internal/components/NodeCard";
import { NodeDialog } from "./internal/components/NodeDialog";
import {
  addChildNode,
  autoLayoutTree,
  closeNodeDialog,
  createInitialState,
  disconnectEdge,
  draftToEditorState,
  editorStateToDraft,
  getUnreachableNodeIds,
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
  | { type: "autoLayout" }
  | { type: "applyConnection"; connection: Connection }
  | { type: "applyNodeChanges"; changes: NodeChange[] }
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

const reducer = (state: EditorState, action: NdgEditorAction) => {
  switch (action.type) {
    case "addChild":
      return addChildNode(state, action.parentId);
    case "applyEdgeCondition":
      return setEdgeCondition(state, action.sourceId, action.targetId, action.when);
    case "autoLayout":
      return autoLayoutTree(state);
    case "applyConnection":
      return applyConnection(state, action.connection);
    case "applyNodeChanges":
      return applyNodePositionChanges(state, action.changes);
    case "clearEdgeCondition":
      return setEdgeCondition(state, action.sourceId, action.targetId);
    case "closeDialog":
      return closeNodeDialog(state);
    case "disconnectEdge":
      return disconnectEdge(state, action.sourceId, action.targetId);
    case "reconnectEdge":
      return applyReconnect(state, action.oldEdge, action.connection);
    case "hydrate":
      return action.state;
    case "openDialog":
      return openNodeDialog(state, action.nodeId);
    case "saveNode":
      return saveNode(state, action.nodeId, action.draft);
  }
};

export const NdgEditor = forwardRef<NdgEditorRef, NdgEditorProps>(
  function NdgEditor({ className }, ref) {
    const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
    const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);
    const reactFlowRef = useRef<ReactFlowInstance<EditorFlowNode, EditorFlowEdge> | null>(null);

    useEffect(() => {
      if (state.autoLayoutVersion === 0) return;
      reactFlowRef.current?.fitView({ duration: 250, padding: 0.2 });
    }, [state.autoLayoutVersion]);

    useImperativeHandle(
      ref,
      () => ({
        save: () => editorStateToDraft(state),
        load: (draft) => {
          const parsedState = draftToEditorState(draft);
          if (parsedState.error || !parsedState.state) {
            throw new Error(parsedState.error ?? "Draft could not be loaded");
          }

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
            onAddChild: (nodeId) => dispatch({ type: "addChild", parentId: nodeId }),
            onEdit: (nodeId) => dispatch({ type: "openDialog", nodeId }),
          },
          {
            unreachableNodeIds,
          },
        ),
      [state, unreachableNodeIds],
    );

    const edges = useMemo(
      () =>
        editorStateToFlowEdges(
          state,
          {
            onApplyCondition: (sourceId, targetId, when) =>
              dispatch({ type: "applyEdgeCondition", sourceId, targetId, when }),
            onClearCondition: (sourceId, targetId) =>
              dispatch({ type: "clearEdgeCondition", sourceId, targetId }),
            onDisconnect: (sourceId, targetId) =>
              dispatch({ type: "disconnectEdge", sourceId, targetId }),
          },
          {
            hoveredEdgeId,
            unreachableNodeIds,
          },
        ),
      [state, hoveredEdgeId, unreachableNodeIds],
    );

    const editingNode = state.editingNodeId
      ? (state.nodesById.get(state.editingNodeId) ?? null)
      : null;

    return (
      <div className={className}>
        <ReactFlow
          fitView
          className="h-full"
          nodes={nodes}
          edges={edges}
          onInit={(reactFlowInstance) => {
            reactFlowRef.current = reactFlowInstance;
          }}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          deleteKeyCode={null}
          elementsSelectable
          edgesFocusable
          edgesReconnectable
          nodesDraggable
          nodesConnectable
          onConnect={(connection) => dispatch({ type: "applyConnection", connection })}
          onReconnect={(oldEdge, connection) =>
            dispatch({ type: "reconnectEdge", oldEdge, connection })
          }
          onEdgeMouseEnter={(_, edge) => setHoveredEdgeId(edge.id)}
          onEdgeMouseLeave={(_, edge) => {
            setHoveredEdgeId((currentEdgeId) => {
              if (currentEdgeId !== edge.id) return currentEdgeId;
              return null;
            });
          }}
          onPaneClick={() => setHoveredEdgeId(null)}
          onNodesChange={(changes) => dispatch({ type: "applyNodeChanges", changes })}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="rgba(17, 24, 39, 0.12)" gap={20} />
          <Controls>
            <ControlButton
              aria-label="Auto layout"
              onClick={() => dispatch({ type: "autoLayout" })}
              title={state.autoLayoutError ?? "Auto layout"}
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
