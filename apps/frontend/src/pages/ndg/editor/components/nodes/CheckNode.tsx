import { Latex } from "@components/Latex";
import type { EditorNodeProps } from "../../document/types";
import { NodeAddChildHandle, NodeBody, NodeCard, NodeHeader } from "./shared";
import { latexPreview } from "./latexPreview";

export const CheckNode = (props: EditorNodeProps) => {
  const { data, type } = props;
  if (type !== "check") return null;

  const tex = latexPreview({
    symbol: data.symbol,
    expression: data.verificationExpression,
  });

  return (
    <NodeCard nodeId={props.id} nodeKey={data.key}>
      <NodeHeader label={data.name} type="check" />
      <NodeBody>
        {tex && (
          <Latex displayMode tex={tex} className="justify-center-safe px-1" />
        )}
      </NodeBody>
      <NodeAddChildHandle sourceNodeId={props.id} />
    </NodeCard>
  );
};
