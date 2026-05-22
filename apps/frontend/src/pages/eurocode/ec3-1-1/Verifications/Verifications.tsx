import { PieChart } from "echarts/charts";
import { TooltipComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { useEffect, useRef } from "react";

import type { PieSeriesOption } from "echarts/charts";
import type { TooltipComponentOption } from "echarts/components";
import type { ComposeOption } from "echarts/core";

echarts.use([
  CanvasRenderer,
  PieChart,
  TooltipComponent,
]);

const maxChartValue = 1.1;

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
  { name: "Major-axis bending", value: 0.86 },
  { name: "Minor-axis bending", value: 0.53 },
  { name: "Shear y", value: 0.31 },
  { name: "Shear z", value: 0.67 },
  { name: "Torsion", value: null },
  { name: "Shear + torsion", value: 0.92 },
  { name: "Bending + shear", value: 0.74 },
  { name: "Axial + bending", value: 1.04 },
  { name: "Major flexural buckling", value: 0.89 },
  { name: "Minor flexural buckling", value: 1.12 },
  { name: "Torsional buckling", value: null },
  { name: "Flexural-torsional buckling", value: 1.36 },
  { name: "Lateral torsional buckling", value: 0.97 },
  { name: "Interaction 6.61", value: 1.18 },
  { name: "Interaction 6.62", value: 0.82 },
  { name: "Interaction 6.63", value: 2.5 },
  { name: "Interaction 6.64", value: 1.43 },
  { name: "Web bearing", value: 0.58 },
  { name: "Web buckling", value: null },
  { name: "Serviceability", value: 0.69 },
] as const;

const getVerificationColor = (value: number | null) => {
  if (value === null) return "#e3dcc5";
  if (value > 1) return "#b36b68";
  if (value >= 0.9) return "#e0c44f";
  return "#56765e";
};

const formatVerificationValue = (value: number | null) => {
  if (value === null) return "N/A";
  return value.toFixed(2);
};

const chartData = verificationResults.map((result) => ({
  actualValue: result.value,
  name: `${result.name}: ${formatVerificationValue(result.value)}`,
  value:
    result.value === null ? 1 : Math.min(result.value, maxChartValue),
  itemStyle: {
    ...chartShadowStyle,
    color: getVerificationColor(result.value),
  },
}));

const chartOptions: VerificationChartOption = {
  animationDuration: 550,
  backgroundColor: "transparent",
  series: [
    {
      avoidLabelOverlap: true,
      center: ["50%", "50%"],
      data: chartData,
      emphasis: {
        scaleSize: 6,
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
      radius: ["0%", "58%"],
      roseType: "radius",
      type: "pie",
    },
  ],
  tooltip: {
    formatter: (params) => {
      const tooltipParams = Array.isArray(params) ? params[0] : params;
      const data = tooltipParams.data as (typeof chartData)[number];
      return `${data.name}`;
    },
    trigger: "item",
  },
};

export const Verifications = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (import.meta.env.MODE === "test") return;
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    chart.setOption(chartOptions);

    const resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });
    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.dispose();
    };
  }, []);

  return (
    <aside className="relative w-full h-full grid place-content-center">
      <div
        ref={chartRef}
        aria-label="Verification utilization showcase"
        className="h-[34rem] w-[min(48rem,calc(100vw_-_38rem))] min-w-[34rem]"
      />
      <span className="absolute right-4 bottom-4 text-[10px] text-sand-700/60">
        Fake chart data
      </span>
    </aside>
  );
};
