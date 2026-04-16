import dynamic from "next/dynamic";

export const DimensionChart = dynamic(() => import("@/components/charts/dimension-chart.client"), {
  ssr: false
});
