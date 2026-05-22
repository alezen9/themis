import { Slider } from "@base-ui/react/slider";
import { PieChart } from "echarts/charts";
import * as echarts from "echarts/core";
import { SVGRenderer } from "echarts/renderers";
import { useEffect, useRef, useState } from "react";

import type { PieSeriesOption } from "echarts/charts";
import type { ComposeOption, ECharts, EChartsCoreOption } from "echarts/core";

echarts.use([PieChart, SVGRenderer]);

const outerChartRadiusPercent = 50;
const defaultPassingChartValue = 1;
const minPassingChartValue = 0.5;
const maxPassingChartValue = 1;
const passingChartStep = 0.05;
const warningBandWidth = 0.1;
const overLimitDisplayBand = 0.2;
const overLimitScaleFactor = 2;

const chartShadowStyle = {
  shadowBlur: 12,
  shadowColor: "rgba(48, 36, 26, 0.18)",
  shadowOffsetX: 0,
  shadowOffsetY: 4,
};

type VerificationChartOption = ComposeOption<PieSeriesOption>;
type ChartMode = "pie" | "polar";
type EChartsRendererProps = {
  ariaLabel: string;
  options: EChartsCoreOption;
  updateOptions: EChartsCoreOption;
};
type VerificationChartProps = { passingChartValue: number };
type SvgPoint = { x: number; y: number };
type ActivityItem = {
  color: string;
  completedRevolutions: number;
  radius: number;
  remainder: number;
  result: (typeof verificationResults)[number];
};

const verificationResults = [
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

const getVerificationColor = (
  value: number | null,
  passingValue = defaultPassingChartValue,
) => {
  if (value === null) return "#e3dcc5";
  const dangerAmount = value > passingValue ? 1 : 0;
  const warningAmount = Math.max(
    0,
    Math.min(1, (value - (passingValue - warningBandWidth)) / warningBandWidth),
  );

  if (dangerAmount > 0) {
    return echarts.color.lerp(dangerAmount, ["#dfc86f", "#c7837f"]);
  }
  if (warningAmount > 0) {
    return echarts.color.lerp(warningAmount, ["#8eac94", "#dfc86f"]);
  }
  return "#8eac94";
};

const formatVerificationValue = (value: number | null) => {
  if (value === null) return "N/A";
  return value.toFixed(2);
};

const applicableVerificationResults = verificationResults.filter(
  (result) => result.value !== null,
);

const getChartRadiusValue = (value: number) =>
  value <= defaultPassingChartValue
    ? value
    : defaultPassingChartValue +
      overLimitDisplayBand *
        ((value - defaultPassingChartValue) /
          (value - defaultPassingChartValue + overLimitScaleFactor));

const maxChartRadiusValue = defaultPassingChartValue + overLimitDisplayBand;

const getChartData = (passingValue: number) =>
  applicableVerificationResults.map((result) => ({
    actualValue: result.value,
    formattedValue: formatVerificationValue(result.value),
    name: `${formatVerificationValue(result.value)} - ${result.name}`,
    verificationName: result.name,
    value: getChartRadiusValue(result.value),
    itemStyle: {
      ...chartShadowStyle,
      color: getVerificationColor(result.value, passingValue),
    },
  }));

type ChartDatum = ReturnType<typeof getChartData>[number];

const formatChartLabel = (params: { data?: unknown }) => {
  const datum = params.data as ChartDatum | undefined;
  if (!datum) return "";
  return `{ratio|${datum.formattedValue}}\n{name|${datum.verificationName}}`;
};

const pieChartOptions: VerificationChartOption = {
  animationDuration: 550,
  animationDurationUpdate: 0,
  backgroundColor: "transparent",
  series: [
    {
      avoidLabelOverlap: true,
      center: ["50%", "50%"],
      data: getChartData(defaultPassingChartValue),
      emphasis: { focus: "self", scaleSize: 6 },
      blur: {
        itemStyle: { opacity: 0.28 },
        label: { opacity: 0.35 },
        labelLine: { lineStyle: { opacity: 0.28 } },
      },
      label: {
        alignTo: "edge",
        color: "inherit",
        edgeDistance: 120,
        fontFamily: "Inter, sans-serif",
        fontSize: 10,
        formatter: formatChartLabel,
        lineHeight: 16,
        rich: {
          name: {
            align: "center",
            fontSize: 10,
            fontWeight: 400,
            lineHeight: 12,
            width: 92,
          },
          ratio: {
            align: "center",
            fontSize: 12,
            fontWeight: 700,
            lineHeight: 14,
          },
        },
      },
      labelLine: {
        show: true,
        length: 12,
        length2: 18,
        lineStyle: { color: "#94a3b8", opacity: 0.72, width: 1 },
        smooth: 0.15,
      },
      minAngle: 4,
      radius: ["0%", `${outerChartRadiusPercent}%`],
      roseType: "radius",
      type: "pie",
    },
  ],
};

const EChartsRenderer = (props: EChartsRendererProps) => {
  const { ariaLabel, options, updateOptions } = props;
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<ECharts | null>(null);

  useEffect(() => {
    if (import.meta.env.MODE === "test") return;
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current, undefined, {
      renderer: "svg",
    });
    chartInstanceRef.current = chart;
    chart.setOption(options);

    const resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });
    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.dispose();
      chartInstanceRef.current = null;
    };
  }, [options]);

  useEffect(() => {
    chartInstanceRef.current?.setOption(updateOptions, { lazyUpdate: true });
  }, [updateOptions]);

  return (
    <div ref={chartRef} aria-label={ariaLabel} className="h-full w-full" />
  );
};

const VerificationPieChart = (props: VerificationChartProps) => {
  const { passingChartValue } = props;

  return (
    <EChartsRenderer
      ariaLabel="Verification utilization pie showcase"
      options={pieChartOptions}
      updateOptions={{ series: [{ data: getChartData(passingChartValue) }] }}
    />
  );
};

const activityChartCenter: SvgPoint = { x: 50, y: 50 };

const activityChartInnerRadius = 10;
const activityChartOuterRadius = 38;

const toSvgPoint = (radius: number, angleDegrees: number): SvgPoint => {
  const radians = ((angleDegrees - 90) * Math.PI) / 180;

  return {
    x: activityChartCenter.x + Math.cos(radians) * radius,
    y: activityChartCenter.y + Math.sin(radians) * radius,
  };
};

const getArcPath = (radius: number, progress: number) => {
  if (progress <= 0) return "";

  const angle = Math.min(progress, 0.9999) * 360;
  const start = toSvgPoint(radius, 0);
  const end = toSvgPoint(radius, angle);
  const largeArcFlag = angle > 180 ? 1 : 0;

  return [
    `M ${start.x.toFixed(2)} ${start.y.toFixed(2)}`,
    `A ${radius.toFixed(2)} ${radius.toFixed(2)} 0 ${largeArcFlag} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`,
  ].join(" ");
};

const VerificationPolarBarChart = (props: VerificationChartProps) => {
  const { passingChartValue } = props;
  const [hoveredVerification, setHoveredVerification] = useState<string | null>(
    null,
  );
  const laneCount = applicableVerificationResults.length;
  const laneStep =
    (activityChartOuterRadius - activityChartInnerRadius) /
    Math.max(1, laneCount - 1);
  const strokeWidth = laneStep * 1.32;
  let applicableIndex = 0;
  const activityItems: ActivityItem[] = verificationResults.map((result) => {
    if (result.value === null) {
      return {
        color: getVerificationColor(result.value, passingChartValue),
        completedRevolutions: 0,
        radius: 0,
        remainder: 0,
        result,
      };
    }

    const radius = activityChartOuterRadius - applicableIndex * laneStep;
    const revolutions = result.value / passingChartValue;
    // eslint-disable-next-line react-hooks/immutability
    applicableIndex += 1;

    return {
      color: getVerificationColor(result.value, passingChartValue),
      completedRevolutions: Math.floor(revolutions),
      radius,
      remainder: revolutions % 1,
      result,
    };
  });

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-3">
      <div className="flex min-h-0 flex-1 items-start justify-center">
        <svg
          aria-label="Verification utilization tangential polar showcase"
          className="h-full max-h-[30rem] w-auto max-w-full"
          role="img"
          viewBox="0 0 100 100"
        >
          <defs>
            <filter
              id="activity-ring-shadow"
              colorInterpolationFilters="sRGB"
              height="130%"
              width="130%"
              x="-15%"
              y="-15%"
            >
              <feDropShadow
                dx="0"
                dy="0.38"
                floodColor="#30241a"
                floodOpacity="0.24"
                stdDeviation="0.42"
              />
            </filter>
          </defs>
          {activityItems.map((item) => {
            if (item.result.value === null) return null;
            const isDimmed =
              hoveredVerification !== null &&
              hoveredVerification !== item.result.name;
            const isHovered = hoveredVerification === item.result.name;
            const opacity = isDimmed ? 0.14 : 1;
            const activeStrokeWidth = isHovered
              ? strokeWidth * 1.08
              : strokeWidth;

            return (
              <g
                className="cursor-default transition-opacity duration-150"
                key={item.result.name}
                opacity={opacity}
                onMouseEnter={() => setHoveredVerification(item.result.name)}
                onMouseLeave={() => setHoveredVerification(null)}
              >
                {item.completedRevolutions > 0 && (
                  <circle
                    cx={activityChartCenter.x}
                    cy={activityChartCenter.y}
                    fill="none"
                    filter="url(#activity-ring-shadow)"
                    r={item.radius}
                    stroke={item.color}
                    strokeLinecap="butt"
                    strokeOpacity="1"
                    strokeWidth={activeStrokeWidth}
                  />
                )}
                {(item.remainder > 0 || item.completedRevolutions === 0) && (
                  <path
                    d={getArcPath(item.radius, item.remainder)}
                    fill="none"
                    filter="url(#activity-ring-shadow)"
                    stroke={item.color}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={activeStrokeWidth}
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <div className="grid min-w-0 shrink-0 grid-flow-col grid-rows-6 auto-cols-fr gap-2">
        {activityItems.map((item) => {
          const isApplicable = item.result.value !== null;
          const isDimmed =
            hoveredVerification !== null &&
            hoveredVerification !== item.result.name;
          const isFailed =
            item.result.value !== null && item.result.value > passingChartValue;
          const isWarning =
            !isFailed &&
            item.result.value !== null &&
            item.result.value >= passingChartValue - warningBandWidth;
          const labelFill = !isApplicable
            ? "rgba(229, 231, 235, 0.82)"
            : isFailed
              ? "rgba(199, 131, 127, 0.2)"
              : isWarning
                ? "rgba(223, 200, 111, 0.2)"
                : "rgba(142, 172, 148, 0.2)";
          const labelTextColor = !isApplicable
            ? "#6b7280"
            : isFailed
              ? "#6f2f2d"
              : "#31553d";

          return (
            <div
              className={`flex min-w-0 items-center overflow-hidden rounded-sm px-2 py-1 text-[10px] leading-3 shadow-sm shadow-sand-950/10 transition-opacity duration-150 ${
                isApplicable ? "cursor-default" : ""
              }`}
              key={item.result.name}
              onMouseEnter={
                isApplicable
                  ? () => setHoveredVerification(item.result.name)
                  : undefined
              }
              onMouseLeave={
                isApplicable ? () => setHoveredVerification(null) : undefined
              }
              style={{
                backgroundColor: labelFill,
                color: labelTextColor,
                opacity: isDimmed ? 0.22 : 1,
              }}
            >
              <span className="flex h-full w-12 shrink-0 items-center justify-center font-bold">
                {formatVerificationValue(item.result.value)}
              </span>
              <span className="px-1.5 text-current/55">|</span>
              <span className="min-w-0 flex-1 whitespace-normal break-words text-left">
                {item.result.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Verifications = () => {
  const [passingChartValue, setPassingChartValue] = useState(
    defaultPassingChartValue,
  );
  const [chartMode, setChartMode] = useState<ChartMode>("pie");
  const passingRingSize = `${(getChartRadiusValue(passingChartValue) / maxChartRadiusValue) * outerChartRadiusPercent}%`;

  return (
    <aside className="flex h-full w-full flex-col gap-3 p-4">
      <div className="flex shrink-0 justify-end">
        <div
          aria-label="Chart type"
          className="grid w-44 shrink-0 grid-cols-2 rounded-sm border border-sand-200 bg-white/85 p-1 text-[10px] font-medium shadow-sm shadow-sand-600/10"
          role="group"
        >
          <button
            className={`rounded-[2px] px-2 py-1 transition ${
              chartMode === "pie"
                ? "bg-white text-sand-950 shadow-sm"
                : "text-sand-700 hover:text-sand-950"
            }`}
            onClick={() => setChartMode("pie")}
            type="button"
          >
            Pie
          </button>
          <button
            className={`rounded-[2px] px-2 py-1 transition ${
              chartMode === "polar"
                ? "bg-white text-sand-950 shadow-sm"
                : "text-sand-700 hover:text-sand-950"
            }`}
            onClick={() => setChartMode("polar")}
            type="button"
          >
            Tangential
          </button>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 gap-3">
        <div className="min-w-0 flex-1">
          <div
            className={`relative mx-auto h-full min-h-0 w-full ${
              chartMode === "polar" ? "max-w-[52rem]" : "max-w-[48rem]"
            }`}
          >
            {chartMode === "pie" ? (
              <VerificationPieChart passingChartValue={passingChartValue} />
            ) : (
              <VerificationPolarBarChart
                passingChartValue={passingChartValue}
              />
            )}
            {chartMode === "pie" && (
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 z-20 aspect-square -translate-x-1/2 -translate-y-1/2 overflow-visible transition-[height] duration-200 ease-out"
                style={{ height: passingRingSize }}
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  fill="none"
                  r="48"
                  stroke="#5a4734"
                  strokeDasharray="4 4"
                  strokeLinecap="round"
                  strokeOpacity="0.48"
                  strokeWidth="0.45"
                />
              </svg>
            )}
          </div>
        </div>
        <Slider.Root
          aria-label="Passing threshold"
          className="absolute right-4 top-1/6 mt-8 flex h-48 w-10 shrink-0 flex-col items-center gap-2 rounded-sm border border-sand-200 bg-white/85 px-2 py-3 shadow-sm shadow-sand-600/10"
          format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
          max={maxPassingChartValue}
          min={minPassingChartValue}
          onValueChange={setPassingChartValue}
          orientation="vertical"
          step={passingChartStep}
          value={passingChartValue}
        >
          <div className="flex flex-col items-center gap-0.5 text-[10px] font-medium text-sand-900">
            <Slider.Label>u</Slider.Label>
            <span>{passingChartValue.toFixed(2)}</span>
          </div>
          <Slider.Control className="relative flex min-h-0 flex-1 touch-none items-center justify-center">
            <Slider.Track className="h-full w-1 rounded-full bg-sand-200">
              <Slider.Indicator className="w-full rounded-full bg-envy-500" />
              <Slider.Thumb className="size-3 rounded-full border border-envy-700 bg-white shadow-sm shadow-sand-600/25 outline-none transition focus-visible:ring-2 focus-visible:ring-envy-700/25" />
            </Slider.Track>
          </Slider.Control>
        </Slider.Root>
      </div>
    </aside>
  );
};
