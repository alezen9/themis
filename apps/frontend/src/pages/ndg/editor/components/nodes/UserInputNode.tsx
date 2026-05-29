import { Latex } from "@components/Latex";
import type { EditorNodeProps } from "../../document/types";
import { NodeBody, NodeCard, NodeHeader } from "./shared";
import { Handle, Position } from "@xyflow/react";

export const UserInputNode = (props: EditorNodeProps) => {
  const { data, type } = props;
  if (type !== "user-input") return null;

  return (
    <NodeCard nodeId={props.id} nodeKey={data.key}>
      <Handle type="target" position={Position.Top} />
      <NodeHeader label={data.key} type="input" />
      {(data.symbol || data.unit) && (
        <NodeBody className="flex min-h-8 items-center justify-center gap-2 px-2 py-1 text-sm">
          {data.symbol && <Latex tex={data.symbol} />}
          {data.unit && <Latex tex={`(${data.unit})`} />}
        </NodeBody>
      )}
    </NodeCard>
  );
};
