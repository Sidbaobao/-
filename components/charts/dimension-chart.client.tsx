"use client";

import { dimensions } from "@/data/dimensions";
import { NormalizedDimensionScore } from "@/types";

type DimensionChartClientProps = {
  scores: NormalizedDimensionScore[];
};

export default function DimensionChartClient({ scores }: DimensionChartClientProps) {
  return (
    <div className="space-y-4 rounded-[1.25rem] bg-mist p-5">
      <p className="text-sm font-medium text-ink/65">Dimension-by-dimension chart placeholder.</p>

      {scores.map((score) => {
        const dimension = dimensions.find((item) => item.id === score.dimensionId);

        return (
          <div key={score.dimensionId} className="space-y-2">
            <p className="text-sm font-medium text-ink">{dimension?.shortLabel ?? score.dimensionId}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-full bg-white p-1">
                <div className="h-3 rounded-full bg-slateBlue" style={{ width: `${score.stay_us}%` }} />
              </div>
              <div className="rounded-full bg-white p-1">
                <div className="h-3 rounded-full bg-coral" style={{ width: `${score.return_china}%` }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
