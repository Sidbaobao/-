import dynamic from "next/dynamic";

export const RadarChart = dynamic(() => import("@/components/charts/radar-chart.client"), {
  ssr: false
});
