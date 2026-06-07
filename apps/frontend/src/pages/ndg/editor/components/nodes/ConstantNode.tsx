import { Latex } from "@components/Latex";
import type { EditorNodeProps } from "../../document/types";
import { NodeBody, NodeCard, NodeHeader } from "./shared";
import { latexPreview } from "./latexPreview";
import { Handle, Position } from "@xyflow/react";

export const ConstantNode = (props: EditorNodeProps) => {
  const { data, type } = props;
  if (type !== "constant") return null;

  const tex = latexPreview(data);

  return (
    <NodeCard nodeId={props.id} nodeKey={data.key}>
      <Handle type="target" position={Position.Top} />
      <NodeHeader label={data.key} type="const" />
      <NodeBody>
        {tex && (
          <Latex displayMode tex={tex} className="justify-center-safe px-1" />
        )}
      </NodeBody>
    </NodeCard>
  );
};
