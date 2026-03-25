import katex from "katex";
import "katex/dist/katex.min.css";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { ComponentProps } from "react";
import type { EditorFlowNode } from "../adapter";

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
      nodeId,
      nodeLabel,
      nodeType,
      nodeTypeLabel,
      nodeReference,
      nodeFormula = "-",
      onAddChild,
      onDelete,
      onEdit,
    },
  } = props;

  const showTargetHandle = nodeType !== "check" || canAcceptParent;
  const theme = nodeTypeThemes[nodeType];

  return (
    <NodeWrapper>
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
        <NodeKey>{nodeLabel}</NodeKey>
        <NodeDragHandle />
      </NodeHeader>
      <NodeType className={theme.textClass}>{nodeTypeLabel}</NodeType>
      {nodeReference && <NodeReference>{nodeReference}</NodeReference>}
      {nodeFormula && (
        <NodeFormula className={theme.formulaClass}>{nodeFormula}</NodeFormula>
      )}

      <NodeActions>
        {canAddChild && (
          <NodeActionButton onClick={() => onAddChild(nodeId)}>
            Add child
          </NodeActionButton>
        )}
        <NodeActionButton onClick={() => onEdit(nodeId)}>Edit</NodeActionButton>
        {canDelete && (
          <NodeActionButton tone="danger" onClick={() => onDelete(nodeId)}>
            Delete
          </NodeActionButton>
        )}
      </NodeActions>
    </NodeWrapper>
  );
};

const NodeWrapper = ({ children, ...rest }: ComponentProps<"div">) => (
  <div
    className="relative flex min-w-72 cursor-default flex-col gap-1 rounded-sm border border-slate-200 bg-white px-3 py-2  shadow-xl shadow-gray-200"
    {...rest}
  >
    {children}
  </div>
);

const NodeHeader = ({ children, ...rest }: ComponentProps<"div">) => (
  <div className="mb-0.5 flex items-start justify-between gap-2" {...rest}>
    {children}
  </div>
);

const NodeKey = ({ children }: ComponentProps<"p">) => (
  <p className="truncate text-sm font-bold">{children}</p>
);

const NodeDragHandle = ({ ...rest }: ComponentProps<"div">) => (
  <div
    aria-label="Drag node"
    className="w-6 h-4 ndg-node-drag-handle cursor-grab select-none bg-[radial-gradient(var(--color-gray-300)_1.35px,transparent_1px)] bg-size-[5px_5px] active:cursor-grabbing"
    title="Drag node"
    {...rest}
  />
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
  <p className="min-h-[0.65rem] text-[0.5rem] font-light text-gray-500">
    {children}
  </p>
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

const NodeActions = ({ children, ...rest }: ComponentProps<"div">) => (
  <div className="mt-2 flex flex-wrap gap-1.5" {...rest}>
    {children}
  </div>
);

const NodeActionButton = ({
  children,
  className,
  tone = "default",
  type = "button",
  ...rest
}: ComponentProps<"button"> & { tone?: "default" | "danger" }) => (
  <button
    type={type}
    className={`nodrag nopan rounded-sm border px-2 py-1 text-[11px] font-semibold transition-colors ${
      tone === "danger"
        ? "border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100"
        : "border-teal-800 bg-teal-700 text-white hover:border-teal-900 hover:bg-teal-800"
    } ${className ?? ""}`}
    {...rest}
  >
    {children}
  </button>
);
