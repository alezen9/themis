import { Latex } from "@components/Latex";
import type { EditorNodeProps } from "../../document/types";
import { useNdgEditorStore } from "../../controller/useNdgEditorStore";
import { NodeBody, NodeCard, NodeHeader } from "./shared";
import { Handle, Position } from "@xyflow/react";

export const CoefficientNode = (props: EditorNodeProps) => {
  const { data, type } = props;
  const duplicate = useNdgEditorStore(state => state.isDuplicateKey(data.key));
  if (type !== "coefficient") return null;

  return (
    <NodeCard duplicate={duplicate}>
      <Handle type="target" position={Position.Top} />
      <NodeHeader label={data.key} type="coefficient" />
      {data.symbol && (
        <NodeBody className="flex min-h-8 items-center justify-center px-2 py-1 text-sm">
          <Latex tex={data.symbol} />
        </NodeBody>
      )}
    </NodeCard>
  );
};
