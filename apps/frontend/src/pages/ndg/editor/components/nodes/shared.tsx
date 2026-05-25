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
