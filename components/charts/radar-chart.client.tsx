"use client";

import type { EChartsOption } from "echarts";
import ReactECharts from "echarts-for-react";
import { dimensions } from "@/data/dimensions";
import { NormalizedDimensionScore } from "@/types";

type RadarChartClientProps = {
  scores: NormalizedDimensionScore[];
};

const STAY_US_COLOR = "#3C5CCF";
const RETURN_CHINA_COLOR = "#D72638";

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
        color: "#625D55",
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
          color: "#EADFCE"
        }
      },
      splitArea: {
        areaStyle: {
          color: ["rgba(255,250,242,0.32)", "rgba(234,223,206,0.28)"]
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
            areaStyle: { color: "rgba(60, 92, 207, 0.12)" }
          },
          {
            value: orderedScores.map((score) => score?.return_china ?? 0),
            name: "Return to China",
            lineStyle: { color: RETURN_CHINA_COLOR, width: 2 },
            itemStyle: { color: RETURN_CHINA_COLOR },
            areaStyle: { color: "rgba(215, 38, 56, 0.10)" }
          }
        ]
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: "280px", width: "100%" }} opts={{ renderer: "svg" }} />;
}
