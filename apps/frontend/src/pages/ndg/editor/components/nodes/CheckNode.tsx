import { Latex } from "@components/Latex";
import type { EditorNodeProps } from "../../document/types";
import { useNdgEditorStore } from "../../controller/useNdgEditorStore";
import { NodeAddChildHandle, NodeBody, NodeCard } from "./shared";
import { latexPreview, SELECT_PREVIEW_TEX } from "./latexPreview";

export const CheckNode = (props: EditorNodeProps) => {
  const { data, type } = props;
  const symbolByKey = useNdgEditorStore(s => s._symbolByKey);
  if (type !== "check") return null;

  const kind = data.variant === "select" ? "select" : "check";
  const tex =
    data.variant === "compute"
      ? latexPreview({
          symbol: data.symbol,
          template: data.template,
          key: data.key,
          symbolByKey,
        })
      : SELECT_PREVIEW_TEX;

  return (
    <NodeCard nodeId={props.id} nodeKey={data.key} kind={kind} label={data.name}>
      <NodeBody>
        <Latex displayMode tex={tex} className="px-1 text-sm" />
      </NodeBody>
      <NodeAddChildHandle sourceNodeId={props.id} />
    </NodeCard>
  );
};
