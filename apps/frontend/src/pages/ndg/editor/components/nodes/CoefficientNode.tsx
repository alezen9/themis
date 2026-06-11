import { Latex } from "@components/Latex";
import type { EditorNodeProps } from "../../document/types";
import { NodeBody, NodeCard, NodeHeader } from "./shared";
import { latexPreview } from "./latexPreview";
import { Handle, Position } from "@xyflow/react";

export const CoefficientNode = (props: EditorNodeProps) => {
  const { data, type } = props;
  if (type !== "coefficient") return null;

  const tex = latexPreview(data);

  return (
    <NodeCard nodeId={props.id} nodeKey={data.key}>
      <Handle type="target" position={Position.Top} />
      <NodeHeader label={data.key} type="coefficient" />
      <NodeBody>
        <Latex displayMode tex={tex} className="px-1 text-sm" />
      </NodeBody>
    </NodeCard>
  );
};
