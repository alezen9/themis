import { IconPlus } from "@components/Icons";
import { Handle, Position } from "@xyflow/react";
import type { MouseEvent, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import { useNdgEditorModalStore } from "../../modals/useNdgEditorModalStore";
import { IconButton } from "@components/Button";

type NodeCardProps = { children: ReactNode };

export const NodeCard = (props: NodeCardProps) => {
  const { children } = props;

  return (
    <div
      className={twMerge(
        "w-48 p-1",
        "overflow-hidden rounded-sm border border-sand-300 bg-sand-50",
        "text-sand-900",
        "flex flex-col gap-1",
      )}
    >
      {children}
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
        "rounded-xs border border-sand-300 bg-white",
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
