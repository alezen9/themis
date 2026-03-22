import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import {
  getDefaultSelectedCheckId,
  type BranchStatus,
  type NodeExecutionStatus,
  type VerificationCheckStatus,
  type VerificationDebuggerCacheEntry,
  type VerificationDebuggerCheck,
  type VerificationDebuggerCheckDetail,
  type VerificationDebuggerContextGroup,
  type VerificationDebuggerTreeNode,
  type VerificationDebuggerTraceItem,
} from "./verification-debugger-model";

type VerificationDebuggerRawJsonSection = {
  id: string;
  title: string;
  value: unknown;
};

export type VerificationDebuggerAdapter = {
  title: string;
  subtitle?: string;
  warning?: string | null;
  checks: VerificationDebuggerCheck[];
  runContextGroups: VerificationDebuggerContextGroup[];
  rawJsonSections: VerificationDebuggerRawJsonSection[];
  emptyState?: string;
};

type CheckFilter = "all" | "attention" | "passed" | "not-applicable";
type BottomPanelTab = "context" | "raw-json";

const FILTER_LABELS: Record<CheckFilter, string> = {
  all: "All",
  attention: "Attention",
  passed: "Passed",
  "not-applicable": "N/A",
};

const formatScalar = (value: unknown) => {
  if (value === undefined) return "—";
  if (typeof value === "number") {
    return Number.isInteger(value) ? value.toString() : value.toFixed(6);
  }
  if (typeof value === "string") return value;
  return JSON.stringify(value);
};

function MathFormula({
  tex,
  className,
  display = false,
}: {
  tex: string;
  className?: string;
  display?: boolean;
}) {
  try {
    const html = katex.renderToString(tex, {
      displayMode: display,
      throwOnError: false,
    });
    return (
      <span
        className={className}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch {
    return <code className={className}>{tex}</code>;
  }
}

function FormulaBlock({
  tex,
  label,
  className,
  display = false,
  muted = false,
}: {
  tex?: string;
  label?: string;
  className?: string;
  display?: boolean;
  muted?: boolean;
}) {
  if (!tex) {
    return <div className="text-xs text-gray-400">—</div>;
  }

  return (
    <div
      className={`rounded border px-2 py-1 ${
        muted
          ? "border-slate-200 bg-slate-100/80 text-slate-500"
          : "border-slate-200 bg-white/80 text-slate-800"
      }`}
    >
      {label ? (
        <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </div>
      ) : null}
      <div className="overflow-x-auto overflow-y-hidden">
        <MathFormula
          tex={tex}
          display={display}
          className={
            className ??
            "inline-block min-w-max text-[13px] leading-none [&_.katex]:text-inherit"
          }
        />
      </div>
    </div>
  );
}

const escapeTexText = (value: string) =>
  value.replace(/\\/g, "\\textbackslash ").replace(/[{}]/g, "");

const formatTexScalar = (value: string | number | undefined) => {
  if (value === undefined) return undefined;
  if (typeof value === "number") {
    return Number.isInteger(value)
      ? value.toString()
      : Number(value.toFixed(6)).toString();
  }
  return `\\text{${escapeTexText(value)}}`;
};

const getNodeEquationTex = (node: VerificationDebuggerTreeNode) => {
  const parts: string[] = [];
  const formula = node.verificationExpression ?? node.expression;
  const valueTex = formatTexScalar(node.rawValue);

  if (node.symbol) {
    parts.push(node.symbol);
  }

  if (formula && formula !== node.symbol) {
    parts.push(formula);
  }

  if (valueTex) {
    parts.push(node.unit ? `${valueTex}\\,${node.unit}` : valueTex);
  }

  return parts.length > 0 ? parts.join(" = ") : undefined;
};

const getNodeLabel = (node: VerificationDebuggerTreeNode) => node.key || node.id;

const getNodeTypeTheme = (type: VerificationDebuggerTreeNode["type"]) => {
  switch (type) {
    case "check":
      return {
        accent: "#dc2626",
        textClass: "text-red-700",
        panelClass: "border-red-200 bg-red-50/70",
      };
    case "formula":
      return {
        accent: "#4338ca",
        textClass: "text-indigo-700",
        panelClass: "border-indigo-200 bg-indigo-50/70",
      };
    case "derived":
      return {
        accent: "#15803d",
        textClass: "text-green-700",
        panelClass: "border-green-200 bg-green-50/70",
      };
    case "table":
      return {
        accent: "#ea580c",
        textClass: "text-orange-700",
        panelClass: "border-orange-200 bg-orange-50/70",
      };
    case "coefficient":
      return {
        accent: "#0f766e",
        textClass: "text-teal-700",
        panelClass: "border-teal-200 bg-teal-50/70",
      };
    case "constant":
      return {
        accent: "#52525b",
        textClass: "text-zinc-700",
        panelClass: "border-zinc-300 bg-zinc-100/80",
      };
    case "user-input":
      return {
        accent: "#c026d3",
        textClass: "text-fuchsia-700",
        panelClass: "border-fuchsia-200 bg-fuchsia-50/70",
      };
  }
};

const CONTEXT_GROUP_THEMES = [
  {
    headerClass: "bg-sky-100/80 text-sky-950",
    rowClass: "bg-sky-50/40",
  },
  {
    headerClass: "bg-emerald-100/80 text-emerald-950",
    rowClass: "bg-emerald-50/35",
  },
  {
    headerClass: "bg-amber-100/80 text-amber-950",
    rowClass: "bg-amber-50/35",
  },
  {
    headerClass: "bg-rose-100/80 text-rose-950",
    rowClass: "bg-rose-50/35",
  },
  {
    headerClass: "bg-violet-100/80 text-violet-950",
    rowClass: "bg-violet-50/35",
  },
] as const;

const getStatusBadgeClass = (status: VerificationCheckStatus) => {
  switch (status) {
    case "passed":
      return "border-green-200 bg-green-50 text-green-700";
    case "failed":
      return "border-red-200 bg-red-50 text-red-700";
    case "not-applicable":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "error":
      return "border-orange-200 bg-orange-50 text-orange-700";
  }
};

const filterChecks = (
  checks: readonly VerificationDebuggerCheck[],
  filter: CheckFilter,
) => {
  switch (filter) {
    case "attention":
      return checks.filter(
        (check) => check.status === "failed" || check.status === "error",
      );
    case "passed":
      return checks.filter((check) => check.status === "passed");
    case "not-applicable":
      return checks.filter((check) => check.status === "not-applicable");
    default:
      return [...checks];
  }
};

const countChecks = (
  checks: readonly VerificationDebuggerCheck[],
  filter: CheckFilter,
) => filterChecks(checks, filter).length;

const formatReferences = (
  meta: Record<string, string | undefined> | undefined,
) => {
  if (!meta) return null;
  return Object.entries(meta)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}: ${value}`)
    .join(" | ");
};

const collectDefaultExpandedNodeIds = (
  node: VerificationDebuggerTreeNode,
  isRoot = true,
) => {
  const expandedNodeIds = new Set<string>();
  if (isRoot || node.isActivePath) {
    expandedNodeIds.add(node.id);
  }

  for (const edge of node.children) {
    const childDefaults = collectDefaultExpandedNodeIds(edge.child, false);
    for (const childId of childDefaults) {
      expandedNodeIds.add(childId);
    }
  }

  return expandedNodeIds;
};

const collectCollapsedNodeIds = (node: VerificationDebuggerTreeNode) =>
  new Set<string>([node.id]);

type DiagramIncomingEdge = {
  status: BranchStatus;
  conditionLabel?: string;
  parentName: string;
};

type DiagramNodePlacement = {
  node: VerificationDebuggerTreeNode;
  x: number;
  y: number;
  hasChildren: boolean;
  isExpanded: boolean;
  incomingEdge?: DiagramIncomingEdge;
};

type DiagramEdgePlacement = {
  id: string;
  path: string;
  labelX: number;
  labelY: number;
  status: BranchStatus;
  conditionLabel?: string;
};

type TreeDiagramLayout = {
  nodes: DiagramNodePlacement[];
  nodeById: Map<string, DiagramNodePlacement>;
  edges: DiagramEdgePlacement[];
  width: number;
  height: number;
};

const DIAGRAM_NODE_WIDTH = 270;
const DIAGRAM_NODE_HEIGHT = 176;
const DIAGRAM_HORIZONTAL_GAP = 56;
const DIAGRAM_VERTICAL_GAP = 124;
const DIAGRAM_PADDING = 24;
const MIN_DIAGRAM_ZOOM = 0.35;
const MAX_DIAGRAM_ZOOM = 2;
const DIAGRAM_ZOOM_STEP = 0.1;
const DIAGRAM_WHEEL_ZOOM_SENSITIVITY = 0.004;

const clampDiagramZoom = (value: number) =>
  Math.min(MAX_DIAGRAM_ZOOM, Math.max(MIN_DIAGRAM_ZOOM, value));

type GestureEventLike = Event & {
  clientX: number;
  clientY: number;
  scale: number;
};

type GestureDocument = Document & {
  addEventListener: (
    type: "gesturestart" | "gesturechange" | "gestureend",
    listener: EventListener,
    options?: boolean | AddEventListenerOptions,
  ) => void;
  removeEventListener: (
    type: "gesturestart" | "gesturechange" | "gestureend",
    listener: EventListener,
    options?: boolean | EventListenerOptions,
  ) => void;
};

const getVisibleChildren = (
  node: VerificationDebuggerTreeNode,
  expandedNodeIds: ReadonlySet<string>,
) => (expandedNodeIds.has(node.id) ? node.children : []);

const buildTreeDiagramLayout = (
  root: VerificationDebuggerTreeNode,
  expandedNodeIds: ReadonlySet<string>,
): TreeDiagramLayout => {
  const subtreeWidths = new Map<string, number>();
  const nodes: DiagramNodePlacement[] = [];
  const edges: DiagramEdgePlacement[] = [];
  let maxBottom = DIAGRAM_NODE_HEIGHT + DIAGRAM_PADDING;

  const measureSubtree = (node: VerificationDebuggerTreeNode): number => {
    const visibleChildren = getVisibleChildren(node, expandedNodeIds);

    if (visibleChildren.length === 0) {
      subtreeWidths.set(node.id, DIAGRAM_NODE_WIDTH);
      return DIAGRAM_NODE_WIDTH;
    }

    const childrenWidth = visibleChildren.reduce((totalWidth, edge, index) => {
      const childWidth = measureSubtree(edge.child);
      return (
        totalWidth +
        childWidth +
        (index > 0 ? DIAGRAM_HORIZONTAL_GAP : 0)
      );
    }, 0);
    const subtreeWidth = Math.max(DIAGRAM_NODE_WIDTH, childrenWidth);

    subtreeWidths.set(node.id, subtreeWidth);
    return subtreeWidth;
  };

  const placeNode = (
    node: VerificationDebuggerTreeNode,
    left: number,
    top: number,
    incomingEdge?: DiagramIncomingEdge,
  ) => {
    const subtreeWidth = subtreeWidths.get(node.id) ?? DIAGRAM_NODE_WIDTH;
    const nodeX = left + (subtreeWidth - DIAGRAM_NODE_WIDTH) / 2;
    const hasChildren = node.children.length > 0;
    const isExpanded = expandedNodeIds.has(node.id);

    nodes.push({
      node,
      x: nodeX,
      y: top,
      hasChildren,
      isExpanded,
      incomingEdge,
    });
    maxBottom = Math.max(maxBottom, top + DIAGRAM_NODE_HEIGHT);

    const visibleChildren = getVisibleChildren(node, expandedNodeIds);
    let cursor = left;

    for (const edge of visibleChildren) {
      const childSubtreeWidth =
        subtreeWidths.get(edge.child.id) ?? DIAGRAM_NODE_WIDTH;
      const childX = cursor + (childSubtreeWidth - DIAGRAM_NODE_WIDTH) / 2;
      const childTop = top + DIAGRAM_NODE_HEIGHT + DIAGRAM_VERTICAL_GAP;
      const parentCenterX = nodeX + DIAGRAM_NODE_WIDTH / 2;
      const childCenterX = childX + DIAGRAM_NODE_WIDTH / 2;
      const startY = top + DIAGRAM_NODE_HEIGHT;
      const endY = childTop;
      const elbowY = startY + DIAGRAM_VERTICAL_GAP / 2;

      edges.push({
        id: `${node.id}:${edge.child.id}`,
        path: [
          `M ${parentCenterX} ${startY}`,
          `V ${elbowY}`,
          `H ${childCenterX}`,
          `V ${endY}`,
        ].join(" "),
        labelX:
          parentCenterX === childCenterX
            ? childCenterX + 18
            : (parentCenterX + childCenterX) / 2,
        labelY: elbowY - 10,
        status: edge.status,
        conditionLabel: edge.conditionLabel,
      });

      placeNode(edge.child, cursor, childTop, {
        status: edge.status,
        conditionLabel: edge.conditionLabel,
        parentName: node.name,
      });
      cursor += childSubtreeWidth + DIAGRAM_HORIZONTAL_GAP;
    }
  };

  const totalWidth = measureSubtree(root);
  placeNode(root, DIAGRAM_PADDING, DIAGRAM_PADDING);

  return {
    nodes,
    nodeById: new Map(nodes.map((placement) => [placement.node.id, placement])),
    edges,
    width: totalWidth + DIAGRAM_PADDING * 2,
    height: maxBottom + DIAGRAM_PADDING,
  };
};

const getDiagramNodeCardClass = (
  status: NodeExecutionStatus,
  isActivePath: boolean,
) => {
  const statusClass =
    status === "executed"
      ? "border-sky-500 bg-white"
      : status === "skipped"
        ? "border-slate-200 bg-slate-100 opacity-35 saturate-0"
        : "border-slate-200 bg-slate-100 opacity-20 saturate-0";
  const emphasisClass = isActivePath
    ? "shadow-[0_0_0_1px_rgba(14,165,233,0.18)] shadow-sky-100"
    : "shadow-none";

  return `${statusClass} ${emphasisClass}`;
};

const getEdgeStroke = (status: BranchStatus) => {
  switch (status) {
    case "taken":
      return {
        color: "#0284c7",
        markerId: "tree-diagram-arrowhead-taken",
        strokeWidth: 2.5,
        opacity: 1,
        strokeDasharray: undefined,
      };
    case "skipped":
      return {
        color: "#94a3b8",
        markerId: "tree-diagram-arrowhead-skipped",
        strokeWidth: 1.5,
        opacity: 0.22,
        strokeDasharray: "5 4",
      };
    case "unevaluated":
      return {
        color: "#ea580c",
        markerId: "tree-diagram-arrowhead-unevaluated",
        strokeWidth: 1.75,
        opacity: 0.9,
        strokeDasharray: "5 4",
      };
    case "not-reached":
      return {
        color: "#94a3b8",
        markerId: "tree-diagram-arrowhead-muted",
        strokeWidth: 1.25,
        opacity: 0.12,
        strokeDasharray: "5 4",
      };
  }
};

const getEdgeLabelCardClass = (status: BranchStatus) => {
  switch (status) {
    case "taken":
      return "border-sky-200 bg-white/96 text-sky-900";
    case "skipped":
      return "border-slate-200 bg-slate-100/96 text-slate-500 opacity-65";
    case "unevaluated":
      return "border-orange-200 bg-orange-50/95 text-orange-900";
    case "not-reached":
      return "border-slate-200 bg-slate-100/90 text-slate-400 opacity-45";
  }
};

function CheckList({
  checks,
  selectedCheckId,
  onSelectCheck,
}: {
  checks: readonly VerificationDebuggerCheck[];
  selectedCheckId: number | null;
  onSelectCheck: (checkId: number) => void;
}) {
  if (checks.length === 0) {
    return (
      <div className="rounded border border-dashed px-3 py-4 text-sm text-gray-500">
        No checks match the current filter.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {checks.map((check, index) => (
        <button
          key={check.checkId}
          type="button"
          onClick={() => onSelectCheck(check.checkId)}
          aria-pressed={selectedCheckId === check.checkId}
          className={`w-full rounded border px-3 py-2 text-left transition ${
            selectedCheckId === check.checkId
              ? "border-sky-400 bg-sky-50"
              : "border-gray-200 bg-white hover:bg-gray-50"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-medium text-gray-500">
                Check {index + 1}
              </div>
              <div className="font-medium text-gray-900">{check.name}</div>
            </div>
            <span
              className={`rounded border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${getStatusBadgeClass(check.status)}`}
            >
              {check.status}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
            <span>Check ID {check.checkId}</span>
            <span>ratio {check.ratioLabel}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

function TreeInspector({
  detail,
}: {
  detail: VerificationDebuggerCheckDetail;
}) {
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(
    () => (detail.root ? collectDefaultExpandedNodeIds(detail.root) : new Set()),
  );
  const [diagramZoom, setDiagramZoom] = useState(1);
  const diagramViewportRef = useRef<HTMLDivElement | null>(null);
  const diagramZoomRef = useRef(1);
  const diagramHoveringRef = useRef(false);
  const pinchZoomSessionRef = useRef<{ startZoom: number } | null>(null);
  const pendingZoomAnchorRef = useRef<{
    anchorX: number;
    anchorY: number;
    previousZoom: number;
  } | null>(null);

  useEffect(() => {
    setExpandedNodeIds(
      detail.root ? collectDefaultExpandedNodeIds(detail.root) : new Set(),
    );
  }, [detail.checkId, detail.root]);

  useEffect(() => {
    diagramZoomRef.current = diagramZoom;
  }, [diagramZoom]);

  const diagramLayout = useMemo(
    () =>
      detail.root ? buildTreeDiagramLayout(detail.root, expandedNodeIds) : null,
    [detail.root, expandedNodeIds],
  );

  if (!detail.root || !diagramLayout) {
    return (
      <div className="rounded border border-dashed px-3 py-4 text-sm text-gray-500">
        Node tree is not available for this verification.
      </div>
    );
  }

  const scaledWidth = diagramLayout.width * diagramZoom;
  const scaledHeight = diagramLayout.height * diagramZoom;

  const applyDiagramZoom = (
    targetZoom: number,
    anchor?: { x: number; y: number },
  ) => {
    const previousZoom = diagramZoomRef.current;
    const nextZoom = clampDiagramZoom(targetZoom);
    if (nextZoom === previousZoom) return;

    const viewport = diagramViewportRef.current;
    if (viewport) {
      pendingZoomAnchorRef.current = {
        anchorX: anchor?.x ?? viewport.clientWidth / 2,
        anchorY: anchor?.y ?? viewport.clientHeight / 2,
        previousZoom,
      };
    }

    diagramZoomRef.current = nextZoom;
    setDiagramZoom(nextZoom);
  };

  useLayoutEffect(() => {
    const viewport = diagramViewportRef.current;
    const pendingAnchor = pendingZoomAnchorRef.current;
    if (!viewport || !pendingAnchor) return;

    const contentX =
      (viewport.scrollLeft + pendingAnchor.anchorX) / pendingAnchor.previousZoom;
    const contentY =
      (viewport.scrollTop + pendingAnchor.anchorY) / pendingAnchor.previousZoom;

    viewport.scrollLeft = Math.max(0, contentX * diagramZoom - pendingAnchor.anchorX);
    viewport.scrollTop = Math.max(0, contentY * diagramZoom - pendingAnchor.anchorY);
    pendingZoomAnchorRef.current = null;
  }, [diagramZoom]);

  useEffect(() => {
    const viewport = diagramViewportRef.current;
    if (!viewport) return;

    const getAnchorFromClient = (clientX?: number, clientY?: number) => {
      const rect = viewport.getBoundingClientRect();
      const rawX =
        typeof clientX === "number" && Number.isFinite(clientX)
          ? clientX - rect.left
          : viewport.clientWidth / 2;
      const rawY =
        typeof clientY === "number" && Number.isFinite(clientY)
          ? clientY - rect.top
          : viewport.clientHeight / 2;

      return {
        x: Math.min(Math.max(rawX, 0), viewport.clientWidth),
        y: Math.min(Math.max(rawY, 0), viewport.clientHeight),
      };
    };

    const handleWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      event.stopPropagation();

      const anchor = getAnchorFromClient(event.clientX, event.clientY);
      const zoomFactor = Math.exp(
        -event.deltaY * DIAGRAM_WHEEL_ZOOM_SENSITIVITY,
      );
      applyDiagramZoom(diagramZoomRef.current * zoomFactor, anchor);
    };

    const handleGestureStart = (nativeEvent: Event) => {
      if (!diagramHoveringRef.current) return;
      nativeEvent.preventDefault();
      nativeEvent.stopPropagation();
      pinchZoomSessionRef.current = { startZoom: diagramZoomRef.current };
    };

    const handleGestureChange = (nativeEvent: Event) => {
      if (!diagramHoveringRef.current) return;
      nativeEvent.preventDefault();
      nativeEvent.stopPropagation();

      const event = nativeEvent as GestureEventLike;
      const scale =
        typeof event.scale === "number" && Number.isFinite(event.scale) && event.scale > 0
          ? event.scale
          : 1;
      const session = pinchZoomSessionRef.current ?? {
        startZoom: diagramZoomRef.current,
      };

      pinchZoomSessionRef.current = session;
      applyDiagramZoom(
        session.startZoom * scale,
        getAnchorFromClient(event.clientX, event.clientY),
      );
    };

    const handleGestureEnd = (nativeEvent: Event) => {
      if (!diagramHoveringRef.current && !pinchZoomSessionRef.current) return;
      nativeEvent.preventDefault();
      nativeEvent.stopPropagation();
      pinchZoomSessionRef.current = null;
    };

    viewport.addEventListener("wheel", handleWheel, { passive: false });

    const gestureDocument = document as GestureDocument;
    gestureDocument.addEventListener("gesturestart", handleGestureStart, {
      passive: false,
    });
    gestureDocument.addEventListener("gesturechange", handleGestureChange, {
      passive: false,
    });
    gestureDocument.addEventListener("gestureend", handleGestureEnd, {
      passive: false,
    });

    return () => {
      viewport.removeEventListener("wheel", handleWheel);
      gestureDocument.removeEventListener("gesturestart", handleGestureStart);
      gestureDocument.removeEventListener("gesturechange", handleGestureChange);
      gestureDocument.removeEventListener("gestureend", handleGestureEnd);
    };
  }, []);

  const zoomIn = () => applyDiagramZoom(diagramZoom + DIAGRAM_ZOOM_STEP);
  const zoomOut = () => applyDiagramZoom(diagramZoom - DIAGRAM_ZOOM_STEP);
  const resetZoom = () => applyDiagramZoom(1);
  const collapseAllSubtrees = () => {
    if (!detail.root) return;
    setExpandedNodeIds(collectCollapsedNodeIds(detail.root));
  };
  const fitDiagramToViewport = () => {
    const viewport = diagramViewportRef.current;
    if (!viewport) return;

    const availableWidth = Math.max(viewport.clientWidth - 24, 1);
    const availableHeight = Math.max(viewport.clientHeight - 24, 1);
    const fitScale = Math.min(
      availableWidth / diagramLayout.width,
      availableHeight / diagramLayout.height,
    );

    applyDiagramZoom(fitScale);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-gray-500">
          Blue borders and arrows show the evaluated path. Muted branches were
          not taken.
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2 text-xs">
          <button
            type="button"
            onClick={collapseAllSubtrees}
            className="rounded border border-gray-300 bg-white px-2 py-1 text-gray-700 hover:bg-gray-50"
          >
            Collapse all subtrees
          </button>
          <button
            type="button"
            onClick={zoomOut}
            className="rounded border border-gray-300 bg-white px-2 py-1 text-gray-700 hover:bg-gray-50"
            aria-label="Zoom out diagram"
          >
            −
          </button>
          <div
            className="min-w-14 rounded border border-gray-200 bg-white px-2 py-1 text-center font-medium text-gray-700"
            data-testid="diagram-zoom-value"
          >
            {Math.round(diagramZoom * 100)}%
          </div>
          <button
            type="button"
            onClick={zoomIn}
            className="rounded border border-gray-300 bg-white px-2 py-1 text-gray-700 hover:bg-gray-50"
            aria-label="Zoom in diagram"
          >
            +
          </button>
          <button
            type="button"
            onClick={fitDiagramToViewport}
            className="rounded border border-gray-300 bg-white px-2 py-1 text-gray-700 hover:bg-gray-50"
          >
            Fit
          </button>
          <button
            type="button"
            onClick={resetZoom}
            className="rounded border border-gray-300 bg-white px-2 py-1 text-gray-700 hover:bg-gray-50"
          >
            100%
          </button>
        </div>
      </div>

      <div
        ref={diagramViewportRef}
        className="max-h-[75vh] max-w-full overflow-auto overscroll-contain rounded-lg border bg-slate-50"
        onPointerEnter={() => {
          diagramHoveringRef.current = true;
        }}
        onPointerLeave={() => {
          diagramHoveringRef.current = false;
          pinchZoomSessionRef.current = null;
        }}
        style={{ touchAction: "none" }}
      >
        <div
          className="relative"
          data-testid="tree-diagram-canvas"
          style={{
            height: `${scaledHeight}px`,
            width: `${scaledWidth}px`,
          }}
        >
          <div
            className="absolute left-0 top-0"
            style={{
              height: `${diagramLayout.height}px`,
              transform: `scale(${diagramZoom})`,
              transformOrigin: "top left",
              width: `${diagramLayout.width}px`,
            }}
          >
            <svg
              className="pointer-events-none absolute inset-0"
              width={diagramLayout.width}
              height={diagramLayout.height}
              viewBox={`0 0 ${diagramLayout.width} ${diagramLayout.height}`}
              aria-hidden="true"
            >
              <defs>
                <marker
                  id="tree-diagram-arrowhead-taken"
                  markerWidth="8"
                  markerHeight="8"
                  refX="5"
                  refY="2.5"
                  orient="auto"
                >
                  <path d="M 0 0 L 5 2.5 L 0 5 z" fill="#0284c7" />
                </marker>
                <marker
                  id="tree-diagram-arrowhead-skipped"
                  markerWidth="8"
                  markerHeight="8"
                  refX="5"
                  refY="2.5"
                  orient="auto"
                >
                  <path d="M 0 0 L 5 2.5 L 0 5 z" fill="#94a3b8" />
                </marker>
                <marker
                  id="tree-diagram-arrowhead-unevaluated"
                  markerWidth="8"
                  markerHeight="8"
                  refX="5"
                  refY="2.5"
                  orient="auto"
                >
                  <path d="M 0 0 L 5 2.5 L 0 5 z" fill="#ea580c" />
                </marker>
                <marker
                  id="tree-diagram-arrowhead-muted"
                  markerWidth="8"
                  markerHeight="8"
                  refX="5"
                  refY="2.5"
                  orient="auto"
                >
                  <path d="M 0 0 L 5 2.5 L 0 5 z" fill="#94a3b8" />
                </marker>
              </defs>
              {diagramLayout.edges.map((edge) => {
                const stroke = getEdgeStroke(edge.status);

                return (
                  <path
                    key={edge.id}
                    d={edge.path}
                    fill="none"
                    markerEnd={`url(#${stroke.markerId})`}
                    stroke={stroke.color}
                    strokeDasharray={stroke.strokeDasharray}
                    strokeWidth={stroke.strokeWidth}
                    opacity={stroke.opacity}
                  />
                );
              })}
            </svg>

            {diagramLayout.edges.map((edge) =>
              edge.conditionLabel && edge.conditionLabel !== "always" ? (
                <div
                  key={`label-${edge.id}`}
                  className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${edge.labelX}px`, top: `${edge.labelY}px` }}
                >
                  <div
                    className={`max-w-40 rounded border px-2 py-1 text-[10px] shadow-sm backdrop-blur ${getEdgeLabelCardClass(
                      edge.status,
                    )}`}
                  >
                    <div className="break-words font-mono text-[10px]">
                      {edge.conditionLabel}
                    </div>
                  </div>
                </div>
              ) : null,
            )}

            {diagramLayout.nodes.map((placement) => {
              const isMuted = placement.node.status === "not-reached";
              const nodeEquationTex = getNodeEquationTex(placement.node);
              const nodeLabel = getNodeLabel(placement.node);
              const nodeReferences = formatReferences(placement.node.meta);
              const nodeTypeTheme = getNodeTypeTheme(placement.node.type);

              return (
                <div
                  key={placement.node.id}
                  className="absolute"
                  style={{
                    height: `${DIAGRAM_NODE_HEIGHT}px`,
                    left: `${placement.x}px`,
                    top: `${placement.y}px`,
                    width: `${DIAGRAM_NODE_WIDTH}px`,
                  }}
                >
                  <div
                    className={`relative h-full rounded-lg border p-0 transition ${getDiagramNodeCardClass(
                      placement.node.status,
                      placement.node.isActivePath,
                    )}`}
                  >
                    <div
                      className="absolute inset-x-0 top-0 h-1 rounded-t-lg"
                      style={{ backgroundColor: nodeTypeTheme.accent }}
                    />
                    {placement.hasChildren ? (
                      <button
                        type="button"
                        aria-label={`${placement.isExpanded ? "Collapse" : "Expand"} node ${placement.node.name}`}
                        onClick={() =>
                          setExpandedNodeIds((previous) => {
                            const next = new Set(previous);
                            if (next.has(placement.node.id)) {
                              next.delete(placement.node.id);
                            } else {
                              next.add(placement.node.id);
                            }
                            return next;
                          })
                        }
                        className="absolute right-2 top-2 z-10 rounded border border-gray-300 bg-white px-1.5 py-0 text-[10px] font-semibold text-gray-700 shadow-sm"
                      >
                        {placement.isExpanded ? "−" : "+"}
                      </button>
                    ) : null}

                    <div className="h-full w-full px-3 py-2 pr-10 text-left">
                      <div className="flex h-full flex-col gap-0.5">
                        <div className="truncate text-[15px] font-semibold text-slate-950">
                          {nodeLabel}
                        </div>
                        <div
                          className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${nodeTypeTheme.textClass}`}
                        >
                          {placement.node.type}
                        </div>
                        <div className="line-clamp-2 text-[11px] leading-tight text-slate-600">
                          {placement.node.name}
                        </div>
                        <div className="mt-1 h-[1.4rem] overflow-hidden text-[9px] leading-tight text-slate-500">
                          {nodeReferences ? (
                            <div className="line-clamp-2">{nodeReferences}</div>
                          ) : (
                            <div aria-hidden="true" className="invisible line-clamp-2">
                              placeholder
                            </div>
                          )}
                        </div>
                        <div
                          className={`mt-1 flex min-h-0 flex-1 items-center rounded-md border px-2 py-0.5 ${
                            isMuted
                              ? "border-slate-200 bg-slate-100/80"
                              : nodeTypeTheme.panelClass
                          }`}
                        >
                          {nodeEquationTex ? (
                            <div className="w-full overflow-x-auto overflow-y-hidden text-[12px] text-slate-900">
                              <MathFormula
                                tex={nodeEquationTex}
                                className="inline-block min-w-max [&_.katex]:text-inherit"
                              />
                            </div>
                          ) : (
                            <div className="truncate font-mono text-[12px] text-slate-500">
                              {formatScalar(placement.node.rawValue)}
                              {placement.node.unit ? ` ${placement.node.unit}` : ""}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function TracePanel({
  trace,
  executionAvailable,
}: {
  trace: readonly VerificationDebuggerTraceItem[];
  executionAvailable: boolean;
}) {
  if (!executionAvailable) {
    return (
      <div className="rounded border border-dashed px-3 py-4 text-sm text-gray-500">
        Execution trace is not available for this result.
      </div>
    );
  }

  return (
    <div className="space-y-2">
            {trace.map(({ entry, index }) => (
        <div key={`${entry.nodeId}:${index}`} className="rounded border px-3 py-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-xs font-medium text-gray-500">
                Step {index + 1}
              </div>
              <div className="font-medium text-gray-900">
                {entry.key} <span className="text-sm text-gray-500">({entry.type})</span>
              </div>
            </div>
            <div className="text-right text-xs">
              <div className="font-medium text-gray-900">
                {formatScalar(entry.value)}
              </div>
              {entry.unit ? (
                <div className="overflow-x-auto overflow-y-hidden text-gray-500">
                  <MathFormula
                    tex={entry.unit}
                    className="inline-block min-w-max [&_.katex]:text-inherit"
                  />
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-2 space-y-2 text-xs text-gray-700">
            {entry.description ? <div>{entry.description}</div> : null}
            {entry.symbol ? (
              <div>
                <span className="font-medium text-gray-500">Symbol</span>{" "}
                <span className="inline-block align-middle">
                  <MathFormula
                    tex={entry.symbol}
                    className="inline-block min-w-max text-sm [&_.katex]:text-inherit"
                  />
                </span>
              </div>
            ) : null}
            {entry.expression ? (
              <div>
                <span className="font-medium text-gray-500">Expression</span>
                <div className="mt-1">
                  <FormulaBlock
                    tex={entry.expression}
                    display
                    className="inline-block min-w-max text-sm [&_.katex-display]:my-0 [&_.katex]:text-inherit"
                  />
                </div>
              </div>
            ) : null}
            {entry.verificationExpression ? (
              <div>
                <span className="font-medium text-gray-500">Verification rule</span>
                <div className="mt-1">
                  <FormulaBlock
                    tex={entry.verificationExpression}
                    display
                    className="inline-block min-w-max text-sm [&_.katex-display]:my-0 [&_.katex]:text-inherit"
                  />
                </div>
              </div>
            ) : null}
            <div>
              <span className="font-medium text-gray-500">Active children</span>{" "}
              {entry.children.length > 0 ? entry.children.join(", ") : "none"}
            </div>
            {entry.evaluatorInputs ? (
              <div>
                <span className="font-medium text-gray-500">Evaluator inputs</span>
                <pre className="mt-1 overflow-x-auto rounded bg-gray-50 px-2 py-1 text-[11px]">
                  {JSON.stringify(entry.evaluatorInputs, null, 2)}
                </pre>
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function CachePanel({
  cacheEntries,
  executionAvailable,
}: {
  cacheEntries: readonly VerificationDebuggerCacheEntry[];
  executionAvailable: boolean;
}) {
  if (!executionAvailable) {
    return (
      <div className="rounded border border-dashed px-3 py-4 text-sm text-gray-500">
        Cache values are not available for this result.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded border">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-3 py-2">Key</th>
            <th className="px-3 py-2">Value</th>
            <th className="px-3 py-2">Source</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {cacheEntries.map((entry) => (
            <tr key={entry.key}>
              <td className="px-3 py-2 font-mono text-xs">{entry.key}</td>
              <td className="px-3 py-2 font-mono text-xs">
                {formatScalar(entry.value)}
              </td>
              <td className="px-3 py-2 text-xs text-gray-600">
                {entry.isTraced ? "trace" : "cache-only"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ContextPanel({
  groups,
}: {
  groups: readonly VerificationDebuggerContextGroup[];
}) {
  return (
    <div className="overflow-hidden rounded border">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-3 py-2">Key</th>
            <th className="px-3 py-2">Value</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {groups.map((group, groupIndex) => {
            const theme =
              CONTEXT_GROUP_THEMES[groupIndex % CONTEXT_GROUP_THEMES.length];

            return (
              <Fragment key={group.id}>
                <tr className={theme.headerClass}>
                  <th colSpan={2} className="px-3 py-2 text-left">
                    <div className="font-semibold">{group.title}</div>
                    {group.description ? (
                      <div className="mt-0.5 text-[11px] font-normal opacity-80">
                        {group.description}
                      </div>
                    ) : null}
                  </th>
                </tr>
                {Object.entries(group.values).map(([key, value]) => (
                  <tr key={`${group.id}:${key}`} className={theme.rowClass}>
                    <td className="px-3 py-2 font-mono text-xs">{key}</td>
                    <td className="px-3 py-2 font-mono text-xs">
                      {formatScalar(value)}
                    </td>
                  </tr>
                ))}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function RawJsonPanel({
  detail,
  sections,
}: {
  detail: VerificationDebuggerCheckDetail;
  sections: readonly VerificationDebuggerRawJsonSection[];
}) {
  const allSections = [
    ...sections,
    {
      id: "selected-result-payload",
      title: "Selected result payload",
      value: detail.resultPayload,
    },
    {
      id: "selected-verification-definition",
      title: "Selected verification definition",
      value: detail.definition,
    },
  ];

  return (
    <div className="space-y-3">
      {allSections.map((section) => (
        <details key={section.id} className="rounded border bg-white" open>
          <summary className="cursor-pointer px-3 py-2 font-medium text-gray-900">
            {section.title}
          </summary>
          <pre className="overflow-x-auto border-t bg-gray-50 px-3 py-3 text-[11px]">
            {JSON.stringify(section.value, null, 2)}
          </pre>
        </details>
      ))}
    </div>
  );
}

export function VerificationDebugger({
  adapter,
}: {
  adapter: VerificationDebuggerAdapter;
}) {
  const [filter, setFilter] = useState<CheckFilter>("all");
  const [bottomTab, setBottomTab] = useState<BottomPanelTab>("context");

  const defaultSelectedCheckId = useMemo(
    () => getDefaultSelectedCheckId(adapter.checks),
    [adapter.checks],
  );
  const [selectedCheckId, setSelectedCheckId] = useState<number | null>(
    defaultSelectedCheckId,
  );

  const visibleChecks = useMemo(
    () => filterChecks(adapter.checks, filter),
    [adapter.checks, filter],
  );

  useEffect(() => {
    setSelectedCheckId(defaultSelectedCheckId);
  }, [defaultSelectedCheckId]);

  useEffect(() => {
    if (selectedCheckId === null) return;
    if (visibleChecks.some((check) => check.checkId === selectedCheckId)) return;
    setSelectedCheckId(visibleChecks[0]?.checkId ?? defaultSelectedCheckId);
  }, [defaultSelectedCheckId, selectedCheckId, visibleChecks]);

  const selectedCheck =
    visibleChecks.find((check) => check.checkId === selectedCheckId) ??
    adapter.checks.find((check) => check.checkId === selectedCheckId) ??
    visibleChecks[0] ??
    adapter.checks[0];

  if (adapter.checks.length === 0) {
    return (
      <div className="rounded border border-dashed px-4 py-6 text-sm text-gray-500">
        {adapter.emptyState ?? "No verification results are available."}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{adapter.title}</h2>
          {adapter.subtitle ? (
            <p className="mt-1 text-sm text-gray-600">{adapter.subtitle}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(FILTER_LABELS) as CheckFilter[]).map((candidate) => (
            <button
              key={candidate}
              type="button"
              onClick={() => setFilter(candidate)}
              className={`rounded border px-3 py-1.5 text-sm ${
                filter === candidate
                  ? "border-sky-400 bg-sky-50 text-sky-700"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {FILTER_LABELS[candidate]} ({countChecks(adapter.checks, candidate)})
            </button>
          ))}
        </div>
      </div>

      {adapter.warning ? (
        <div className="rounded border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {adapter.warning}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-3">
          <section className="rounded border bg-gray-50 p-3">
            <h3 className="mb-3 font-semibold text-gray-900">Verification list</h3>
            <CheckList
              checks={visibleChecks}
              selectedCheckId={selectedCheck?.checkId ?? null}
              onSelectCheck={setSelectedCheckId}
            />
          </section>
        </aside>

        {selectedCheck ? (
          <div className="min-w-0 space-y-4">
            <section className="rounded border bg-white px-4 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Check {selectedCheck.checkId}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedCheck.name}
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span
                    className={`rounded border px-2 py-0.5 font-semibold uppercase tracking-wide ${getStatusBadgeClass(selectedCheck.status)}`}
                  >
                    {selectedCheck.status}
                  </span>
                  <span className="rounded border border-gray-200 px-2 py-0.5 font-mono text-gray-700">
                    ratio {selectedCheck.ratioLabel}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid gap-3 text-sm text-gray-700 md:grid-cols-2">
                <div>
                  <div className="font-medium text-gray-500">Verification key</div>
                  <div className="font-mono">
                    {selectedCheck.detail.definition.check.key}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-500">References</div>
                  <div>
                    {formatReferences(
                      selectedCheck.detail.definition.check.meta as Record<
                        string,
                        string | undefined
                      >,
                    ) ?? "—"}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="font-medium text-gray-500">Verification rule</div>
                  <div className="mt-1">
                    <FormulaBlock
                      tex={selectedCheck.detail.definition.check.verificationExpression}
                      display
                      className="inline-block min-w-max text-sm [&_.katex-display]:my-0 [&_.katex]:text-inherit"
                    />
                  </div>
                </div>
              </div>

              {selectedCheck.detail.errorMessage ? (
                <div className="mt-4 rounded border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-900">
                  {selectedCheck.detail.errorMessage}
                </div>
              ) : null}
            </section>

            <div className="grid gap-4 2xl:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.9fr)]">
              <section className="min-w-0 rounded border bg-white px-4 py-4">
                <h4 className="mb-3 font-semibold text-gray-900">Node diagram</h4>
                <TreeInspector detail={selectedCheck.detail} />
              </section>

              <div className="min-w-0 space-y-4">
                <details className="rounded border bg-white" data-testid="execution-trace-panel">
                  <summary className="cursor-pointer px-4 py-4 font-semibold text-gray-900">
                    Execution trace
                  </summary>
                  <div className="border-t px-4 py-4">
                    <TracePanel
                      trace={selectedCheck.detail.trace}
                      executionAvailable={selectedCheck.detail.executionAvailable}
                    />
                  </div>
                </details>

                <section className="rounded border bg-white px-4 py-4">
                  <h4 className="mb-3 font-semibold text-gray-900">Cache</h4>
                  <CachePanel
                    cacheEntries={selectedCheck.detail.cacheEntries}
                    executionAvailable={selectedCheck.detail.executionAvailable}
                  />
                </section>
              </div>
            </div>

            <section className="rounded border bg-white px-4 py-4">
              <div className="mb-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setBottomTab("context")}
                  className={`rounded border px-3 py-1.5 text-sm ${
                    bottomTab === "context"
                      ? "border-sky-400 bg-sky-50 text-sky-700"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Run context
                </button>
                <button
                  type="button"
                  onClick={() => setBottomTab("raw-json")}
                  className={`rounded border px-3 py-1.5 text-sm ${
                    bottomTab === "raw-json"
                      ? "border-sky-400 bg-sky-50 text-sky-700"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Raw JSON
                </button>
              </div>

              {bottomTab === "context" ? (
                <ContextPanel groups={adapter.runContextGroups} />
              ) : (
                <RawJsonPanel
                  detail={selectedCheck.detail}
                  sections={adapter.rawJsonSections}
                />
              )}
            </section>
          </div>
        ) : (
          <div className="rounded border border-dashed px-4 py-6 text-sm text-gray-500">
            {adapter.emptyState ?? "No verification results are available."}
          </div>
        )}
      </div>
    </div>
  );
}
