"use client";

type TotalScoreChartClientProps = {
  stayUsScore: number;
  returnChinaScore: number;
};

export default function TotalScoreChartClient({ stayUsScore, returnChinaScore }: TotalScoreChartClientProps) {
  return (
    <div className="space-y-4 rounded-[1.25rem] bg-mist p-5">
      <p className="text-sm font-medium text-ink/65">Simple placeholder wrapper for a future chart library.</p>

      <div className="space-y-3">
        <div>
          <div className="mb-1 flex items-center justify-between text-sm text-ink/70">
            <span>Stay in the US</span>
            <span>{stayUsScore}</span>
          </div>
          <div className="h-3 rounded-full bg-white">
            <div className="h-3 rounded-full bg-slateBlue" style={{ width: `${stayUsScore}%` }} />
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between text-sm text-ink/70">
            <span>Return to China</span>
            <span>{returnChinaScore}</span>
          </div>
          <div className="h-3 rounded-full bg-white">
            <div className="h-3 rounded-full bg-coral" style={{ width: `${returnChinaScore}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
