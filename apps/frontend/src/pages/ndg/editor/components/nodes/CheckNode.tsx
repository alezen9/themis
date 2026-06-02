import { Latex } from "@components/Latex";
import type { EditorNodeProps } from "../../document/types";
import { NodeAddChildHandle, NodeBody, NodeCard, NodeHeader } from "./shared";

export const CheckNode = (props: EditorNodeProps) => {
  const { data, type } = props;
  if (type !== "check") return null;

  return (
    <NodeCard nodeId={props.id} nodeKey={data.key}>
      <NodeHeader label={data.key} type="check" />
      {data.verificationExpression && (
        <NodeBody className="overflow-x-auto text-sm">
          <Latex
            displayMode
            tex={data.verificationExpression}
            className="justify-center-safe"
          />
        </NodeBody>
      )}
      <NodeAddChildHandle sourceNodeId={props.id} />
    </NodeCard>
  );
};
