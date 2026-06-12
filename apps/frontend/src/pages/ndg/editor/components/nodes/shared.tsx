import { IconPlus, IconWarning } from "@components/Icons";
import { Handle, Position } from "@xyflow/react";
import type { MouseEvent, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import { useNdgEditorModalStore } from "../modals/useNdgEditorModalStore";
import { useNdgEditorStore } from "../../controller/useNdgEditorStore";
import { IconButton } from "@components/Button";
import type { EditorNodeInput } from "../../document/editorNodeSchema";

type NodeColorKind = EditorNodeInput["type"] | "select";

type NodeStyle = {
  label: string;
  cardClassName: string;
  badgeClassName: string;
};

const NODE_STYLES: Record<NodeColorKind, NodeStyle> = {
  select: {
    label: "select",
    cardClassName: "border-sky-200 bg-sky-50 text-sky-900",
    badgeClassName: "bg-sky-600",
  },
  "user-input": {
    label: "input",
    cardClassName: "border-emerald-200 bg-emerald-50 text-emerald-900",
    badgeClassName: "bg-emerald-600",
  },
  formula: {
    label: "formula",
    cardClassName: "border-violet-200 bg-violet-50 text-violet-900",
    badgeClassName: "bg-violet-600",
  },
  check: {
    label: "check",
    cardClassName: "border-amber-200 bg-amber-50 text-amber-900",
    badgeClassName: "bg-amber-600",
  },
  coefficient: {
    label: "coefficient",
    cardClassName: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-900",
    badgeClassName: "bg-fuchsia-600",
  },
  table: {
    label: "table",
    cardClassName: "border-teal-200 bg-teal-50 text-teal-900",
    badgeClassName: "bg-teal-600",
  },
  constant: {
    label: "const",
    cardClassName: "border-stone-200 bg-stone-50 text-stone-900",
    badgeClassName: "bg-stone-600",
  },
};

const ERROR_CARD = "border-red-400 bg-red-100 text-red-900";
const ERROR_BADGE = "bg-red-600";

type NodeCardProps = {
  children: ReactNode;
  nodeId: string;
  nodeKey: string;
  kind: NodeColorKind;
  label: string;
};

export const NodeCard = (props: NodeCardProps) => {
  const { children, nodeId, nodeKey, kind, label } = props;
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

  const errored = reasons.length > 0;
  const style = NODE_STYLES[kind];

  return (
    <div
      className={twMerge(
        "w-48 p-1",
        "overflow-hidden rounded-sm border",
        "flex flex-col gap-1",
        errored ? ERROR_CARD : style.cardClassName,
      )}
    >
      <NodeHeader
        label={label}
        badgeLabel={style.label}
        badgeClassName={errored ? ERROR_BADGE : style.badgeClassName}
      />
      {children}
      {errored && (
        <p className="flex items-center gap-1 px-0.5 text-[10px] leading-none text-red-700">
          <IconWarning className="size-3 shrink-0" />
          {reasons.join(" · ")}
        </p>
      )}
    </div>
  );
};

type NodeHeaderProps = {
  label: string;
  badgeLabel: string;
  badgeClassName: string;
};

const NodeHeader = (props: NodeHeaderProps) => {
  const { label, badgeLabel, badgeClassName } = props;

  return (
    <header className="flex h-4 items-center justify-between">
      <h2 className="truncate text-xs leading-none">{label}</h2>
      <span
        className={twMerge(
          "rounded-xs px-1 font-fredoka text-[10px] uppercase tracking-widest text-white",
          badgeClassName,
        )}
      >
        {badgeLabel}
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
