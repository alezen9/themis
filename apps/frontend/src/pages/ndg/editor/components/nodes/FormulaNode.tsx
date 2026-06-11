import { Latex } from "@components/Latex";
import type { EditorNodeProps } from "../../document/types";
import { useNdgEditorStore } from "../../controller/useNdgEditorStore";
import { NodeAddChildHandle, NodeBody, NodeCard } from "./shared";
import { latexPreview, SELECT_PREVIEW_TEX } from "./latexPreview";
import { Handle, Position } from "@xyflow/react";

export const FormulaNode = (props: EditorNodeProps) => {
  const { data, type } = props;
  const symbolByKey = useNdgEditorStore(s => s._symbolByKey);
  if (type !== "formula") return null;

  const kind = data.variant === "select" ? "select" : "formula";
  const tex =
    data.variant === "compute"
      ? latexPreview({ ...data, symbolByKey })
      : SELECT_PREVIEW_TEX;

  return (
    <NodeCard nodeId={props.id} nodeKey={data.key} kind={kind} label={data.key}>
      <Handle type="target" position={Position.Top} />
      <NodeBody>
        <Latex displayMode tex={tex} className="px-1 text-sm" />
      </NodeBody>
      <NodeAddChildHandle sourceNodeId={props.id} />
    </NodeCard>
  );
};
