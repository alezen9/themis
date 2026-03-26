import {
  BaseEdge,
  EdgeLabelRenderer,
  Position,
  getSmoothStepPath,
  type XYPosition,
  type EdgeProps,
} from "@xyflow/react";
import { useState, type ComponentProps } from "react";
import type { EditorFlowEdge } from "../adapter";
import { ConditionPopover } from "./ConditionPopover";

export const ConditionEdge = (props: EdgeProps<EditorFlowEdge>) => {
  const {
    data,
    markerEnd,
    selected,
    sourceX,
    sourceY,
    sourcePosition,
    style,
    targetX,
    targetY,
    targetPosition,
  } = props;

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [smoothPath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const routedPoints = data?.routedPoints ?? [];
  const edgePath = routedPoints.length >= 2 ? buildPolylinePath(routedPoints) : smoothPath;

  if (!data) {
    return <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />;
  }

  const hasCondition = Boolean(data.condition);
  const isHighlighted = Boolean(data.isHovered || selected);
  const showActions = Boolean(data.isHovered || selected || isPopoverOpen);
  const showChip = hasCondition || showActions;
  const chipPosition = getChipPosition({
    routedPoints: data.routedPoints,
    targetPosition,
    targetX,
    targetY,
  });
  const edgeStrokeColor = isHighlighted
    ? "#0f766e"
    : data.isUnreachable
      ? "#d97706"
      : (typeof style?.stroke === "string" ? style.stroke : "#64748b");
  const edgeStrokeWidth = isHighlighted ? 2.4 : 1.7;

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...(style ?? {}),
          stroke: edgeStrokeColor,
          strokeWidth: edgeStrokeWidth,
          transition: "stroke 150ms linear, opacity 150ms linear",
        }}
      />

      {showChip && (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan pointer-events-auto absolute z-30"
            style={{
              transform: `translate(-50%, -50%) translate(${chipPosition.x}px,${chipPosition.y}px)`,
            }}
          >
            <div
              className={`relative flex items-center gap-1 rounded-sm border px-1 py-1 shadow-sm transition-colors duration-150 ease-linear ${
                data.isUnreachable
                  ? "border-amber-300 bg-amber-50"
                  : "border-slate-300 bg-white"
              }`}
            >
              {data.conditionLabel && (
                <span className="max-w-[280px] text-[10px] leading-tight break-all text-slate-700">
                  {data.conditionLabel}
                </span>
              )}

              {showActions && (
                <>
                  <EdgeActionButton
                    aria-label={hasCondition ? "Edit condition" : "Add condition"}
                    onClick={(event) => {
                      event.stopPropagation();
                      setIsPopoverOpen((isOpen) => !isOpen);
                    }}
                    title={hasCondition ? "Edit condition" : "Add condition"}
                  >
                    {hasCondition ? <EditIcon /> : <PlusIcon />}
                  </EdgeActionButton>
                  <EdgeActionButton
                    aria-label="Detach edge"
                    onClick={(event) => {
                      event.stopPropagation();
                      data.onDisconnect(data.sourceId, data.targetId);
                      setIsPopoverOpen(false);
                    }}
                    title="Detach edge"
                    tone="danger"
                  >
                    <UnlinkIcon />
                  </EdgeActionButton>
                </>
              )}

              {isPopoverOpen && (
                <ConditionPopover
                  condition={data.condition}
                  onApply={(condition) => {
                    data.onApplyCondition(data.sourceId, data.targetId, condition);
                    setIsPopoverOpen(false);
                  }}
                  onClear={() => {
                    data.onClearCondition(data.sourceId, data.targetId);
                    setIsPopoverOpen(false);
                  }}
                  onClose={() => setIsPopoverOpen(false)}
                />
              )}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

const getChipPosition = (
  params: {
    routedPoints?: XYPosition[];
    targetPosition: Position;
    targetX: number;
    targetY: number;
  },
) => {
  const { routedPoints, targetPosition, targetX, targetY } = params;
  const lastPoint = routedPoints?.[routedPoints.length - 1];
  const previousPoint = routedPoints?.[routedPoints.length - 2];
  if (lastPoint && previousPoint) {
    const dx = lastPoint.x - previousPoint.x;
    const dy = lastPoint.y - previousPoint.y;
    const distance = Math.hypot(dx, dy);
    if (distance > 0) {
      const offset = 22;
      return {
        x: lastPoint.x - (dx / distance) * offset,
        y: lastPoint.y - (dy / distance) * offset,
      };
    }
  }

  if (targetPosition === Position.Top) {
    return { x: targetX, y: targetY - 22 };
  }
  if (targetPosition === Position.Bottom) {
    return { x: targetX, y: targetY + 22 };
  }
  if (targetPosition === Position.Left) {
    return { x: targetX - 22, y: targetY };
  }
  return { x: targetX + 22, y: targetY };
};

const buildPolylinePath = (points: XYPosition[]) => {
  const [firstPoint, ...restPoints] = points;
  if (!firstPoint) return "";

  return restPoints.reduce(
    (path, point) => `${path} L ${point.x} ${point.y}`,
    `M ${firstPoint.x} ${firstPoint.y}`,
  );
};

const EdgeActionButton = ({
  children,
  tone = "default",
  ...rest
}: ComponentProps<"button"> & { tone?: "default" | "danger" }) => (
  <button
    type="button"
    className={`nodrag nopan inline-flex h-5 w-5 items-center justify-center rounded-sm border transition-colors ${
      tone === "danger"
        ? "border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100"
        : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
    }`}
    {...rest}
  >
    {children}
  </button>
);

const EditIcon = () => (
  <svg
    aria-hidden="true"
    className="h-3 w-3"
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
    className="h-3 w-3"
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

const UnlinkIcon = () => (
  <svg
    aria-hidden="true"
    className="h-3 w-3"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1.8}
    viewBox="0 0 24 24"
  >
    <path d="M10 14L21 3" />
    <path d="M16 3h5v5" />
    <path d="M8 8l-5 5a4 4 0 0 0 6 6l5-5" />
  </svg>
);
