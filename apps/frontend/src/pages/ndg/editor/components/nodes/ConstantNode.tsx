import { Latex } from "@components/Latex";
import { Handle, Position, type NodeProps } from "@xyflow/react";

import type { EditorFlowNode } from "../../flow/convert";
import { NodeBody, NodeCard, NodeHeader } from "./shared";

export const ConstantNode = (props: NodeProps<EditorFlowNode>) => {
  const { data } = props;

  if (data.type !== "constant") return null;

  return (
    <NodeCard>
      <NodeHeader label={data.key} type="const" />

      <NodeBody className="flex min-h-8 items-center justify-center px-2 py-1 text-sm">
        <Latex tex={data.symbol} />
      </NodeBody>

      <Handle type="target" position={Position.Top} />
    </NodeCard>
  );
};
