import { Slider } from "@base-ui/react/slider";
import { clamp } from "lodash-es";
import { useEffect, useRef, useState } from "react";

const defaultThreshold = 1;
const minThreshold = 0.5;
const maxThreshold = 1;
const thresholdStep = 0.01;
const linearScaleLimit = 1;
const linearScaleShare = 0.55;

const colorStops = {
  pass: { background: "#dfe8e0", foreground: "#384d3e", bar: "#bed1c1" },
  fail: { background: "#fee2e2", foreground: "#991b1b", bar: "#fca5a5" },
  inactive: { background: "#f3f4f6", foreground: "#6b7280", bar: "#d1d5db" },
} as const;

const verificationRows = [
  { name: "Tension", value: 0.42 },
  { name: "Compression", value: 0.78 },
  { name: "Bending about y-y", value: 0.86 },
  { name: "Bending about z-z", value: 0.53 },
  { name: "Shear about z-z", value: 0.31 },
  { name: "Shear about y-y", value: 0.67 },
  { name: "Bending and shear about y-y", value: null },
  { name: "Bending and shear about z-z", value: 0.92 },
  { name: "Bending and axial about y-y", value: 0.74 },
  { name: "Bending and axial about z-z", value: 1.04 },
  { name: "Biaxial bending and axial", value: 0.89 },
  { name: "Bending, axial, and shear about y-y", value: 1.12 },
  { name: "Bending, axial, and shear about z-z", value: null },
  { name: "Biaxial bending, axial, and shear", value: 1.36 },
  { name: "Flexural buckling y-y", value: 0.97 },
  { name: "Flexural buckling z-z", value: 1.18 },
  { name: "Torsional buckling", value: null },
  { name: "Lateral-torsional buckling", value: 1.43 },
  { name: "Beam-column 6.61 Method 1", value: 1.08 },
  { name: "Beam-column 6.62 Method 1", value: 0.82 },
  { name: "Beam-column 6.61 Method 2", value: 2.5 },
  { name: "Beam-column 6.62 Method 2", value: 0.69 },
] as const;

type VerificationRow = (typeof verificationRows)[number];
type Color = { background: string; foreground: string; bar: string };

const axisTicks = [1, 2, 3, 5, 8, 13] as const;
const maxVerificationValue = Math.max(
  ...verificationRows.flatMap((row) => (row.value === null ? [] : [row.value])),
);
const axisLimit = Math.max(maxVerificationValue, maxThreshold);
const firstTickAboveLimitIndex = axisTicks.findIndex(
  (tick) => tick > axisLimit,
);
const visibleAxisTicks =
  firstTickAboveLimitIndex === -1
    ? axisTicks
    : axisTicks.slice(
        0,
        Math.min(axisTicks.length, firstTickAboveLimitIndex + 2),
      );
const maxScaleValue = visibleAxisTicks[visibleAxisTicks.length - 1];

const formatRatio = (value: number | null) => {
  if (value === null) return "N/A";
  return value.toFixed(2);
};

const getVerificationColor = (
  value: number | null,
  threshold: number,
): Color => {
  if (value === null) return colorStops.inactive;
  return value < threshold ? colorStops.pass : colorStops.fail;
};

const getScaledValue = (value: number) => {
  if (value <= linearScaleLimit) {
    return clamp(value / linearScaleLimit, 0, 1) * linearScaleShare;
  }

  const compressedValue =
    Math.log1p(value - linearScaleLimit) /
    Math.log1p(maxScaleValue - linearScaleLimit);
  return (
    linearScaleShare + clamp(compressedValue, 0, 1) * (1 - linearScaleShare)
  );
};

const getHoverOpacity = (isDimmed: boolean, isActive: boolean) => {
  if (isActive) return 1;
  if (isDimmed) return 0.18;
  return 1;
};

const getRightAlignedPosition = (value: number) =>
  `${getScaledValue(value) * 100}%`;

type VerificationSummaryRowProps = {
  isActive: boolean;
  isDimmed: boolean;
  onHoverEnd: () => void;
  onHoverStart: () => void;
  row: VerificationRow;
  threshold: number;
};

const VerificationSummaryBar = (props: VerificationSummaryRowProps) => {
  const { isActive, isDimmed, onHoverEnd, onHoverStart, row, threshold } =
    props;
  const color = getVerificationColor(row.value, threshold);
  const width = row.value === null ? "0%" : getRightAlignedPosition(row.value);
  const opacity = getHoverOpacity(isDimmed, isActive);

  return (
    <div
      className="relative h-6 transition-opacity duration-200 ease-out"
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      style={{ opacity }}
    >
      {row.value !== null && (
        <div
          className="absolute right-0 top-0 h-full rounded-sm transition-colors duration-200 ease-out"
          style={{ backgroundColor: color.bar, width }}
        />
      )}
    </div>
  );
};

const VerificationSummaryLabel = (props: VerificationSummaryRowProps) => {
  const { isActive, isDimmed, onHoverEnd, onHoverStart, row, threshold } =
    props;
  const color = getVerificationColor(row.value, threshold);
  const opacity = getHoverOpacity(isDimmed, isActive);

  return (
    <div
      className="grid h-6 grid-cols-[4ch_max-content] gap-6 items-center rounded-sm px-4 text-[10px] leading-none transition-colors duration-200 ease-out"
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      style={{
        backgroundColor: row.value === null ? "transparent" : color.background,
        color: color.foreground,
        opacity,
        transitionProperty: "background-color,color,opacity",
      }}
    >
      <span className="text-center text-sm font-semibold tabular-nums">
        {formatRatio(row.value)}
      </span>
      <span className="whitespace-nowrap text-left text-sm font-light">
        {row.name}
      </span>
    </div>
  );
};

export const VerificationSummary = () => {
  const [threshold, setThreshold] = useState(defaultThreshold);
  const [hoveredRowName, setHoveredRowName] = useState<string | null>(null);
  const hoverClearTimeoutRef = useRef<number | null>(null);
  const sliderValue = minThreshold + maxThreshold - threshold;
  const thresholdOffset = getRightAlignedPosition(threshold);

  const clearHoverTimeout = () => {
    if (hoverClearTimeoutRef.current === null) return;
    window.clearTimeout(hoverClearTimeoutRef.current);
    hoverClearTimeoutRef.current = null;
  };

  const handleHoverStart = (rowName: string) => {
    clearHoverTimeout();
    setHoveredRowName(rowName);
  };

  const handleHoverEnd = () => {
    clearHoverTimeout();
    hoverClearTimeoutRef.current = window.setTimeout(() => {
      setHoveredRowName(null);
      hoverClearTimeoutRef.current = null;
    }, 120);
  };

  useEffect(
    () => () => {
      if (hoverClearTimeoutRef.current === null) return;
      window.clearTimeout(hoverClearTimeoutRef.current);
    },
    [],
  );

  return (
    <aside className="flex h-full w-full p-4 pb-6">
      <div className="grid min-h-0 w-full content-end grid-cols-[minmax(0,1fr)_max-content] grid-rows-[2.25rem_max-content] gap-x-4">
        <div className="relative col-start-1 row-start-1">
          <Slider.Root
            aria-label="Passing threshold"
            className="absolute top-0 z-30 h-8"
            format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
            max={maxThreshold}
            min={minThreshold}
            onValueChange={(value) =>
              setThreshold(minThreshold + maxThreshold - value)
            }
            step={thresholdStep}
            style={{
              left: `calc(100% - ${getRightAlignedPosition(maxThreshold)})`,
              right: getRightAlignedPosition(minThreshold),
            }}
            value={sliderValue}
          >
            <Slider.Control className="relative h-full w-full touch-none">
              <Slider.Track className="absolute top-1/2 h-px w-full -translate-y-1/2 bg-transparent">
                <Slider.Thumb className="flex h-7 min-w-16 -translate-y-3 cursor-grab items-center justify-center rounded-sm bg-sand-200 px-2 text-xs font-medium text-sand-950 shadow-sm shadow-sand-950/15 outline-none transition hover:bg-sand-300 active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-envy-700/25">
                  {threshold.toFixed(2)}
                </Slider.Thumb>
              </Slider.Track>
            </Slider.Control>
          </Slider.Root>
        </div>

        <div className="relative col-start-1 row-start-2 min-h-0 overflow-visible">
          <div className="pointer-events-none absolute inset-0">
            {visibleAxisTicks.map((tick) => (
              <div
                className="absolute inset-y-0 border-r border-sand-300/30"
                key={tick}
                style={{ right: getRightAlignedPosition(tick) }}
              >
                <span className="absolute -top-5 right-0 translate-x-1/2 text-[9px] tabular-nums text-sand-700/45">
                  {tick.toFixed(tick % 1 === 0 ? 0 : 1)}
                </span>
              </div>
            ))}
            <div
              className="absolute inset-y-0 z-20 w-px transition-[right] duration-150 ease-out"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, rgba(90, 71, 52, 0.25) 0 5px, transparent 5px 11px)",
                right: thresholdOffset,
              }}
            />
          </div>

          <div className="relative grid gap-1">
            {verificationRows.map((row) => (
              <VerificationSummaryBar
                isActive={hoveredRowName === row.name}
                isDimmed={
                  hoveredRowName !== null && hoveredRowName !== row.name
                }
                key={row.name}
                onHoverEnd={handleHoverEnd}
                onHoverStart={() => handleHoverStart(row.name)}
                row={row}
                threshold={threshold}
              />
            ))}
          </div>
        </div>

        <div className="col-start-2 row-start-2 grid gap-1">
          {verificationRows.map((row) => (
            <VerificationSummaryLabel
              isActive={hoveredRowName === row.name}
              isDimmed={hoveredRowName !== null && hoveredRowName !== row.name}
              key={row.name}
              onHoverEnd={handleHoverEnd}
              onHoverStart={() => handleHoverStart(row.name)}
              row={row}
              threshold={threshold}
            />
          ))}
        </div>
      </div>
    </aside>
  );
};
