import { DimensionId, Weights } from "@/types";

export const MIN_WEIGHT = 1;
export const WEIGHT_STEP = 1;
const EPSILON = 0.000001;

function roundWeight(value: number) {
  return Number(value.toFixed(6));
}

function sumWeights(weights: Weights, dimensionIds: DimensionId[]) {
  return dimensionIds.reduce((sum, dimensionId) => sum + (weights[dimensionId] ?? 0), 0);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function getWeightTotal(weights: Weights, dimensionIds: DimensionId[]) {
  return sumWeights(weights, dimensionIds);
}

export function getWeightPercentage(weight: number, totalBudget: number) {
  if (totalBudget <= 0) {
    return 0;
  }

  return Number(((weight / totalBudget) * 100).toFixed(1));
}

export function getMaxWeight(totalBudget: number, dimensionCount: number) {
  return totalBudget - (dimensionCount - 1) * MIN_WEIGHT;
}

export function canIncreaseWeight(weights: Weights, dimensionId: DimensionId, dimensionIds: DimensionId[]) {
  return dimensionIds
    .filter((id) => id !== dimensionId)
    .some((id) => (weights[id] ?? MIN_WEIGHT) > MIN_WEIGHT + EPSILON);
}

export function canDecreaseWeight(weights: Weights, dimensionId: DimensionId) {
  return (weights[dimensionId] ?? MIN_WEIGHT) > MIN_WEIGHT + EPSILON;
}

function correctTotal(
  weights: Weights,
  dimensionIds: DimensionId[],
  totalBudget: number,
  preferredDimensionId: DimensionId
) {
  const nextWeights = { ...weights };
  const currentTotal = sumWeights(nextWeights, dimensionIds);
  const difference = totalBudget - currentTotal;

  if (Math.abs(difference) <= EPSILON) {
    dimensionIds.forEach((dimensionId) => {
      nextWeights[dimensionId] = roundWeight(nextWeights[dimensionId]);
    });

    return nextWeights;
  }

  if (difference > 0) {
    nextWeights[preferredDimensionId] = (nextWeights[preferredDimensionId] ?? MIN_WEIGHT) + difference;
  } else {
    const dimensionToReduce = dimensionIds.reduce((bestId, dimensionId) => {
      const currentCapacity = Math.max((nextWeights[dimensionId] ?? MIN_WEIGHT) - MIN_WEIGHT, 0);
      const bestCapacity = Math.max((nextWeights[bestId] ?? MIN_WEIGHT) - MIN_WEIGHT, 0);
      return currentCapacity > bestCapacity ? dimensionId : bestId;
    }, preferredDimensionId);

    nextWeights[dimensionToReduce] = Math.max(
      MIN_WEIGHT,
      (nextWeights[dimensionToReduce] ?? MIN_WEIGHT) + difference
    );
  }

  dimensionIds.forEach((dimensionId) => {
    nextWeights[dimensionId] = roundWeight(nextWeights[dimensionId]);
  });

  return nextWeights;
}

export function setDimensionWeight(
  weights: Weights,
  dimensionId: DimensionId,
  desiredWeight: number,
  dimensionIds: DimensionId[],
  totalBudget: number
) {
  const maxWeight = getMaxWeight(totalBudget, dimensionIds.length);
  const currentWeight = weights[dimensionId] ?? MIN_WEIGHT;
  const targetWeight = clamp(desiredWeight, MIN_WEIGHT, maxWeight);
  const requestedDelta = targetWeight - currentWeight;

  if (Math.abs(requestedDelta) <= EPSILON) {
    return correctTotal(weights, dimensionIds, totalBudget, dimensionId);
  }

  const nextWeights = { ...weights };
  const otherDimensionIds = dimensionIds.filter((id) => id !== dimensionId);

  if (requestedDelta > 0) {
    const removableTotal = otherDimensionIds.reduce((sum, id) => {
      return sum + Math.max((weights[id] ?? MIN_WEIGHT) - MIN_WEIGHT, 0);
    }, 0);

    const actualDelta = Math.min(requestedDelta, removableTotal);

    if (actualDelta <= EPSILON) {
      return correctTotal(weights, dimensionIds, totalBudget, dimensionId);
    }

    nextWeights[dimensionId] = currentWeight + actualDelta;

    otherDimensionIds.forEach((id) => {
      const removableFromThisDimension = Math.max((weights[id] ?? MIN_WEIGHT) - MIN_WEIGHT, 0);
      const reduction =
        removableTotal <= EPSILON ? 0 : actualDelta * (removableFromThisDimension / removableTotal);
      nextWeights[id] = Math.max(MIN_WEIGHT, (weights[id] ?? MIN_WEIGHT) - reduction);
    });
  } else {
    const actualDelta = Math.min(Math.abs(requestedDelta), Math.max(currentWeight - MIN_WEIGHT, 0));

    if (actualDelta <= EPSILON) {
      return correctTotal(weights, dimensionIds, totalBudget, dimensionId);
    }

    nextWeights[dimensionId] = currentWeight - actualDelta;

    const otherTotal = otherDimensionIds.reduce((sum, id) => sum + (weights[id] ?? MIN_WEIGHT), 0);

    otherDimensionIds.forEach((id) => {
      const share = otherTotal <= EPSILON ? 1 / otherDimensionIds.length : (weights[id] ?? MIN_WEIGHT) / otherTotal;
      nextWeights[id] = (weights[id] ?? MIN_WEIGHT) + actualDelta * share;
    });
  }

  return correctTotal(nextWeights, dimensionIds, totalBudget, dimensionId);
}

export function stepDimensionWeight(
  weights: Weights,
  dimensionId: DimensionId,
  direction: "increase" | "decrease",
  dimensionIds: DimensionId[],
  totalBudget: number
) {
  const currentWeight = weights[dimensionId] ?? MIN_WEIGHT;
  const nextTarget = direction === "increase" ? currentWeight + WEIGHT_STEP : currentWeight - WEIGHT_STEP;

  return setDimensionWeight(weights, dimensionId, nextTarget, dimensionIds, totalBudget);
}
