import {
  Briefcase,
  Check,
  HeartHandshake,
  Scale,
  Sprout,
  Stamp,
  Sun,
  type LucideIcon
} from "lucide-react";
import { dimensions } from "@/data/dimensions";
import { DimensionId, RecommendationReport, ScoringResult, ScenarioId } from "@/types";

type ReportSummaryProps = {
  report: RecommendationReport;
  scoringResult: ScoringResult;
  generatedDate: string;
};

const dimensionIcons: Record<DimensionId, LucideIcon> = {
  career: Briefcase,
  salary_cost: Scale,
  immigration: Stamp,
  family_emotion: HeartHandshake,
  lifestyle: Sun,
  long_term: Sprout
};

const scenarioLabels: Record<ScenarioId, string> = {
  stay_us: "Stay in the US",
  return_china: "Return to China"
};

const confidenceLabels = {
  low: "Low confidence",
  medium: "Moderate confidence",
  high: "High confidence"
} as const;

function formatScore(value: number) {
  return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
}

function normalizeDisplayedSummary(summary: string) {
  return summary
    .replace(/\bresponses leans\b/g, "responses lean")
    .replace(/\bresponses points\b/g, "responses point");
}

export function ReportSummary({ report, scoringResult, generatedDate }: ReportSummaryProps) {
  const recommendationLabel = scenarioLabels[report.recommendedScenario];
  const displayedSummary = normalizeDisplayedSummary(report.summary);

  return (
    <article className="decision-memo overflow-hidden rounded-[1.75rem] border border-[#eadfce] bg-[#fffaf2] shadow-sm">
      <header className="memo-block px-6 pb-7 pt-7 sm:px-10 sm:pb-8 sm:pt-8 lg:px-14">
        <div className="flex flex-col gap-3 border-b border-ink/15 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <p className="font-serif text-2xl font-semibold tracking-[-0.02em] text-ink">Decision Memo</p>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-ink/50">{generatedDate}</p>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-ink/60">
          A personal memo on whether to stay in the US or return to China.
        </p>
      </header>

      <section className="memo-block border-t border-[#eadfce] px-6 py-8 sm:px-10 sm:py-9 lg:px-14 lg:py-10" aria-labelledby="recommendation-heading">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/45">Recommendation</p>
          <h1 id="recommendation-heading" className="mt-3 font-serif text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-ink sm:text-5xl lg:text-6xl">
            {recommendationLabel}.
          </h1>
          <span className="mt-5 inline-flex rounded-full border border-[#dfd4c4] bg-white/55 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-ink/65">
            {confidenceLabels[report.confidence]}
          </span>
        </div>
      </section>

      <section className="memo-block border-t border-[#eadfce]" aria-labelledby="summary-heading">
        <div className="px-6 py-8 sm:px-10 sm:py-9 lg:px-14 lg:py-10">
          <h2 id="summary-heading" className="font-serif text-2xl font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-3xl">
            Executive summary
          </h2>
          <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-ink/80">{displayedSummary}</p>
        </div>
      </section>

      <section className="memo-comparison border-t border-[#eadfce] px-6 py-9 sm:px-10 sm:py-10 lg:px-14 lg:py-11" aria-labelledby="comparison-heading">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">Why not the other path</p>
          <h2 id="comparison-heading" className="mt-3 max-w-3xl font-serif text-3xl font-semibold leading-tight tracking-[-0.025em] text-ink sm:text-4xl">
            What each path gives you, and what it asks you to accept.
          </h2>
        </div>

        <div className="mt-8 border-y border-[#dcd3c7]">
          <div className="grid grid-cols-2 border-b border-[#dcd3c7] text-sm font-semibold sm:grid-cols-[1.15fr_1fr_1fr]">
            <div className="hidden px-5 py-4 text-ink/45 sm:block">Dimension</div>
            <div className="bg-[#3C5CCF] px-4 py-3.5 text-white sm:border-l sm:border-[#dcd3c7] sm:px-5 sm:py-4">Stay in the US</div>
            <div className="border-l border-white/25 bg-[#D72638] px-4 py-3.5 text-white sm:border-[#dcd3c7] sm:px-5 sm:py-4">Return to China</div>
          </div>

          <div className="divide-y divide-[#e6ded2]">
            {scoringResult.normalizedByDimension.map((score) => {
              const dimension = dimensions.find((item) => item.id === score.dimensionId);
              const Icon = dimensionIcons[score.dimensionId];
              const stayIsHigher = score.stay_us > score.return_china;
              const returnIsHigher = score.return_china > score.stay_us;
              const isBalanced = score.stay_us === score.return_china;

              return (
                <div key={score.dimensionId} className="grid grid-cols-2 sm:grid-cols-[1.15fr_1fr_1fr]">
                  <div className="col-span-2 flex items-center gap-3 border-b border-[#eee7de] px-4 py-4 sm:col-span-1 sm:border-b-0 sm:px-5">
                    <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-ink/45" strokeWidth={1.6} />
                    <span className="text-sm font-medium text-ink">{dimension?.label ?? score.dimensionId}</span>
                    {isBalanced ? (
                      <span className="ml-auto text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-ink/40">Balanced</span>
                    ) : null}
                  </div>
                  <div className={`flex items-center justify-end border-l border-[#e6ded2] px-4 py-4 sm:px-5 ${stayIsHigher ? "bg-[#3C5CCF]/[0.07]" : ""}`}>
                    <span className={`font-serif text-2xl text-[#3C5CCF] ${stayIsHigher ? "font-semibold" : "font-medium opacity-60"}`}>
                      {formatScore(score.stay_us)}
                    </span>
                  </div>
                  <div className={`flex items-center justify-end border-l border-[#e6ded2] px-4 py-4 sm:px-5 ${returnIsHigher ? "bg-[#D72638]/[0.06]" : ""}`}>
                    <span className={`font-serif text-2xl text-[#D72638] ${returnIsHigher ? "font-semibold" : "font-medium opacity-60"}`}>
                      {formatScore(score.return_china)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="mt-4 text-xs leading-5 text-ink/45">Higher values are emphasized. Scores reflect the same dimension data used in your results.</p>
      </section>

      <div className="grid border-t border-[#eadfce] lg:grid-cols-[0.9fr_1.1fr]">
        <section className="memo-block border-b border-[#eadfce] px-6 py-9 sm:px-10 lg:border-b-0 lg:border-r lg:px-14 lg:py-10" aria-labelledby="risks-heading">
          <h2 id="risks-heading" className="font-serif text-2xl font-semibold tracking-[-0.02em] text-ink sm:text-3xl">Risks & uncertainty</h2>
          <ul className="mt-5 space-y-4">
            {report.tradeoffs.slice(1).map((item) => (
              <li key={item} className="border-l border-ink/20 pl-4 text-sm leading-6 text-ink/70">{item}</li>
            ))}
          </ul>
        </section>

        <section className="memo-block px-6 py-9 sm:px-10 lg:px-14 lg:py-10" aria-labelledby="next-steps-heading">
          <h2 id="next-steps-heading" className="font-serif text-2xl font-semibold tracking-[-0.02em] text-ink sm:text-3xl">Next steps</h2>
          <ul className="mt-5 space-y-4">
            {report.nextSteps.map((item) => (
              <li key={item} className="grid grid-cols-[auto_1fr] gap-3 text-sm leading-6 text-ink/75">
                <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded border border-ink/25 text-ink/60">
                  <Check aria-hidden="true" className="h-3 w-3" strokeWidth={2} />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <footer className="memo-block border-t border-ink/10 px-6 py-8 sm:px-10 lg:px-14">
        <p className="max-w-3xl text-xs leading-5 text-ink/50">{report.disclaimer}</p>
        <p className="mt-7 font-serif text-base font-semibold text-ink/70">This reflects my thinking as of {generatedDate}.</p>
      </footer>
    </article>
  );
}
