"use client";

import type { EChartsOption } from "echarts";
import ReactECharts from "echarts-for-react";
import { dimensions } from "@/data/dimensions";
import { DimensionContribution } from "@/types";

type DimensionChartClientProps = {
  contributions: DimensionContribution[];
};

const STAY_US_COLOR = "#4F86F7";
const RETURN_CHINA_COLOR = "#F97316";

export default function DimensionChartClient({ contributions }: DimensionChartClientProps) {
  const rankedContributions = [...contributions].sort((left, right) => {
    return Math.abs(right.weightedGap) - Math.abs(left.weightedGap);
  });

  const labels = rankedContributions.map((contribution) => {
    return dimensions.find((dimension) => dimension.id === contribution.dimensionId)?.shortLabel ?? contribution.dimensionId;
  });

  const option: EChartsOption = {
    animationDuration: 500,
    grid: {
      top: 16,
      right: 24,
      bottom: 16,
      left: 88
    },
    xAxis: {
      type: "value",
      splitLine: {
        lineStyle: {
          color: "#d9e1e7"
        }
      },
      axisLabel: {
        color: "#506172",
        fontSize: 11
      }
    },
    yAxis: {
      type: "category",
      data: labels,
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: {
        color: "#132238",
        fontSize: 12
      }
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params) => {
        const firstParam = Array.isArray(params) ? params[0] : params;
        const side = Number(firstParam.value) >= 0 ? "Stay in the US" : "Return to China";
        return `${firstParam.name}<br/>Contribution: ${Math.abs(Number(firstParam.value))}<br/>Supports: ${side}`;
      }
    },
    series: [
      {
        type: "bar",
        data: rankedContributions.map((contribution) => ({
          value: contribution.weightedGap,
          itemStyle: {
            color: contribution.weightedGap >= 0 ? STAY_US_COLOR : RETURN_CHINA_COLOR
          }
        })),
        barWidth: 16,
        label: {
          show: true,
          position: "right",
          color: "#132238",
          fontSize: 11,
          formatter: ({ value }) => {
            const numericValue = Number(value);
            const side = numericValue >= 0 ? "US" : "CN";
            return `${side} ${Math.abs(numericValue)}`;
          }
        }
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: "320px", width: "100%" }} opts={{ renderer: "svg" }} />;
}
