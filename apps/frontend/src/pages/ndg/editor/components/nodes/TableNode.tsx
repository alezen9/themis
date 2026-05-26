import type { EditorNodeProps } from "../../document/types";
import {
  NodeAddChildHandle,
  NodeBody,
  NodeCard,
  NodeHeader,
  NodeTargetHandle,
} from "./shared";

export const TableNode = (props: EditorNodeProps) => {
  const { type, data } = props;
  if (type !== "table") return null;

  return (
    <NodeCard>
      <NodeHeader label={data.key} type="table" />

      {data.source && (
        <NodeBody className="truncate px-2 py-1 text-[10px] text-slate-500">
          {data.source}
        </NodeBody>
      )}

      <NodeAddChildHandle />
      <NodeTargetHandle />
    </NodeCard>
  );
};
