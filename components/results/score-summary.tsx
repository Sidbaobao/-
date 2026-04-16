type ScoreSummaryProps = {
  stayUsScore: number;
  returnChinaScore: number;
  difference: number;
  recommendedLabel: string;
  confidence: string;
  leadDescription: string;
};

export function ScoreSummary({
  stayUsScore,
  returnChinaScore,
  difference,
  recommendedLabel,
  confidence,
  leadDescription
}: ScoreSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-[1.25rem] bg-mist p-5">
        <p className="text-sm text-ink/60">Stay in the US</p>
        <p className="mt-2 text-3xl font-semibold text-ink">{stayUsScore}</p>
      </div>
      <div className="rounded-[1.25rem] bg-mist p-5">
        <p className="text-sm text-ink/60">Return to China</p>
        <p className="mt-2 text-3xl font-semibold text-ink">{returnChinaScore}</p>
      </div>
      <div className="rounded-[1.25rem] bg-ink p-5 text-white">
        <p className="text-sm text-white/70">Current recommendation</p>
        <p className="mt-2 text-xl font-semibold">{recommendedLabel}</p>
        <p className="mt-2 text-sm text-white/75">Gap: {difference} points | Confidence: {confidence}</p>
        <p className="mt-2 text-sm leading-6 text-white/75">{leadDescription}</p>
      </div>
    </div>
  );
}
