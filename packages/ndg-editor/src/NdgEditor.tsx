import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useReducer,
} from "react";
import {
  Background,
  Controls,
  ReactFlow,
  type Connection,
  type NodeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  applyConnection,
  applyNodePositionChanges,
  editorStateToFlowEdges,
  editorStateToFlowNodes,
  flowNodeType,
} from "./internal/adapter";
import { NodeCard } from "./internal/components/NodeCard";
import { NodeDialog } from "./internal/components/NodeDialog";
import {
  addChildNode,
  closeNodeDialog,
  createInitialState,
  draftToEditorState,
  deleteSubtree,
  editorStateToDraft,
  type NdgEditorDraftV1,
  openNodeDialog,
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
  | { type: "applyConnection"; connection: Connection }
  | { type: "applyNodeChanges"; changes: NodeChange[] }
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
    case "applyConnection":
      return applyConnection(state, action.connection);
    case "applyNodeChanges":
      return applyNodePositionChanges(state, action.changes);
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
          <Controls />
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
