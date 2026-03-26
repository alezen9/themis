import katex from "katex";
import "katex/dist/katex.min.css";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { type ComponentProps } from "react";
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
      canAddChild,
      isUnreachable,
      nodeId,
      nodeLabel,
      nodeName,
      nodeType,
      nodeTypeLabel,
      nodeReference,
      nodeFormula,
      onAddChild,
      onEdit,
    },
  } = props;

  const showTargetHandle = nodeType !== "check";
  const theme = nodeTypeThemes[nodeType];

  return (
    <NodeWrapper isUnreachable={isUnreachable}>
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
          className="-bottom-5! h-3! w-3! border-slate-300! bg-white!"
        />
      )}

      <NodeHeader>
        <div>
          <NodeKey>{nodeLabel}</NodeKey>
          <NodeName>{nodeName}</NodeName>
        </div>
        <NodeIconButton
          aria-label="Edit node"
          onClick={() => onEdit(nodeId)}
          title="Edit node"
        >
          <EditIcon />
        </NodeIconButton>
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

const NodeWrapper = ({
  children,
  isUnreachable,
  ...rest
}: ComponentProps<"div"> & { isUnreachable: boolean }) => (
  <div
    className={`relative flex min-w-72 cursor-grab select-none flex-col gap-1 rounded-sm border px-3 py-2 shadow-xl shadow-gray-200 active:cursor-grabbing ${
      isUnreachable
        ? "border-amber-300 bg-amber-50/70"
        : "border-slate-200 bg-white"
    }`}
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
  <p className="text-sm font-bold">{children}</p>
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
  className,
  type = "button",
  ...rest
}: ComponentProps<"button">) => (
  <button
    type={type}
    className={`nodrag nopan inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm border border-slate-300 bg-white text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 ${className ?? ""}`}
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
