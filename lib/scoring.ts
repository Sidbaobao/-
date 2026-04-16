import { dimensions } from "@/data/dimensions";
import { questions } from "@/data/questions";
import {
  Answers,
  ConfidenceLevel,
  DimensionContribution,
  DimensionId,
  NormalizedDimensionScore,
  RawDimensionScore,
  ScoringResult,
  ScenarioId,
  WeightFlipAnalysis,
  Weights
} from "@/types";
import { clamp, roundToOneDecimal } from "@/lib/utils";

export const UNCERTAIN_DIMENSION_GAP_THRESHOLD = 10;
export const WEIGHT_FLIP_TEST_INCREMENT = 0.2;

function getSelectedOption(questionId: string, optionId: string) {
  const question = questions.find((item) => item.id === questionId);
  return question?.options.find((option) => option.id === optionId);
}

export function calculateRawScoresByDimension(answers: Answers): RawDimensionScore[] {
  return dimensions.map((dimension) => {
    const questionsInDimension = questions.filter((question) => question.dimensionId === dimension.id);

    let stay_us = 0;
    let return_china = 0;
    let maxPossible = 0;

    questionsInDimension.forEach((question) => {
      const selectedOptionId = answers[question.id];
      const selectedOption = selectedOptionId ? getSelectedOption(question.id, selectedOptionId) : undefined;

      if (selectedOption) {
        stay_us += selectedOption.stay_us_score;
        return_china += selectedOption.return_china_score;
      }

      const questionMax = Math.max(
        ...question.options.map((option) => Math.max(option.stay_us_score, option.return_china_score))
      );

      maxPossible += questionMax;
    });

    return {
      dimensionId: dimension.id,
      stay_us,
      return_china,
      maxPossible
    };
  });
}

export function normalizeDimensionScores(rawScores: RawDimensionScore[]): NormalizedDimensionScore[] {
  return rawScores.map((score) => ({
    dimensionId: score.dimensionId,
    stay_us: score.maxPossible === 0 ? 0 : roundToOneDecimal((score.stay_us / score.maxPossible) * 100),
    return_china:
      score.maxPossible === 0 ? 0 : roundToOneDecimal((score.return_china / score.maxPossible) * 100)
  }));
}

export function getConfidenceLevel(difference: number): ConfidenceLevel {
  if (difference < 10) {
    return "low";
  }

  if (difference <= 25) {
    return "medium";
  }

  return "high";
}

export function calculateWeightedTotals(normalizedScores: NormalizedDimensionScore[], weights: Weights) {
  const totalWeight = Object.values(weights).reduce((sum, value) => sum + value, 0) || 1;

  const stay_us = normalizedScores.reduce((sum, score) => {
    return sum + score.stay_us * (weights[score.dimensionId] / totalWeight);
  }, 0);

  const return_china = normalizedScores.reduce((sum, score) => {
    return sum + score.return_china * (weights[score.dimensionId] / totalWeight);
  }, 0);

  const difference = roundToOneDecimal(Math.abs(stay_us - return_china));

  return {
    stay_us: roundToOneDecimal(clamp(stay_us, 0, 100)),
    return_china: roundToOneDecimal(clamp(return_china, 0, 100)),
    difference
  };
}

export function calculateDimensionContributions(
  normalizedScores: NormalizedDimensionScore[],
  weights: Weights
): DimensionContribution[] {
  const totalWeight = Object.values(weights).reduce((sum, value) => sum + value, 0) || 1;

  return normalizedScores.map((score) => {
    const rawGap = roundToOneDecimal(score.stay_us - score.return_china);
    const weightedGap = roundToOneDecimal(rawGap * (weights[score.dimensionId] / totalWeight));

    let favoredScenario: ScenarioId | "tie" = "tie";

    if (rawGap > 0) {
      favoredScenario = "stay_us";
    } else if (rawGap < 0) {
      favoredScenario = "return_china";
    }

    return {
      dimensionId: score.dimensionId,
      rawGap,
      weightedGap,
      favoredScenario
    };
  });
}

export function getUncertainDimensions(contributions: DimensionContribution[]): DimensionId[] {
  return contributions
    .filter((contribution) => Math.abs(contribution.rawGap) <= UNCERTAIN_DIMENSION_GAP_THRESHOLD)
    .map((contribution) => contribution.dimensionId);
}

export function analyzeWeightFlip(
  contributions: DimensionContribution[],
  weightedTotals: { stay_us: number; return_china: number }
): WeightFlipAnalysis {
  const currentTotalGap = roundToOneDecimal(Math.abs(weightedTotals.stay_us - weightedTotals.return_china));
  const uncertainDimensionIds = getUncertainDimensions(contributions);

  const totalPotentialShift = roundToOneDecimal(
    contributions
      .filter((contribution) => uncertainDimensionIds.includes(contribution.dimensionId))
      .reduce((sum, contribution) => {
        return sum + Math.abs(contribution.rawGap) * WEIGHT_FLIP_TEST_INCREMENT;
      }, 0)
  );

  return {
    currentTotalGap,
    uncertainDimensionIds,
    totalPotentialShift,
    couldFlip: totalPotentialShift >= currentTotalGap
  };
}

export function getRecommendedScenario(weightedTotals: { stay_us: number; return_china: number }): ScenarioId {
  return weightedTotals.stay_us >= weightedTotals.return_china ? "stay_us" : "return_china";
}

export function scoreDecision(answers: Answers, weights: Weights): ScoringResult {
  const rawByDimension = calculateRawScoresByDimension(answers);
  const normalizedByDimension = normalizeDimensionScores(rawByDimension);
  const weightedTotals = calculateWeightedTotals(normalizedByDimension, weights);
  const contributions = calculateDimensionContributions(normalizedByDimension, weights);
  const uncertainDimensions = getUncertainDimensions(contributions);
  const weightFlipAnalysis = analyzeWeightFlip(contributions, weightedTotals);
  const recommendedScenario = getRecommendedScenario(weightedTotals);
  const confidence = getConfidenceLevel(weightedTotals.difference);

  return {
    rawByDimension,
    normalizedByDimension,
    weightedTotals,
    contributions,
    uncertainDimensions,
    weightFlipAnalysis,
    recommendedScenario,
    confidence
  };
}
