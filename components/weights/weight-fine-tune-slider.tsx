import { Dimension, DimensionId } from "@/types";
import { getWeightPercentage, MIN_WEIGHT } from "@/components/weights/weight-bubble-utils";

type WeightFineTuneSliderProps = {
  dimension: Dimension;
  value: number;
  totalBudget: number;
  maxWeight: number;
  onChange: (dimensionId: DimensionId, value: number) => void;
};

export function WeightFineTuneSlider({
  dimension,
  value,
  totalBudget,
  maxWeight,
  onChange
}: WeightFineTuneSliderProps) {
  const percentage = getWeightPercentage(value, totalBudget);

  return (
    <div className="rounded-[1.5rem] border border-[#eadfce] bg-[#fffaf2] p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">Fine tune</p>
          <h3 className="mt-2 font-serif text-xl font-semibold leading-tight text-ink">
            {dimension.label}
          </h3>
          <p className="mt-2 text-sm leading-6 text-ink/65">{dimension.description}</p>
        </div>
        <div className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#3C5CCF] shadow-sm">
          {percentage}%
        </div>
      </div>

      <input
        type="range"
        min={MIN_WEIGHT}
        max={maxWeight}
        step={0.1}
        value={value}
        onChange={(event) => onChange(dimension.id, Number(event.target.value))}
        aria-label={`Fine tune ${dimension.label} priority`}
        className="mt-5 w-full accent-[#3C5CCF]"
      />

      <div className="mt-2 flex justify-between gap-4 text-xs leading-5 text-ink/55">
        <span>Minimum priority</span>
        <span>Maximum possible share</span>
      </div>
    </div>
  );
}
