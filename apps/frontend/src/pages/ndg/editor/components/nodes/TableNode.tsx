import { Handle, Position } from "@xyflow/react";
import type { EditorNodeProps } from "../../document/types";
import { NodeAddChildHandle, NodeBody, NodeCard } from "./shared";

export const TableNode = (props: EditorNodeProps) => {
  const { type, data } = props;
  if (type !== "table") return null;

  return (
    <NodeCard
      nodeId={props.id}
      nodeKey={data.key}
      kind="table"
      label={data.key}
    >
      <Handle type="target" position={Position.Top} />
      {data.source && (
        <NodeBody className="truncate px-2 py-1 text-[10px] text-slate-500">
          {data.source}
        </NodeBody>
      )}
      <NodeAddChildHandle sourceNodeId={props.id} />
    </NodeCard>
  );
};
