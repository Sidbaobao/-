"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  HeartHandshake,
  Scale,
  Sprout,
  Stamp,
  Sun,
  type LucideIcon
} from "lucide-react";
import { questions } from "@/data/questions";
import { dimensions } from "@/data/dimensions";
import { usePrerequisiteGuard } from "@/lib/guards";
import { filterAnswersToCurrent, loadAppState, saveAnswers } from "@/lib/storage";
import { Answers, Dimension, DimensionId } from "@/types";
import { PageHeader } from "@/components/ui/page-header";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SectionCard } from "@/components/ui/section-card";
import { QuestionCard } from "@/components/questionnaire/question-card";

const groupedQuestions = dimensions.map((dimension) => ({
  dimension,
  questions: questions.filter((question) => question.dimensionId === dimension.id)
}));

const dimensionIntroById: Record<
  DimensionId,
  {
    Icon: LucideIcon;
    guidingQuestion: string;
  }
> = {
  career: {
    Icon: Briefcase,
    guidingQuestion: "Where can you realistically build the career you want?"
  },
  salary_cost: {
    Icon: Scale,
    guidingQuestion: "Where does your money actually go further for the life you want?"
  },
  immigration: {
    Icon: Stamp,
    guidingQuestion: "How much does visa and status uncertainty weigh on you?"
  },
  family_emotion: {
    Icon: HeartHandshake,
    guidingQuestion: "How strong is the pull of the people back home?"
  },
  lifestyle: {
    Icon: Sun,
    guidingQuestion: "Which daily life genuinely feels more like you?"
  },
  long_term: {
    Icon: Sprout,
    guidingQuestion: "Which path do you trust more over the next ten years?"
  }
};

type DimensionProgressRingProps = {
  answeredCount: number;
  totalCount: number;
  isCurrent: boolean;
  isComplete: boolean;
};

function DimensionProgressRing({
  answeredCount,
  totalCount,
  isCurrent,
  isComplete
}: DimensionProgressRingProps) {
  const size = isCurrent ? 52 : 46;
  const strokeWidth = 4;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = totalCount === 0 ? 0 : answeredCount / totalCount;
  const dashOffset = circumference * (1 - progressRatio);

  return (
    <div
      className={`relative shrink-0 rounded-full ${
        isCurrent ? "bg-[#3C5CCF]/10 p-1 shadow-sm" : "bg-white/70 p-0.5"
      }`}
      aria-label={`${answeredCount} of ${totalCount} questions answered`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-hidden="true"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill={isComplete ? "#3C5CCF" : "transparent"}
          stroke="#E8E1D5"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="#3C5CCF"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
          className="transition-all duration-300"
        />
        {isComplete ? (
          <path
            d={`M ${center - 8} ${center + 1} L ${center - 2} ${center + 7} L ${
              center + 10
            } ${center - 8}`}
            fill="none"
            stroke="#FFFFFF"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
          />
        ) : (
          <text
            x={center}
            y={center + 4}
            textAnchor="middle"
            className="fill-ink text-[10px] font-semibold"
          >
            {answeredCount}/{totalCount}
          </text>
        )}
      </svg>
    </div>
  );
}

type DimensionIntroHeaderProps = {
  dimension: Dimension;
};

function DimensionIntroHeader({ dimension }: DimensionIntroHeaderProps) {
  const { Icon, guidingQuestion } = dimensionIntroById[dimension.id];

  return (
    <div className="rounded-[1.75rem] border border-[#eadfce] bg-[#fffaf2] p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-coral/10 text-coral shadow-sm">
          <Icon aria-hidden="true" strokeWidth={1.8} className="h-7 w-7" />
        </div>

        <div className="min-w-0 space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
              Current dimension
            </p>
            <h2 className="mt-2 font-serif text-2xl font-semibold leading-tight text-ink sm:text-3xl">
              {dimension.label}
            </h2>
          </div>
          <p className="max-w-3xl text-sm leading-6 text-ink/70 sm:text-base">
            {dimension.description}
          </p>
          <p className="max-w-3xl rounded-2xl border border-coral/15 bg-white/70 px-4 py-3 text-sm font-medium leading-6 text-ink">
            {guidingQuestion}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function QuestionnairePage() {
  const isReady = usePrerequisiteGuard("none");
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers>({});
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const loadedAnswers = filterAnswersToCurrent(loadAppState().answers, questions);
    const firstIncompleteIndex = groupedQuestions.findIndex((group) =>
      group.questions.some((question) => !loadedAnswers[question.id])
    );

    setAnswers(loadedAnswers);
    setCurrentStepIndex(firstIncompleteIndex === -1 ? 0 : firstIncompleteIndex);
  }, []);

  const currentAnswers = filterAnswersToCurrent(answers, questions);
  const completedCount = Object.keys(currentAnswers).length;
  const canContinue = completedCount === questions.length;
  const progressPercent = Math.round((completedCount / questions.length) * 100);
  const currentGroup = groupedQuestions[currentStepIndex] ?? groupedQuestions[0];
  const currentGroupAnsweredCount =
    currentGroup?.questions.filter((question) => currentAnswers[question.id]).length ?? 0;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === groupedQuestions.length - 1;

  const handleChange = (questionId: string, optionId: string) => {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionId]: optionId
    }));
  };

  const handleSave = () => {
    saveAnswers(currentAnswers);
    router.push("/weights");
  };

  const goToPreviousStep = () => {
    setCurrentStepIndex((currentIndex) => Math.max(currentIndex - 1, 0));
  };

  const goToNextStep = () => {
    setCurrentStepIndex((currentIndex) =>
      Math.min(currentIndex + 1, groupedQuestions.length - 1)
    );
  };

  if (!isReady) {
    return null;
  }

  return (
    <>
      <PageHeader
        eyebrow="Step 1"
        title="Questionnaire"
        description="Answer based on your current situation. You can come back and change any response before reviewing results."
      />

      <div className="sticky top-3 z-20 rounded-full border border-[#eadfce] bg-[#fffaf2]/95 px-4 py-3 shadow-sm backdrop-blur">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-ink/70">
          <span>
            {completedCount} of {questions.length} answered
          </span>
          <span>{progressPercent}% complete</span>
        </div>
        <div className="h-2 rounded-full bg-[#3C5CCF]/10">
          <div
            className="h-2 rounded-full bg-[#3C5CCF] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <SectionCard
        title="Your progress"
        description={
          canContinue
            ? "All questions are complete. You can continue to priority weights."
            : `${completedCount} of ${questions.length} questions answered. Complete the remaining questions to continue.`
        }
      >
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="font-medium text-ink">{progressPercent}% complete</span>
          <span className="text-ink/60">{questions.length - completedCount} remaining</span>
        </div>
        <div className="h-3 rounded-full bg-mist">
          <div
            className="h-3 rounded-full bg-slateBlue transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Questionnaire steps"
        description="Move through one decision dimension at a time. You can jump back to any step without losing your selected answers."
        variant="subtle"
      >
        <div className="-mx-2 overflow-x-auto px-2">
          <div className="flex min-w-max gap-3 pb-1">
            {groupedQuestions.map((group, index) => {
              const answeredCount = group.questions.filter(
                (question) => currentAnswers[question.id]
              ).length;
              const isComplete = answeredCount === group.questions.length;
              const isCurrent = index === currentStepIndex;

              return (
                <button
                  key={group.dimension.id}
                  type="button"
                  onClick={() => setCurrentStepIndex(index)}
                  className={`min-w-64 rounded-2xl border p-4 text-left transition ${
                    isCurrent
                      ? "border-coral/50 bg-[#fff3ec] text-ink shadow-sm"
                      : isComplete
                        ? "border-[#3C5CCF]/30 bg-white/85 text-ink hover:border-[#3C5CCF]/45"
                        : "border-ink/10 bg-[#fffdf8] text-ink/65 hover:border-coral/35"
                  }`}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  <span className="flex items-start gap-3">
                    <DimensionProgressRing
                      answeredCount={answeredCount}
                      totalCount={group.questions.length}
                      isCurrent={isCurrent}
                      isComplete={isComplete}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-semibold uppercase tracking-[0.2em]">
                        Step {index + 1}
                      </span>
                      <span className="mt-2 block text-sm font-semibold leading-5">
                        {group.dimension.label}
                      </span>
                      <span className="mt-3 block text-xs text-ink/55">
                        {isComplete ? "Done" : `${answeredCount} of ${group.questions.length}`}
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </SectionCard>

      {currentGroup ? (
        <SectionCard variant="subtle">
          <DimensionIntroHeader dimension={currentGroup.dimension} />

          <div className="mb-6 mt-6 rounded-2xl border border-[#eadfce] bg-[#fffdf8] p-4 text-sm text-ink/65">
            <span className="font-medium text-ink">
              {currentGroupAnsweredCount} of {currentGroup.questions.length}
            </span>{" "}
            questions answered in this dimension.
          </div>

          <div className="space-y-4">
            {currentGroup.questions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                value={currentAnswers[question.id]}
                onChange={handleChange}
              />
            ))}
          </div>
        </SectionCard>
      ) : null}

      <div className="flex flex-col gap-3 rounded-[1.5rem] border border-ink/10 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-medium text-ink/65 transition hover:bg-mist hover:text-ink sm:justify-start"
        >
          Back to home
        </Link>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          {!isFirstStep ? (
            <button
              type="button"
              onClick={goToPreviousStep}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-ink/10 px-5 text-sm font-medium text-ink transition hover:border-ink/20 hover:bg-mist"
            >
              Previous
            </button>
          ) : null}

          {isLastStep ? (
            <PrimaryButton onClick={handleSave} disabled={!canContinue} className="w-full sm:w-auto">
              Save and continue to weights
            </PrimaryButton>
          ) : (
            <PrimaryButton type="button" onClick={goToNextStep} className="w-full sm:w-auto">
              Next
            </PrimaryButton>
          )}
        </div>
      </div>
    </>
  );
}
