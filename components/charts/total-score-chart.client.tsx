"use client";

import type { EChartsOption } from "echarts";
import ReactECharts from "echarts-for-react";

type TotalScoreChartClientProps = {
  stayUsScore: number;
  returnChinaScore: number;
};

const STAY_US_COLOR = "#4F86F7";
const RETURN_CHINA_COLOR = "#F97316";

export default function TotalScoreChartClient({ stayUsScore, returnChinaScore }: TotalScoreChartClientProps) {
  const option: EChartsOption = {
    animationDuration: 500,
    grid: {
      top: 12,
      right: 24,
      bottom: 12,
      left: 92
    },
    xAxis: {
      type: "value",
      max: 100,
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
      data: ["Stay in the US", "Return to China"],
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: {
        color: "#132238",
        fontSize: 12
      }
    },
    series: [
      {
        type: "bar",
        data: [
          { value: stayUsScore, itemStyle: { color: STAY_US_COLOR } },
          { value: returnChinaScore, itemStyle: { color: RETURN_CHINA_COLOR } }
        ],
        barWidth: 18,
        label: {
          show: true,
          position: "right",
          color: "#132238",
          fontSize: 12,
          formatter: ({ value }) => `${value}`
        }
      }
    ],
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" }
    }
  };

  return <ReactECharts option={option} style={{ height: "250px", width: "100%" }} opts={{ renderer: "svg" }} />;
}
