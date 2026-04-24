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
    <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr_1fr]">
      <div className="rounded-xl bg-ink p-5 text-white sm:p-6">
        <p className="text-sm text-white/70">Current direction</p>
        <p className="mt-2 text-2xl font-semibold leading-tight">{recommendedLabel}</p>
        <p className="mt-3 text-sm leading-6 text-white/75">{leadDescription}</p>
        <p className="mt-4 inline-flex rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
          Gap: {difference} points | Confidence: {confidence}
        </p>
      </div>
      <div className="rounded-xl bg-mist p-5 sm:p-6">
        <p className="text-sm font-medium text-ink/60">Stay in the US</p>
        <p className="mt-2 text-4xl font-semibold tracking-tight text-ink">{stayUsScore}</p>
        <p className="mt-2 text-sm leading-6 text-ink/65">Weighted total</p>
      </div>
      <div className="rounded-xl bg-mist p-5 sm:p-6">
        <p className="text-sm font-medium text-ink/60">Return to China</p>
        <p className="mt-2 text-4xl font-semibold tracking-tight text-ink">{returnChinaScore}</p>
        <p className="mt-2 text-sm leading-6 text-ink/65">Weighted total</p>
      </div>
    </div>
  );
}
