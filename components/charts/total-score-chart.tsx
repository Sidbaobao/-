import dynamic from "next/dynamic";

export const TotalScoreChart = dynamic(() => import("@/components/charts/total-score-chart.client"), {
  ssr: false
});
