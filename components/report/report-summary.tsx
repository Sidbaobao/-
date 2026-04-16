import { RecommendationReport } from "@/types";

type ReportSummaryProps = {
  report: RecommendationReport;
};

export function ReportSummary({ report }: ReportSummaryProps) {
  const recommendationLabel = report.recommendedScenario === "stay_us" ? "Stay in the US" : "Return to China";

  return (
    <div className="space-y-6">
      <div className="rounded-[1.25rem] bg-mist p-6">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal">Recommendation</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">{recommendationLabel}</h2>
        <p className="mt-3 text-base leading-7 text-ink/75">{report.summary}</p>
        <p className="mt-4 text-sm leading-6 text-ink/60">{report.confidenceNote}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.25rem] border border-ink/10 bg-white p-5">
          <h3 className="text-lg font-semibold text-ink">Main Supporting Factors</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-ink/75">
            {report.supportingFactors.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-[1.25rem] border border-ink/10 bg-white p-5">
          <h3 className="text-lg font-semibold text-ink">Why Not the Other Path</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-ink/75">
            {report.whyNotOtherPath.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.25rem] border border-ink/10 bg-white p-5">
          <h3 className="text-lg font-semibold text-ink">Main Risks and Tradeoffs</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-ink/75">
            {report.tradeoffs.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-[1.25rem] border border-ink/10 bg-white p-5">
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
