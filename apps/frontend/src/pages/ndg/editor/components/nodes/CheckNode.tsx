import { Latex } from "@components/Latex";
import type { EditorNodeProps } from "../../document/types";
import { useNdgEditorStore } from "../../controller/useNdgEditorStore";
import { NodeAddChildHandle, NodeBody, NodeCard, NodeHeader } from "./shared";

export const CheckNode = (props: EditorNodeProps) => {
  const { data, type } = props;
  const duplicate = useNdgEditorStore(state => state.isDuplicateKey(data.key));
  if (type !== "check") return null;

  return (
    <NodeCard duplicate={duplicate}>
      <NodeHeader label={data.key} type="check" />
      {data.verificationExpression && (
        <NodeBody className="overflow-x-auto text-sm">
          <div className="flex w-max min-w-full justify-center">
            <Latex
              displayMode
              tex={data.verificationExpression}
              className="min-w-max"
            />
          </div>
        </NodeBody>
      )}
      <NodeAddChildHandle sourceNodeId={props.id} />
    </NodeCard>
  );
};
