import { Slider } from "@base-ui/react/slider";
import type { VerificationRow as Verification } from "@ndg/ndg-ec3-1-1";
import { type CSSProperties } from "react";
import { twMerge } from "tailwind-merge";

import { useEc311DerivedStore } from "../useEc311DerivedStore";

const minThreshold = 0.5;
const maxThreshold = 1;
const thresholdStep = 0.01;
const extraFibonacciTicks = 2;

type VerificationStatus = "pass" | "fail" | "na";
type ChartStyle = CSSProperties & Record<`--${string}`, string>;
type Scale = {
  getBarTranslate: (ratio: number) => string;
  getScaledTranslate: (ratio: number) => string;
  getScaledWidth: (ratio: number) => string;
  ticks: number[];
};

const formatRatio = (ratio: number | null) => {
  if (ratio === null) return "N/A";
  return ratio.toFixed(2);
};

const getVerificationRatio = (verification: Verification) =>
  verification.payload.data?.ratio ?? null;

const getVerificationStatus = (
  ratio: number | null,
  threshold: number,
): VerificationStatus => {
  if (ratio === null) return "na";
  return ratio < threshold ? "pass" : "fail";
};

const getFibonacciTicks = (maxRatio: number, extraTicks: number) => {
  const ticks = [0, 1, 2];

  while (ticks.filter(tick => tick > maxRatio).length < extraTicks) {
    const nextTick = ticks[ticks.length - 1] + ticks[ticks.length - 2];
    ticks.push(nextTick);
  }

  return ticks;
};

const getMaxVerificationRatio = (verifications: readonly Verification[]) => {
  const ratios = verifications.flatMap(verification => {
    const ratio = getVerificationRatio(verification);
    return ratio === null ? [] : [ratio];
  });

  if (ratios.length === 0) return 0;
  return Math.max(...ratios);
};

const createScale = (verifications: readonly Verification[]): Scale => {
  const maxVerificationRatio = getMaxVerificationRatio(verifications);
  const ticks = getFibonacciTicks(maxVerificationRatio, extraFibonacciTicks);

  const getFibonacciScale = (ratio: number) => {
    const maxTick = ticks[ticks.length - 1];
    if (ratio >= maxTick) return 1;

    const upperTickIndex = ticks.findIndex(tick => ratio <= tick);
    if (upperTickIndex <= 0) return 0;

    const lowerTick = ticks[upperTickIndex - 1];
    const upperTick = ticks[upperTickIndex];
    const segmentProgress = (ratio - lowerTick) / (upperTick - lowerTick);

    return (upperTickIndex - 1 + segmentProgress) / (ticks.length - 1);
  };

  return {
    getBarTranslate: (ratio: number) =>
      `${(1 - getFibonacciScale(ratio)) * 100}%`,
    getScaledTranslate: (ratio: number) =>
      `${getFibonacciScale(ratio) * -100}%`,
    getScaledWidth: (ratio: number) => `${getFibonacciScale(ratio) * 100}%`,
    ticks,
  };
};

export const VerificationBarChart = () => {
  const verifications = useEc311DerivedStore(state => state.verifications);
  const scale = createScale(verifications);

  if (verifications.length === 0) return null;

  return (
    <div
      className={twMerge(
        "pl-1",
        "relative grid w-full grid-cols-[minmax(0,1fr)_max-content]",
        "gap-x-0.5 gap-y-0.5 pt-10",
        "[&:has(.verification-hover-trigger:hover)_.verification-row:not(:has(.verification-hover-trigger:hover))_.verification-hover-surface]:opacity-25",
      )}
      style={{
        gridTemplateRows: `repeat(${verifications.length}, calc(var(--spacing) * 5))`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          gridColumn: "1 / 2",
          gridRow: `1 / span ${verifications.length}`,
        }}
      >
        <ChartGuides scale={scale} />
      </div>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          gridColumn: "1 / 2",
          gridRow: `1 / span ${verifications.length}`,
        }}
      >
        <ThresholdSlider scale={scale} />
      </div>
      {verifications.map((verification, index) => (
        <VerificationRow
          key={verification.id}
          rowIndex={index}
          scale={scale}
          verification={verification}
        />
      ))}
    </div>
  );
};

type ChartGuidesProps = { scale: Scale };

const ChartGuides = (props: ChartGuidesProps) => {
  const { scale } = props;
  const threshold = useEc311DerivedStore(state => state.threshold);

  return (
    <div className="pointer-events-none absolute inset-0">
      {scale.ticks.map(tick => (
        <div
          className={twMerge(
            "absolute inset-y-0 right-(--tick-width)",
            "border-r border-sand-300/30 first-of-type:hidden",
          )}
          key={tick}
          style={{ "--tick-width": scale.getScaledWidth(tick) } as ChartStyle}
        >
          <span
            className={twMerge(
              "absolute -top-5 right-0 translate-x-1/2",
              "text-xs tabular-nums text-sand-700/45",
            )}
          >
            {tick}
          </span>
        </div>
      ))}
      <div
        className={twMerge(
          "absolute inset-y-0 right-0 w-full",
          "transition-transform duration-150 ease-out",
        )}
        style={
          {
            "--threshold-translate": scale.getScaledTranslate(threshold),
            transform: "translateX(var(--threshold-translate))",
          } as ChartStyle
        }
      >
        <div
          className="absolute inset-y-0 right-0 w-px"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(90, 71, 52, 0.25) 0 5px, transparent 5px 11px)",
          }}
        />
      </div>
    </div>
  );
};

type ThresholdSliderProps = { scale: Scale };

const ThresholdSlider = (props: ThresholdSliderProps) => {
  const { scale } = props;
  const setThreshold = useEc311DerivedStore(state => state.setThreshold);
  const threshold = useEc311DerivedStore(state => state.threshold);
  const sliderValue = minThreshold + maxThreshold - threshold;

  return (
    <Slider.Root
      aria-label="Passing threshold"
      className="pointer-events-auto absolute -top-8 z-30 h-6"
      format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
      max={maxThreshold}
      min={minThreshold}
      onValueChange={value => setThreshold(minThreshold + maxThreshold - value)}
      step={thresholdStep}
      style={{
        left: `calc(100% - ${scale.getScaledWidth(maxThreshold)})`,
        right: scale.getScaledWidth(minThreshold),
      }}
      value={sliderValue}
    >
      <Slider.Control className="relative h-full w-full touch-none">
        <Slider.Track className="absolute top-1/2 h-px w-full -translate-y-1/2 bg-transparent">
          <Slider.Thumb
            className={twMerge(
              "grid h-6 min-w-12 -translate-y-3 cursor-grab place-content-center",
              "rounded-sm bg-sand-100 text-xs text-sand-800 outline-none transition",
              "hover:bg-sand-200 active:cursor-grabbing",
              "data-dragging:cursor-grabbing data-dragging:bg-sand-200",
              "focus-visible:ring-2 focus-visible:ring-envy-700/25",
            )}
          >
            {threshold.toFixed(2)}
          </Slider.Thumb>
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
  );
};

type VerificationItemProps = { scale: Scale; verification: Verification };

type VerificationThresholdItemProps = VerificationItemProps;

type VerificationRowProps = VerificationThresholdItemProps & {
  rowIndex: number;
};

const VerificationRow = (props: VerificationRowProps) => {
  const { rowIndex, scale, verification } = props;
  const gridRow = rowIndex + 1;

  return (
    <div
      className="verification-row col-span-full grid grid-cols-subgrid gap-x-0.5"
      style={{ gridRow }}
    >
      <VerificationBar scale={scale} verification={verification} />
      <VerificationLabel scale={scale} verification={verification} />
    </div>
  );
};

const VerificationBar = (props: VerificationThresholdItemProps) => {
  const { scale, verification } = props;
  const threshold = useEc311DerivedStore(state => state.threshold);
  const ratio = getVerificationRatio(verification);
  const status = getVerificationStatus(ratio, threshold);

  return (
    <div className="relative h-5">
      {ratio !== null && (
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={twMerge(
              "verification-hover-surface verification-hover-trigger",
              "relative h-full w-full rounded-l-sm bg-envy-200",
              "before:absolute before:-inset-y-0.5 before:inset-x-0 before:content-['']",
              "transition-[transform,background-color,opacity] duration-200 ease-out",
              "data-[status=fail]:bg-red-300",
            )}
            data-status={status}
            style={
              {
                "--bar-translate": scale.getBarTranslate(ratio),
                transform: "translateX(var(--bar-translate))",
              } as ChartStyle
            }
          />
        </div>
      )}
    </div>
  );
};

const VerificationLabel = (props: VerificationThresholdItemProps) => {
  const { verification } = props;
  const threshold = useEc311DerivedStore(state => state.threshold);
  const ratio = getVerificationRatio(verification);
  const status = getVerificationStatus(ratio, threshold);
  const formattedRatio = formatRatio(ratio);

  return (
    <div
      className={twMerge(
        "verification-hover-surface verification-hover-trigger",
        "relative grid h-5 grid-cols-[4ch_1rem_max-content] items-center",
        "before:absolute before:-inset-y-0.5 before:inset-x-0 before:content-['']",
        "rounded-r-sm px-4 text-sm font-light leading-none",
        "transition-[background-color,color,opacity] duration-200 ease-out",
        "data-[status=pass]:bg-envy-100 data-[status=pass]:text-envy-900",
        "data-[status=fail]:bg-red-100 data-[status=fail]:text-red-800",
        "data-[status=na]:bg-transparent data-[status=na]:text-gray-500",
      )}
      data-status={status}
    >
      <span className="text-center font-semibold tabular-nums">
        {formattedRatio}
      </span>
      <span className="text-center text-current/45">|</span>
      <span className="whitespace-nowrap text-left text-xs">
        {verification.name}
      </span>
    </div>
  );
};
