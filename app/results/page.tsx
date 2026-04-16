"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { questions } from "@/data/questions";
import { dimensions } from "@/data/dimensions";
import { filterAnswersToCurrent, loadAppState } from "@/lib/storage";
import { usePrerequisiteGuard } from "@/lib/guards";
import { scoreDecision } from "@/lib/scoring";
import { AppState } from "@/types";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { ScoreSummary } from "@/components/results/score-summary";
import { TotalScoreChart } from "@/components/charts/total-score-chart";
import { DimensionChart } from "@/components/charts/dimension-chart";
import { RadarChart } from "@/components/charts/radar-chart";
import { DimensionScoreTable } from "@/components/results/dimension-score-table";
import { PrimaryButtonLink } from "@/components/ui/primary-button";

export default function ResultsPage() {
  const isReady = usePrerequisiteGuard("weights");
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    setState(loadAppState());
  }, []);

  const scoringResult = useMemo(() => {
    if (!state) {
      return null;
    }

    const currentAnswers = filterAnswersToCurrent(state.answers, questions);
    return scoreDecision(currentAnswers, state.weights);
  }, [state]);

  if (!isReady || !scoringResult) {
    return null;
  }

  const recommendedLabel =
    scoringResult.recommendedScenario === "stay_us" ? "Stay in the US" : "Return to China";
  const otherLabel = scoringResult.recommendedScenario === "stay_us" ? "Return to China" : "Stay in the US";
  const leadDescription =
    scoringResult.confidence === "low"
      ? `${recommendedLabel} is currently ahead, but the result is still close.`
      : scoringResult.confidence === "medium"
        ? `${recommendedLabel} has a meaningful lead under your current answers and weights.`
        : `${recommendedLabel} has the stronger overall case under your current inputs.`;

  const topContributors = scoringResult.contributions
    .filter((contribution) => contribution.favoredScenario === scoringResult.recommendedScenario)
    .sort((left, right) => Math.abs(right.weightedGap) - Math.abs(left.weightedGap))
    .slice(0, 3);

  const closeDimensions = scoringResult.uncertainDimensions.map((dimensionId) => {
    return dimensions.find((dimension) => dimension.id === dimensionId);
  });

  return (
    <>
      <PageHeader
        eyebrow="Step 3"
        title="Results dashboard"
        description="This page shows how your answers and weights combine into a transparent score comparison."
      />

      <SectionCard title="Score summary" description="These are the weighted totals after normalization.">
        <ScoreSummary
          stayUsScore={scoringResult.weightedTotals.stay_us}
          returnChinaScore={scoringResult.weightedTotals.return_china}
          difference={scoringResult.weightedTotals.difference}
          recommendedLabel={recommendedLabel}
          confidence={scoringResult.confidence}
          leadDescription={leadDescription}
        />
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Total comparison" description="A simple chart wrapper for the overall result.">
          <TotalScoreChart
            stayUsScore={scoringResult.weightedTotals.stay_us}
            returnChinaScore={scoringResult.weightedTotals.return_china}
          />
        </SectionCard>

        <SectionCard title="Dimension comparison" description="This makes it easier to spot where the paths differ.">
          <DimensionChart scores={scoringResult.normalizedByDimension} />
        </SectionCard>
      </div>

      <SectionCard
        title="Optional radar placeholder"
        description="This is included now so a future chart library can be added without changing the page structure."
      >
        <RadarChart />
      </SectionCard>

      <SectionCard title="Dimension score table" description="A simple table for transparent score review.">
        <DimensionScoreTable scores={scoringResult.normalizedByDimension} />
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="What Is Driving the Result"
          description="These dimensions are currently creating the largest weighted separation between the two paths."
        >
          <div className="space-y-3">
            {topContributors.length > 0 ? (
              topContributors.map((contribution) => {
                const dimension = dimensions.find((item) => item.id === contribution.dimensionId);

                return (
                  <div key={contribution.dimensionId} className="rounded-[1rem] bg-mist p-4">
                    <p className="font-medium text-ink">{dimension?.label ?? contribution.dimensionId}</p>
                    <p className="mt-1 text-sm leading-6 text-ink/75">
                      This dimension currently leans toward {recommendedLabel.toLowerCase()} with a weighted gap of{" "}
                      {Math.abs(contribution.weightedGap)} points.
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-sm leading-6 text-ink/75">
                No single dimension is dominating. The current lead comes from several smaller differences adding up.
              </p>
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="Which Dimensions Are Still Close"
          description="Close dimensions are the ones where your current answers do not strongly separate the two paths."
        >
          {closeDimensions.length > 0 ? (
            <div className="space-y-3">
              {closeDimensions.map((dimension) => (
                <div key={dimension?.id} className="rounded-[1rem] bg-mist p-4">
                  <p className="font-medium text-ink">{dimension?.label}</p>
                  <p className="mt-1 text-sm leading-6 text-ink/75">
                    This dimension is currently too close to treat as settled. A change in assumptions here could affect
                    the overall picture.
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm leading-6 text-ink/75">
              None of the dimensions are especially close right now, which means the current result is not being driven
              only by ties or unresolved categories.
            </p>
          )}
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Could Changing Weights Flip the Result?"
          description="This check looks only at dimensions that are currently close and tests how much they could move the outcome."
        >
          <div className="space-y-3 text-sm leading-6 text-ink/75">
            <p>
              Current total gap: <span className="font-medium text-ink">{scoringResult.weightFlipAnalysis.currentTotalGap}</span>
            </p>
            <p>
              Potential shift from close dimensions:{" "}
              <span className="font-medium text-ink">{scoringResult.weightFlipAnalysis.totalPotentialShift}</span>
            </p>
            <p>
              {scoringResult.weightFlipAnalysis.couldFlip
                ? `Weights could realistically flip this result, especially if the close dimensions end up mattering more to you than they do now.`
                : `Changing weights alone is less likely to flip this result because the current lead is larger than the estimated movement from close dimensions.`}
            </p>
          </div>
        </SectionCard>

        <SectionCard
          title="How To Read This Result"
          description="This output is meant to help with structured reflection, not to act like a black-box verdict."
        >
          <div className="space-y-3 text-sm leading-6 text-ink/75">
            <p>
              {recommendedLabel} is currently leading over {otherLabel}, but the result only reflects your present
              answers and weights.
            </p>
            <p>
              The clearest takeaway is not only which path is ahead, but which dimensions are creating that lead and
              which ones still look unsettled.
            </p>
            <p>
              If the result feels close to your own intuition, use it to clarify your next questions. If it feels off,
              the best next step is usually to revisit your answers or weights rather than dismissing the whole tool.
            </p>
          </div>
        </SectionCard>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/weights" className="text-sm font-medium text-ink/70 hover:text-ink">
          Back to weights
        </Link>
        <PrimaryButtonLink href="/report">Continue to report</PrimaryButtonLink>
      </div>
    </>
  );
}
