import katex from "katex";
import "katex/dist/katex.min.css";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useState, type ComponentProps } from "react";
import type { EditorFlowNode } from "../adapter";
import { ConditionPopover } from "./ConditionPopover";

const nodeTypeThemes = {
  check: {
    textClass: "text-red-700",
    formulaClass: "border-red-200 bg-red-50/70",
  },
  coefficient: {
    textClass: "text-teal-700",
    formulaClass: "border-teal-200 bg-teal-50/70",
  },
  constant: {
    textClass: "text-zinc-700",
    formulaClass: "border-zinc-300 bg-zinc-100/80",
  },
  derived: {
    textClass: "text-green-700",
    formulaClass: "border-green-200 bg-green-50/70",
  },
  formula: {
    textClass: "text-indigo-700",
    formulaClass: "border-indigo-200 bg-indigo-50/70",
  },
  table: {
    textClass: "text-orange-700",
    formulaClass: "border-orange-200 bg-orange-50/70",
  },
  "user-input": {
    textClass: "text-fuchsia-700",
    formulaClass: "border-fuchsia-200 bg-fuchsia-50/70",
  },
} as const;

export const NodeCard = (props: NodeProps<EditorFlowNode>) => {
  const {
    data: {
      canAcceptParent,
      canAddChild,
      canDelete,
      canEditIncomingCondition,
      incomingCondition,
      incomingConditionLabel,
      nodeId,
      nodeLabel,
      nodeName,
      nodeType,
      nodeTypeLabel,
      nodeReference,
      nodeFormula,
      onAddChild,
      onApplyIncomingCondition,
      onClearIncomingCondition,
      onDelete,
      onEdit,
    },
  } = props;

  const [isConditionPopoverOpen, setIsConditionPopoverOpen] = useState(false);
  const showTargetHandle = nodeType !== "check" || canAcceptParent;
  const theme = nodeTypeThemes[nodeType];
  const hasIncomingCondition = Boolean(incomingCondition);

  return (
    <NodeWrapper>
      {canEditIncomingCondition && hasIncomingCondition && (
        <NodeConditionPreview>{incomingConditionLabel}</NodeConditionPreview>
      )}
      {canEditIncomingCondition && (
        <div className="nodrag nopan absolute -top-3 left-1/2 -translate-x-1/2 z-30">
          <NodeConditionButton
            aria-label={
              hasIncomingCondition ? "Edit condition" : "Add condition"
            }
            onClick={() => setIsConditionPopoverOpen((current) => !current)}
            title={hasIncomingCondition ? "Edit condition" : "Add condition"}
          >
            {hasIncomingCondition ? <EditIcon /> : <PlusIcon />}
          </NodeConditionButton>
          {isConditionPopoverOpen && (
            <ConditionPopover
              condition={incomingCondition}
              onApply={(condition) =>
                onApplyIncomingCondition(nodeId, condition)
              }
              onClear={() => onClearIncomingCondition(nodeId)}
              onClose={() => setIsConditionPopoverOpen(false)}
            />
          )}
        </div>
      )}

      {showTargetHandle && (
        <Handle
          type="target"
          position={Position.Top}
          className="h-2.5! w-2.5! border-slate-300! bg-white!"
        />
      )}
      {canAddChild && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="h-2.5! w-2.5! border-slate-300! bg-white!"
        />
      )}

      <NodeHeader>
        <div>
          <NodeKey>{nodeLabel}</NodeKey>
          <NodeName>{nodeName}</NodeName>
        </div>
        <div className="flex items-center gap-1">
          <NodeIconButton
            aria-label="Edit node"
            onClick={() => onEdit(nodeId)}
            title="Edit node"
          >
            <EditIcon />
          </NodeIconButton>
          {canDelete && (
            <NodeIconButton
              aria-label="Delete node"
              onClick={() => onDelete(nodeId)}
              title="Delete node"
              tone="danger"
            >
              <DeleteIcon />
            </NodeIconButton>
          )}
        </div>
      </NodeHeader>
      <NodeType className={theme.textClass}>{nodeTypeLabel}</NodeType>
      <NodeReference>{nodeReference}</NodeReference>
      {nodeFormula?.trim() && (
        <NodeFormula className={theme.formulaClass}>{nodeFormula}</NodeFormula>
      )}
      {canAddChild && <NodeAddChildButton onClick={() => onAddChild(nodeId)} />}
    </NodeWrapper>
  );
};

const NodeWrapper = ({ children, ...rest }: ComponentProps<"div">) => (
  <div
    className="relative flex min-w-72 cursor-grab select-none flex-col gap-1 rounded-sm border border-slate-200 bg-white px-3 py-2 shadow-xl shadow-gray-200 active:cursor-grabbing"
    {...rest}
  >
    {children}
  </div>
);

const NodeConditionPreview = ({ children, ...rest }: ComponentProps<"div">) => (
  <div
    className="pointer-events-none absolute bottom-[115%] left-1/2 z-20 mb-2 w-fit max-w-[calc(100%-0.5rem)] -translate-x-1/2 rounded-sm border border-slate-300 bg-white px-2 py-1 text-[11px] leading-tight whitespace-pre-wrap break-words text-slate-700 shadow-sm shadow-slate-300/40"
    {...rest}
  >
    {children}
  </div>
);

const NodeConditionButton = ({
  children,
  ...rest
}: ComponentProps<"button">) => (
  <button
    type="button"
    className="nodrag nopan inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm shadow-slate-300/30 transition-colors hover:border-slate-400 hover:bg-slate-50"
    {...rest}
  >
    {children}
  </button>
);

const NodeHeader = ({ children, ...rest }: ComponentProps<"div">) => (
  <div className="mb-0.5 flex items-start justify-between gap-2" {...rest}>
    {children}
  </div>
);

const NodeKey = ({ children }: ComponentProps<"p">) => (
  <p className="truncate text-sm font-bold">{children}</p>
);

const NodeName = ({ children }: ComponentProps<"p">) => (
  <p className="text-[0.7rem] font-medium text-slate-500">{children}</p>
);

const NodeType = ({ children, className, ...rest }: ComponentProps<"p">) => (
  <p
    className={`text-[0.65rem] font-semibold uppercase tracking-widest ${className ?? ""}`}
    {...rest}
  >
    {children}
  </p>
);

const NodeReference = ({ children }: ComponentProps<"p">) => (
  <p className="text-[0.6rem] font-light text-gray-500">{children}</p>
);

const NodeFormula = ({ children, className = "" }: ComponentProps<"span">) => {
  const html = katex.renderToString(children as string, {
    displayMode: true,
    throwOnError: false,
  });
  return (
    <div className={`rounded-xs border p-2 ${className}`}>
      <span
        className="inline-block min-w-max text-[12px] leading-none [&_.katex-display]:my-0 [&_.katex]:text-inherit"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};

const NodeAddChildButton = ({ ...rest }: ComponentProps<"button">) => (
  <button
    type="button"
    aria-label="Add child"
    title="Add child"
    className="nodrag nopan absolute -bottom-3 left-1/2 z-10 inline-flex h-6 w-6 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full border border-teal-800 bg-teal-700 text-white shadow-sm transition-colors hover:border-teal-900 hover:bg-teal-800"
    {...rest}
  >
    <PlusIcon />
  </button>
);

const NodeIconButton = ({
  children,
  tone = "default",
  className,
  type = "button",
  ...rest
}: ComponentProps<"button"> & { tone?: "default" | "danger" }) => (
  <button
    type={type}
    className={`nodrag nopan inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm border transition-colors ${
      tone === "danger"
        ? "border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100"
        : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
    } ${className ?? ""}`}
    {...rest}
  >
    {children}
  </button>
);

const EditIcon = () => (
  <svg
    aria-hidden="true"
    className="h-3.5 w-3.5"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1.8}
    viewBox="0 0 24 24"
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
  </svg>
);

const DeleteIcon = () => (
  <svg
    aria-hidden="true"
    className="h-3.5 w-3.5"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1.8}
    viewBox="0 0 24 24"
  >
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
);

const PlusIcon = () => (
  <svg
    aria-hidden="true"
    className="h-3.5 w-3.5"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);
