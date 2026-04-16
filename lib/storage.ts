"use client";

import { defaultWeights } from "@/data/dimensions";
import { questions } from "@/data/questions";
import { AppState, Answers, Question, Weights } from "@/types";

const STORAGE_KEY = "stay-or-return-v1";
export const QUESTIONS_VERSION = "v2";

type StoredAppState = AppState & {
  questionsVersion?: string;
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function filterAnswersToCurrent(answers: Answers, currentQuestions: Question[]): Answers {
  const validQuestionIds = new Set(currentQuestions.map((question) => question.id));

  return Object.fromEntries(
    Object.entries(answers).filter(([questionId]) => validQuestionIds.has(questionId))
  );
}

export function getDefaultAppState(): AppState {
  return {
    answers: {},
    weights: { ...defaultWeights }
  };
}

export function loadAppState(): AppState {
  if (!canUseStorage()) {
    return getDefaultAppState();
  }

  const rawState = window.localStorage.getItem(STORAGE_KEY);

  if (!rawState) {
    return getDefaultAppState();
  }

  try {
    const parsedState = JSON.parse(rawState) as Partial<StoredAppState>;
    const storedWeights = {
      ...defaultWeights,
      ...(parsedState.weights ?? {})
    };

    if (parsedState.questionsVersion !== QUESTIONS_VERSION) {
      const resetState = {
        answers: {},
        weights: storedWeights
      };

      saveAppState(resetState);
      return resetState;
    }

    const filteredAnswers = filterAnswersToCurrent(parsedState.answers ?? {}, questions);
    const sanitizedState = {
      answers: filteredAnswers,
      weights: storedWeights
    };

    if (Object.keys(filteredAnswers).length !== Object.keys(parsedState.answers ?? {}).length) {
      saveAppState(sanitizedState);
    }

    return sanitizedState;
  } catch {
    return getDefaultAppState();
  }
}

export function saveAppState(state: AppState) {
  if (!canUseStorage()) {
    return;
  }

  const storedState: StoredAppState = {
    ...state,
    answers: filterAnswersToCurrent(state.answers, questions),
    questionsVersion: QUESTIONS_VERSION
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(storedState));
}

export function saveAnswers(answers: Answers) {
  const currentState = loadAppState();
  saveAppState({
    ...currentState,
    answers: filterAnswersToCurrent(answers, questions)
  });
}

export function saveWeights(weights: Weights) {
  const currentState = loadAppState();
  saveAppState({
    ...currentState,
    weights
  });
}

export function resetAppState() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}

export function hasAnyAnswers(state: AppState) {
  return Object.keys(filterAnswersToCurrent(state.answers, questions)).length > 0;
}

export function hasCompleteAnswers(state: AppState, requiredQuestionCount: number) {
  return Object.keys(filterAnswersToCurrent(state.answers, questions)).length >= requiredQuestionCount;
}

export function hasWeights(state: AppState) {
  return Object.keys(state.weights).length > 0;
}
