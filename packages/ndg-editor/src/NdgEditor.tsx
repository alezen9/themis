import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useReducer,
  useRef,
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
  type EditorFlowEdge,
  type EditorFlowNode,
  editorStateToFlowEdges,
  editorStateToFlowNodes,
  flowNodeType,
} from "./internal/adapter";
import { NodeCard } from "./internal/components/NodeCard";
import { NodeDialog } from "./internal/components/NodeDialog";
import {
  addChildNode,
  autoLayoutTree,
  closeNodeDialog,
  createInitialState,
  draftToEditorState,
  deleteSubtree,
  editorStateToDraft,
  type NdgEditorDraftV1,
  openNodeDialog,
  setIncomingCondition,
  saveNode,
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
  | { type: "applyIncomingCondition"; nodeId: string; when: Condition }
  | { type: "autoLayout" }
  | { type: "applyConnection"; connection: Connection }
  | { type: "applyNodeChanges"; changes: NodeChange[] }
  | { type: "clearIncomingCondition"; nodeId: string }
  | { type: "closeDialog" }
  | { type: "deleteNode"; nodeId: string }
  | { type: "hydrate"; state: EditorState }
  | { type: "openDialog"; nodeId: string }
  | { type: "saveNode"; nodeId: string; draft: NodeDraft };

const nodeTypes = { [flowNodeType]: NodeCard };

const reducer = (state: EditorState, action: NdgEditorAction) => {
  switch (action.type) {
    case "addChild":
      return addChildNode(state, action.parentId);
    case "applyIncomingCondition":
      return setIncomingCondition(state, action.nodeId, action.when);
    case "autoLayout":
      return autoLayoutTree(state);
    case "applyConnection":
      return applyConnection(state, action.connection);
    case "applyNodeChanges":
      return applyNodePositionChanges(state, action.changes);
    case "clearIncomingCondition":
      return setIncomingCondition(state, action.nodeId);
    case "closeDialog":
      return closeNodeDialog(state);
    case "deleteNode":
      return deleteSubtree(state, action.nodeId);
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

          dispatch({ type: "hydrate", state: parsedState.state });
        },
      }),
      [state],
    );

    const nodes = useMemo(
      () =>
        editorStateToFlowNodes(state, {
          onAddChild: (nodeId) =>
            dispatch({ type: "addChild", parentId: nodeId }),
          onApplyIncomingCondition: (nodeId, when) =>
            dispatch({ type: "applyIncomingCondition", nodeId, when }),
          onClearIncomingCondition: (nodeId) =>
            dispatch({ type: "clearIncomingCondition", nodeId }),
          onDelete: (nodeId) => dispatch({ type: "deleteNode", nodeId }),
          onEdit: (nodeId) => dispatch({ type: "openDialog", nodeId }),
        }),
      [state],
    );

    const edges = useMemo(() => editorStateToFlowEdges(state), [state]);

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
          deleteKeyCode={null}
          elementsSelectable={false}
          edgesFocusable={false}
          nodesDraggable
          nodesConnectable
          onConnect={(connection) =>
            dispatch({ type: "applyConnection", connection })
          }
          onNodesChange={(changes) =>
            dispatch({ type: "applyNodeChanges", changes })
          }
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
