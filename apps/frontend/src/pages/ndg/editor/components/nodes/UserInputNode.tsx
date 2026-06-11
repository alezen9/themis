import { Latex } from "@components/Latex";
import type { EditorNodeProps } from "../../document/types";
import { NodeBody, NodeCard } from "./shared";
import { latexPreview } from "./latexPreview";
import { Handle, Position } from "@xyflow/react";

export const UserInputNode = (props: EditorNodeProps) => {
  const { data, type } = props;
  if (type !== "user-input") return null;

  const tex = latexPreview(data);

  return (
    <NodeCard
      nodeId={props.id}
      nodeKey={data.key}
      kind="user-input"
      label={data.key}
    >
      <Handle type="target" position={Position.Top} />
      <NodeBody>
        <Latex displayMode tex={tex} className="px-1 text-sm" />
      </NodeBody>
    </NodeCard>
  );
};
