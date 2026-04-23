"use client";

import type { EChartsOption } from "echarts";
import ReactECharts from "echarts-for-react";
import { dimensions } from "@/data/dimensions";
import { NormalizedDimensionScore } from "@/types";

type RadarChartClientProps = {
  scores: NormalizedDimensionScore[];
};

const STAY_US_COLOR = "#4F86F7";
const RETURN_CHINA_COLOR = "#F97316";

export default function RadarChartClient({ scores }: RadarChartClientProps) {
  const orderedScores = dimensions.map((dimension) => {
    return scores.find((score) => score.dimensionId === dimension.id);
  });

  const option: EChartsOption = {
    animationDuration: 500,
    tooltip: {
      trigger: "item"
    },
    legend: {
      bottom: 0,
      textStyle: {
        color: "#506172",
        fontSize: 11
      }
    },
    radar: {
      radius: "62%",
      splitNumber: 4,
      indicator: dimensions.map((dimension) => ({
        name: dimension.shortLabel,
        max: 100
      })),
      axisName: {
        color: "#132238",
        fontSize: 11
      },
      splitLine: {
        lineStyle: {
          color: "#d9e1e7"
        }
      },
      splitArea: {
        areaStyle: {
          color: ["rgba(255,255,255,0.22)", "rgba(239,244,247,0.45)"]
        }
      }
    },
    series: [
      {
        type: "radar",
        data: [
          {
            value: orderedScores.map((score) => score?.stay_us ?? 0),
            name: "Stay in the US",
            lineStyle: { color: STAY_US_COLOR, width: 2 },
            itemStyle: { color: STAY_US_COLOR },
            areaStyle: { color: "rgba(79, 134, 247, 0.12)" }
          },
          {
            value: orderedScores.map((score) => score?.return_china ?? 0),
            name: "Return to China",
            lineStyle: { color: RETURN_CHINA_COLOR, width: 2 },
            itemStyle: { color: RETURN_CHINA_COLOR },
            areaStyle: { color: "rgba(249, 115, 22, 0.10)" }
          }
        ]
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: "280px", width: "100%" }} opts={{ renderer: "svg" }} />;
}
