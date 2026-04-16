import { Dimension, DimensionId, Weights } from "@/types";

export const dimensions: Dimension[] = [
  {
    id: "career",
    label: "Career Opportunity",
    shortLabel: "Career",
    description: "How strongly each path supports job access, role fit, and growth."
  },
  {
    id: "salary_cost",
    label: "Salary and Cost of Living",
    shortLabel: "Money",
    description: "How compensation and living costs feel when taken together."
  },
  {
    id: "immigration",
    label: "Immigration and Policy Uncertainty",
    shortLabel: "Policy",
    description: "How much visa uncertainty and policy change affect your decision."
  },
  {
    id: "family_emotion",
    label: "Family and Emotional Factors",
    shortLabel: "Family",
    description: "How family closeness, support, and emotional comfort shape the choice."
  },
  {
    id: "lifestyle",
    label: "Lifestyle Preference",
    shortLabel: "Lifestyle",
    description: "How daily routines, culture, and environment match your preferences."
  },
  {
    id: "long_term",
    label: "Long-Term Development",
    shortLabel: "Long-Term",
    description: "How each path fits your longer-range goals over the next several years."
  }
];

export const defaultWeights: Weights = dimensions.reduce((accumulator, dimension) => {
  accumulator[dimension.id as DimensionId] = 3;
  return accumulator;
}, {} as Weights);
