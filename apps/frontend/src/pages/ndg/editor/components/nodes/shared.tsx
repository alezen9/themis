import { IconPlus, IconWarning } from "@components/Icons";
import { Handle, Position } from "@xyflow/react";
import type { MouseEvent, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import { useNdgEditorModalStore } from "../modals/useNdgEditorModalStore";
import { useNdgEditorStore } from "../../controller/useNdgEditorStore";
import { IconButton } from "@components/Button";

type NodeCardProps = { children: ReactNode; nodeId: string; nodeKey: string };

export const NodeCard = (props: NodeCardProps) => {
  const { children, nodeId, nodeKey } = props;
  const isDuplicateKey = useNdgEditorStore(state =>
    state.isDuplicateKey(nodeKey),
  );
  const isInvalid = useNdgEditorStore(state => state.isInvalidNode(nodeId));
  const isUnreachable = useNdgEditorStore(state =>
    state.isUnreachableNode(nodeId),
  );

  const reasons: string[] = [];
  if (isDuplicateKey) reasons.push("duplicate key");
  if (isInvalid) reasons.push("incomplete");
  if (isUnreachable) reasons.push("unreachable");

  return (
    <div
      className={twMerge(
        "w-48 p-1",
        "overflow-hidden rounded-sm border border-sand-300 bg-sand-50",
        "text-sand-900",
        "flex flex-col gap-1",
        reasons.length > 0 && "border-red-300 bg-red-50 text-red-900",
      )}
    >
      {children}
      {reasons.length > 0 && (
        <p className="flex items-center gap-1 px-0.5 text-[10px] leading-none text-red-700">
          <IconWarning className="size-3 shrink-0" />
          {reasons.join(" · ")}
        </p>
      )}
    </div>
  );
};

type NodeHeaderProps = { label: string; type: string };

export const NodeHeader = (props: NodeHeaderProps) => {
  const { label, type } = props;

  return (
    <header className={twMerge("flex h-4 items-center justify-between")}>
      <h2 className="truncate text-xs leading-none">{label}</h2>
      <span className="rounded-xs bg-sand-800 px-1 font-fredoka text-[10px] uppercase tracking-widest text-white">
        {type}
      </span>
    </header>
  );
};

type NodeBodyProps = { children: ReactNode; className?: string };

export const NodeBody = (props: NodeBodyProps) => {
  const { children, className } = props;

  return (
    <div
      className={twMerge(
        "flex items-center justify-center",
        "rounded-xs border border-sand-300 bg-white",
        "min-h-12 text-sm",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const NodeAddChildHandle = (props: { sourceNodeId: string }) => {
  const { sourceNodeId } = props;
  const openModal = useNdgEditorModalStore(state => state.openModal);

  const onClick = (e: MouseEvent) => {
    e.stopPropagation();
    openModal({ mode: "create-node", sourceNodeId });
  };

  return (
    <>
      <IconButton
        className="nodrag absolute -bottom-2 left-1/2 grid size-4 -translate-x-1/2 bg-envy-500 ring-1 ring-white"
        onClick={onClick}
      >
        <IconPlus className="size-3" />
      </IconButton>
      <Handle
        type="source"
        position={Position.Bottom}
        className="translate-y-3"
      />
    </>
  );
};
