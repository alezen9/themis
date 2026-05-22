import { Slider } from "@base-ui/react/slider";
import { PieChart } from "echarts/charts";
import { TooltipComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { SVGRenderer } from "echarts/renderers";
import { useEffect, useRef, useState } from "react";

import type { PieSeriesOption } from "echarts/charts";
import type { TooltipComponentOption } from "echarts/components";
import type { ComposeOption, ECharts } from "echarts/core";

echarts.use([
  PieChart,
  SVGRenderer,
  TooltipComponent,
]);

const outerChartRadiusPercent = 58;
const defaultPassingChartValue = 1;
const minPassingChartValue = 0.5;
const maxPassingChartValue = 1.1;
const passingChartStep = 0.05;
const chartLogScaleFactor = 3;
const warningBandWidth = 0.1;

const chartShadowStyle = {
  shadowBlur: 12,
  shadowColor: "rgba(48, 36, 26, 0.18)",
  shadowOffsetX: 0,
  shadowOffsetY: 4,
};

type VerificationChartOption = ComposeOption<
  PieSeriesOption | TooltipComponentOption
>;

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

const notApplicableVerificationResults = verificationResults.filter(
  (result) => result.value === null,
);

const getChartRadiusValue = (value: number) =>
  Math.log1p(value * chartLogScaleFactor);

const maxChartRadiusValue = getChartRadiusValue(
  Math.max(...applicableVerificationResults.map((result) => result.value)),
);

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

const chartOptions: VerificationChartOption = {
  animationDuration: 550,
  animationDurationUpdate: 0,
  backgroundColor: "transparent",
  series: [
    {
      avoidLabelOverlap: true,
      center: ["50%", "50%"],
      data: getChartData(defaultPassingChartValue),
      emphasis: {
        focus: "self",
        scaleSize: 6,
      },
      blur: {
        itemStyle: {
          opacity: 0.28,
        },
        label: {
          opacity: 0.35,
        },
        labelLine: {
          lineStyle: {
            opacity: 0.28,
          },
        },
      },
      label: {
        color: "#334155",
        fontFamily: "Inter, sans-serif",
        fontSize: 12,
        formatter: "{b}",
        lineHeight: 16,
      },
      labelLine: {
        length: 18,
        length2: 14,
        lineStyle: {
          color: "#94a3b8",
        },
      },
      minAngle: 4,
      radius: ["0%", `${outerChartRadiusPercent}%`],
      roseType: "radius",
      type: "pie",
    },
  ],
  tooltip: {
    formatter: (params) => {
      const tooltipParams = Array.isArray(params) ? params[0] : params;
      const data = tooltipParams.data as ChartDatum;
      return `${data.verificationName}: ${data.formattedValue}`;
    },
    trigger: "item",
  },
};

export const Verifications = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<ECharts | null>(null);
  const [passingChartValue, setPassingChartValue] = useState(
    defaultPassingChartValue,
  );
  const passingRingSize = `${(getChartRadiusValue(passingChartValue) / maxChartRadiusValue) * outerChartRadiusPercent}%`;

  useEffect(() => {
    if (import.meta.env.MODE === "test") return;
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current, undefined, {
      renderer: "svg",
    });
    chartInstanceRef.current = chart;
    chart.setOption(chartOptions);

    const resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });
    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.dispose();
      chartInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    chartInstanceRef.current?.setOption(
      {
        series: [{ data: getChartData(passingChartValue) }],
      },
      { lazyUpdate: true },
    );
  }, [passingChartValue]);

  return (
    <aside className="relative w-full h-full grid place-content-center">
      <div className="relative h-[34rem] w-[min(48rem,calc(100vw_-_38rem))] min-w-[34rem]">
        <div
          ref={chartRef}
          aria-label="Verification utilization showcase"
          className="h-full w-full"
        />
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 overflow-visible transition-[height] duration-200 ease-out"
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
      </div>
      <span className="absolute right-4 bottom-4 text-[10px] text-sand-700/60">
        Fake chart data
      </span>
      <div className="absolute right-4 top-4 w-56 rounded-sm border border-sand-200 bg-white/85 px-3 py-2 shadow-sm shadow-sand-600/10">
        <Slider.Root
          aria-label="Passing threshold"
          className="flex w-full flex-col gap-2"
          format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
          max={maxPassingChartValue}
          min={minPassingChartValue}
          onValueChange={setPassingChartValue}
          step={passingChartStep}
          value={passingChartValue}
        >
          <div className="flex items-center justify-between text-[10px] font-medium text-sand-900">
            <Slider.Label>Pass radius</Slider.Label>
            <span>u = {passingChartValue.toFixed(2)}</span>
          </div>
          <Slider.Control className="relative flex h-5 w-full touch-none items-center">
            <Slider.Track className="h-1 w-full rounded-full bg-sand-200">
              <Slider.Indicator className="h-full rounded-full bg-envy-500" />
              <Slider.Thumb className="size-3 rounded-full border border-envy-700 bg-white shadow-sm shadow-sand-600/25 outline-none transition focus-visible:ring-2 focus-visible:ring-envy-700/25" />
            </Slider.Track>
          </Slider.Control>
          <div className="flex justify-between text-[9px] text-sand-800/50">
            <span>{minPassingChartValue.toFixed(2)}</span>
            <span>{maxPassingChartValue.toFixed(2)}</span>
          </div>
        </Slider.Root>
      </div>
      <div className="absolute left-4 bottom-4 max-w-64 text-[10px] leading-4 text-sand-800/70">
        <p>Inputs not applicable to following verifications:</p>
        <ul className="list-disc pl-4">
          {notApplicableVerificationResults.map((result) => (
            <li key={result.name}>{result.name}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
};
