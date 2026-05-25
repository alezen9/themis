import { Latex } from "@components/Latex";
import { Handle, Position, type NodeProps } from "@xyflow/react";

import type { EditorFlowNode } from "../../flow/convert";
import { NodeBody, NodeCard, NodeHeader } from "./shared";

export const UserInputNode = (props: NodeProps<EditorFlowNode>) => {
  const { data } = props;

  if (data.type !== "user-input") return null;

  return (
    <NodeCard>
      <NodeHeader label={data.key} type="input" />

      {(data.symbol || data.unit) && (
        <NodeBody className="flex min-h-8 items-center justify-center gap-2 px-2 py-1 text-sm">
          {data.symbol && <Latex tex={data.symbol} />}
          {data.unit && <Latex tex={`(${data.unit})`} />}
        </NodeBody>
      )}

      <Handle type="target" position={Position.Top} />
    </NodeCard>
  );
};
