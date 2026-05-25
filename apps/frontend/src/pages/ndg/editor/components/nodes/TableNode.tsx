import { Handle, Position, type NodeProps } from "@xyflow/react";

import type { EditorFlowNode } from "../../flow/convert";
import { NodeBody, NodeCard, NodeHeader } from "./shared";

export const TableNode = (props: NodeProps<EditorFlowNode>) => {
  const { data } = props;

  if (data.type !== "table") return null;

  return (
    <NodeCard>
      <NodeHeader label={data.key} type="table" />

      <NodeBody className="truncate px-2 py-1 text-[10px] text-slate-500">
        {data.source}
      </NodeBody>

      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </NodeCard>
  );
};
