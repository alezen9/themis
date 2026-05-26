import { Latex } from "@components/Latex";

import type { EditorNodeProps } from "../../document/types";
import { NodeBody, NodeCard, NodeHeader, NodeTargetHandle } from "./shared";

export const ConstantNode = (props: EditorNodeProps) => {
  const { data, type } = props;
  if (type !== "constant") return null;

  return (
    <NodeCard>
      <NodeHeader label={data.key} type="const" />

      {data.symbol && (
        <NodeBody className="flex min-h-8 items-center justify-center px-2 py-1 text-sm">
          <Latex tex={data.symbol} />
        </NodeBody>
      )}

      <NodeTargetHandle />
    </NodeCard>
  );
};
