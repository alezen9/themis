import katex from "katex";
import "katex/dist/katex.min.css";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { type ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import type { EditorFlowNode } from "../config/adapter";

const nodeTypeThemes = {
  check: {
    textClass: "text-red-700",
    formulaClass: "border-red-100 bg-red-50/60",
  },
  coefficient: {
    textClass: "text-envy-700",
    formulaClass: "border-envy-100 bg-envy-50/60",
  },
  constant: {
    textClass: "text-slate-600",
    formulaClass: "border-slate-200 bg-slate-50",
  },
  formula: {
    textClass: "text-sand-800",
    formulaClass: "border-sand-200 bg-sand-50",
  },
  table: {
    textClass: "text-sand-700",
    formulaClass: "border-sand-200 bg-sand-50",
  },
  "user-input": {
    textClass: "text-slate-700",
    formulaClass: "border-slate-200 bg-slate-50",
  },
} as const;

export const NodeCard = (props: NodeProps<EditorFlowNode>) => {
  const {
    data: {
      canAddChild,
      canDelete,
      isUnreachable,
      nodeId,
      nodeLabel,
      nodeName,
      nodeType,
      nodeTypeLabel,
      nodeReference,
      nodeFormula,
      onAddChild,
      onDelete,
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
        <div className="flex items-center gap-1.5">
          {canDelete ? (
            <NodeIconButton
              aria-label="Delete node"
              className="border-red-200 text-red-700 hover:border-red-300 hover:bg-red-50"
              onClick={() => onDelete(nodeId)}
              title="Delete node"
            >
              <TrashIcon />
            </NodeIconButton>
          ) : null}
          <NodeIconButton
            aria-label="Edit node"
            onClick={() => onEdit(nodeId)}
            title="Edit node"
          >
            <EditIcon />
          </NodeIconButton>
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

const NodeWrapper = ({
  children,
  isUnreachable,
  ...rest
}: ComponentProps<"div"> & { isUnreachable: boolean }) => (
  <div
    className={twMerge(
      "relative flex min-w-72 cursor-grab select-none flex-col gap-1 rounded-sm border px-3 py-2",
      "shadow-sm shadow-sand-300/40 active:cursor-grabbing",
      isUnreachable
        ? "border-amber-300 bg-amber-50/70"
        : "border-sand-200 bg-white",
    )}
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
  <p className="text-sm font-medium text-slate-950">{children}</p>
);

const NodeName = ({ children }: ComponentProps<"p">) => (
  <p className="text-[0.7rem] font-light text-slate-500">{children}</p>
);

const NodeType = ({ children, className, ...rest }: ComponentProps<"p">) => (
  <p
    className={twMerge(
      "text-[0.65rem] font-medium uppercase tracking-widest",
      className,
    )}
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
    <div className={twMerge("rounded-xs border p-2", className)}>
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
    className="nodrag nopan absolute -bottom-3 left-1/2 z-10 inline-flex h-6 w-6 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full border border-envy-700 bg-envy-700 text-white shadow-sm transition-colors hover:border-envy-800 hover:bg-envy-800"
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
    className={twMerge(
      "nodrag nopan inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm border",
      "border-sand-300 bg-white text-slate-700 transition-colors hover:border-sand-400 hover:bg-sand-50",
      className,
    )}
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

const TrashIcon = () => (
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
    <path d="M8 6V4.5A1.5 1.5 0 0 1 9.5 3h5A1.5 1.5 0 0 1 16 4.5V6" />
    <path d="M6.5 6l1 13a1.5 1.5 0 0 0 1.49 1.38h6.02a1.5 1.5 0 0 0 1.49-1.38l1-13" />
    <path d="M10 10.5v6" />
    <path d="M14 10.5v6" />
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
