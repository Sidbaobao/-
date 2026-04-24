import { RecommendationReport } from "@/types";

type ReportSummaryProps = {
  report: RecommendationReport;
};

export function ReportSummary({ report }: ReportSummaryProps) {
  const recommendationLabel = report.recommendedScenario === "stay_us" ? "Stay in the US" : "Return to China";

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-ink p-6 text-white sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-white/65">Current recommendation</p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">{recommendationLabel}</h2>
        <p className="mt-4 max-w-none text-base leading-7 text-white/80">{report.summary}</p>
        <div className="mt-5 rounded-xl bg-white/10 p-4">
          <p className="text-sm font-medium text-white/80">Confidence and uncertainty</p>
          <p className="mt-2 text-sm leading-6 text-white/75">{report.confidenceNote}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-ink/10 bg-white p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-ink">Main Supporting Factors</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-ink/75">
            {report.supportingFactors.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-orange-200 bg-orange-50/70 p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-ink">Why Not the Other Path</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-ink/75">
            {report.whyNotOtherPath.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-ink/10 bg-white p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-ink">Main Risks and Tradeoffs</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-ink/75">
            {report.tradeoffs.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-ink/10 bg-white p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-ink">Suggested Next Steps</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-ink/75">
            {report.nextSteps.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
