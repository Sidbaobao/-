"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { questions } from "@/data/questions";
import { dimensions } from "@/data/dimensions";
import { usePrerequisiteGuard } from "@/lib/guards";
import { filterAnswersToCurrent, loadAppState, saveAnswers } from "@/lib/storage";
import { Answers } from "@/types";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { QuestionCard } from "@/components/questionnaire/question-card";
import { QuestionnaireActions } from "@/components/questionnaire/questionnaire-actions";

export default function QuestionnairePage() {
  const isReady = usePrerequisiteGuard("none");
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers>({});

  useEffect(() => {
    setAnswers(loadAppState().answers);
  }, []);

  const currentAnswers = filterAnswersToCurrent(answers, questions);
  const completedCount = Object.keys(currentAnswers).length;
  const canContinue = completedCount === questions.length;

  const groupedQuestions = dimensions.map((dimension) => ({
    dimension,
    questions: questions.filter((question) => question.dimensionId === dimension.id)
  }));

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

  if (!isReady) {
    return null;
  }

  return (
    <>
      <PageHeader
        eyebrow="Step 1"
        title="Questionnaire"
        description="Answer each question based on your real priorities today. You can come back and change any answer later."
      />

      <SectionCard
        title="Progress"
        description={`${completedCount} of ${questions.length} questions answered. The page will let you continue after all questions are complete.`}
      >
        <div className="h-3 rounded-full bg-mist">
          <div
            className="h-3 rounded-full bg-slateBlue transition-all"
            style={{ width: `${(completedCount / questions.length) * 100}%` }}
          />
        </div>
      </SectionCard>

      <div className="space-y-6">
        {groupedQuestions.map((group) => (
          <SectionCard
            key={group.dimension.id}
            title={group.dimension.label}
            description={group.dimension.description}
          >
            <div className="space-y-4">
              {group.questions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  value={currentAnswers[question.id]}
                  onChange={handleChange}
                />
              ))}
            </div>
          </SectionCard>
        ))}
      </div>

      <QuestionnaireActions canContinue={canContinue} onSave={handleSave} />
    </>
  );
}
