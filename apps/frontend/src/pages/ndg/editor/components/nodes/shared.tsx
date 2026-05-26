import { IconPlus } from "@components/Icons";
import { Handle, Position } from "@xyflow/react";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type NodeCardProps = { children: ReactNode };

export const NodeCard = (props: NodeCardProps) => {
  const { children } = props;

  return (
    <div
      className={twMerge(
        "w-48 px-2 py-1",
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
    <header className={twMerge("flex h-6 items-center justify-between")}>
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

export const NodeTargetHandle = () => {
  return (
    <Handle
      type="target"
      position={Position.Top}
      className={twMerge(
        "h-3 w-10 rounded-full border border-sand-300 bg-white",
        "opacity-80 transition-colors",
        "hover:border-sand-600 hover:bg-sand-100",
      )}
    />
  );
};

export const NodeAddChildHandle = () => {
  return (
    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 size-4 bg-envy-500 ring-1 ring-white text-white rounded-full grid place-content-center">
      <IconPlus className="size-3" />
      <Handle
        type="source"
        position={Position.Bottom}
        className={twMerge("translate-y-1")}
      />
    </div>
  );
};
