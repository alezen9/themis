import { Latex } from "@components/Latex";
import type { EditorNodeProps } from "../../document/types";
import { useNdgEditorStore } from "../../controller/useNdgEditorStore";
import { NodeAddChildHandle, NodeBody, NodeCard, NodeHeader } from "./shared";
import { Handle, Position } from "@xyflow/react";

export const FormulaNode = (props: EditorNodeProps) => {
  const { data, type } = props;
  const duplicate = useNdgEditorStore(state => state.isDuplicateKey(data.key));
  if (type !== "formula") return null;

  return (
    <NodeCard duplicate={duplicate}>
      <Handle type="target" position={Position.Top} />
      <NodeHeader label={data.key} type="formula" />
      {data.expression && (
        <NodeBody className="overflow-x-auto text-sm">
          <div className="flex w-max min-w-full justify-center">
            <Latex
              displayMode
              tex={`${data.symbol} = ${data.expression}`}
              className="min-w-max"
            />
          </div>
        </NodeBody>
      )}
      <NodeAddChildHandle sourceNodeId={props.id} />
    </NodeCard>
  );
};
