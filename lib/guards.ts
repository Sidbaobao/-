"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { questions } from "@/data/questions";
import { filterAnswersToCurrent, hasCompleteAnswers, hasWeights, loadAppState } from "@/lib/storage";

export type GuardRequirement = "none" | "answers" | "weights";

export function usePrerequisiteGuard(requirement: GuardRequirement) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (requirement === "none") {
      setIsReady(true);
      return;
    }

    const state = loadAppState();
    const currentAnswers = filterAnswersToCurrent(state.answers, questions);
    const answersReady = hasCompleteAnswers({ ...state, answers: currentAnswers }, questions.length);

    if (requirement === "answers" && !answersReady) {
      router.replace("/questionnaire");
      return;
    }

    if (requirement === "weights" && (!answersReady || !hasWeights(state))) {
      router.replace("/questionnaire");
      return;
    }

    setIsReady(true);
  }, [requirement, router]);

  return isReady;
}
