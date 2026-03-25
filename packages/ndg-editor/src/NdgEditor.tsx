import { useMemo, useReducer } from "react";
import type { Node } from "@ndg/ndg-core";
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
  deleteSubtree,
  openNodeDialog,
  saveNode,
  type EditorState,
} from "./internal/graph";
import type { NodeDraft } from "./internal/node-factory";

type NdgEditorProps = { initialValue?: readonly Node[]; className?: string };

type NdgEditorAction =
  | { type: "addChild"; parentId: string }
  | { type: "applyConnection"; connection: Connection }
  | { type: "applyNodeChanges"; changes: NodeChange[] }
  | { type: "closeDialog" }
  | { type: "deleteNode"; nodeId: string }
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
    case "openDialog":
      return openNodeDialog(state, action.nodeId);
    case "saveNode":
      return saveNode(state, action.nodeId, action.draft);
  }
};

export const NdgEditor = ({ className, initialValue }: NdgEditorProps) => {
  const [state, dispatch] = useReducer(
    reducer,
    initialValue,
    createInitialState,
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

  if (state.loadError) return null;

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
};
