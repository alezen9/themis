import { Latex } from "@components/Latex";
import type { EditorNodeProps } from "../../document/types";
import { NodeAddChildHandle, NodeBody, NodeCard, NodeHeader } from "./shared";
import { Handle, Position } from "@xyflow/react";

export const FormulaNode = (props: EditorNodeProps) => {
  const { data, type } = props;
  if (type !== "formula") return null;

  return (
    <NodeCard nodeId={props.id} nodeKey={data.key}>
      <Handle type="target" position={Position.Top} />
      <NodeHeader label={data.key} type="formula" />
      {data.expression && (
        <NodeBody className="text-sm">
          <Latex
            displayMode
            tex={`${data.symbol} = ${data.expression}`}
            className="justify-center-safe px-1"
          />
        </NodeBody>
      )}
      <NodeAddChildHandle sourceNodeId={props.id} />
    </NodeCard>
  );
};
