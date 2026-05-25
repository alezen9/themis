import { Latex } from "@components/Latex";
import { Handle, Position, type NodeProps } from "@xyflow/react";

import type { EditorFlowNode } from "../../flow/convert";
import { NodeBody, NodeCard, NodeHeader } from "./shared";

export const FormulaNode = (props: NodeProps<EditorFlowNode>) => {
  const { data } = props;

  if (data.type !== "formula") return null;

  return (
    <NodeCard>
      <NodeHeader label={data.key} type="formula" />

      {data.expression && (
        <NodeBody className="overflow-x-auto text-sm">
          <div className="flex w-max min-w-full justify-center">
            <Latex
              displayMode
              tex={`${data.symbol} = ${data.expression}`}
              className="min-w-max"
            />
          </div>
        </NodeBody>
      )}

      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </NodeCard>
  );
};
