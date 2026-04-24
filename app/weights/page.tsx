"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { defaultWeights, dimensions } from "@/data/dimensions";
import { usePrerequisiteGuard } from "@/lib/guards";
import { loadAppState, saveWeights } from "@/lib/storage";
import { DimensionId, Weights } from "@/types";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { WeightSlider } from "@/components/weights/weight-slider";
import { PrimaryButton } from "@/components/ui/primary-button";

export default function WeightsPage() {
  const isReady = usePrerequisiteGuard("answers");
  const router = useRouter();
  const [weights, setWeights] = useState<Weights>(defaultWeights);

  useEffect(() => {
    setWeights(loadAppState().weights);
  }, []);

  const handleWeightChange = (dimensionId: DimensionId, value: number) => {
    setWeights((currentWeights) => ({
      ...currentWeights,
      [dimensionId]: value
    }));
  };

  const handleSave = () => {
    saveWeights(weights);
    router.push("/results");
  };

  if (!isReady) {
    return null;
  }

  return (
    <>
      <PageHeader
        eyebrow="Step 2"
        title="Set your priorities"
        description="Choose how much each dimension should influence the final result. A higher weight gives that dimension more say in the comparison."
      />

      <SectionCard
        title="How weights work"
        description="This step does not change your answers. It changes how strongly each dimension affects the final score."
        variant="subtle"
      >
        <p className="text-sm leading-6 text-ink/75">
          Example: if family is a major priority for you right now, give it a higher weight than lifestyle.
        </p>
      </SectionCard>

      <div className="space-y-4">
        {dimensions.map((dimension) => (
          <WeightSlider
            key={dimension.id}
            dimensionId={dimension.id}
            label={dimension.label}
            description={dimension.description}
            value={weights[dimension.id]}
            onChange={handleWeightChange}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/questionnaire" className="text-sm font-medium text-ink/70 hover:text-ink">
          Back to questionnaire
        </Link>
        <PrimaryButton onClick={handleSave} className="w-full sm:w-auto">
          Save and continue to results
        </PrimaryButton>
      </div>
    </>
  );
}
