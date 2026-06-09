import { Latex } from "@components/Latex";
import type { EditorNodeProps } from "../../document/types";
import { useNdgEditorStore } from "../../controller/useNdgEditorStore";
import { NodeAddChildHandle, NodeBody, NodeCard, NodeHeader } from "./shared";
import { latexPreview, SELECT_PREVIEW_TEX } from "./latexPreview";
import { Handle, Position } from "@xyflow/react";

export const FormulaNode = (props: EditorNodeProps) => {
  const { data, type } = props;
  const symbolByKey = useNdgEditorStore(s => s._symbolByKey);
  if (type !== "formula") return null;

  const tex =
    data.variant === "compute"
      ? latexPreview({ ...data, symbolByKey })
      : SELECT_PREVIEW_TEX;

  return (
    <NodeCard nodeId={props.id} nodeKey={data.key}>
      <Handle type="target" position={Position.Top} />
      <NodeHeader label={data.key} type="formula" />
      <NodeBody>
        <Latex displayMode tex={tex} className="justify-center-safe px-1" />
      </NodeBody>
      <NodeAddChildHandle sourceNodeId={props.id} />
    </NodeCard>
  );
};
