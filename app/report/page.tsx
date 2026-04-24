"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { questions } from "@/data/questions";
import { filterAnswersToCurrent, loadAppState } from "@/lib/storage";
import { usePrerequisiteGuard } from "@/lib/guards";
import { scoreDecision } from "@/lib/scoring";
import { buildRecommendationReport } from "@/lib/report";
import { AppState } from "@/types";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { ReportSummary } from "@/components/report/report-summary";

export default function ReportPage() {
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

  const report = useMemo(() => {
    if (!scoringResult) {
      return null;
    }

    return buildRecommendationReport(scoringResult);
  }, [scoringResult]);

  if (!isReady || !report) {
    return null;
  }

  return (
    <>
      <PageHeader
        eyebrow="Step 4"
        title="Recommendation memo"
        description="A compact summary of the current direction, the strongest supporting factors, and the tradeoffs to review before acting."
      />

      <ReportSummary report={report} />

      <SectionCard title="Methodology and disclaimer" variant="subtle">
        <p className="text-sm leading-7 text-ink/75">{report.disclaimer}</p>
      </SectionCard>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/results" className="text-sm font-medium text-ink/70 hover:text-ink">
          Back to results
        </Link>
        <Link href="/questionnaire" className="text-sm font-medium text-slateBlue hover:text-[#3f5ce0]">
          Change answers
        </Link>
      </div>
    </>
  );
}
