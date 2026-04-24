import { DimensionId } from "@/types";

type WeightSliderProps = {
  dimensionId: DimensionId;
  label: string;
  description: string;
  value: number;
  onChange: (dimensionId: DimensionId, value: number) => void;
};

export function WeightSlider({ dimensionId, label, description, value, onChange }: WeightSliderProps) {
  const valueLabel = value <= 2 ? "Lower priority" : value === 3 ? "Balanced priority" : "Higher priority";

  return (
    <div className="rounded-xl border border-ink/10 bg-white p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-base font-semibold leading-7 text-ink sm:text-lg">{label}</h3>
          <p className="text-sm leading-6 text-ink/65">{description}</p>
        </div>
        <div className="shrink-0 rounded-xl bg-mist px-3 py-2 text-sm font-semibold text-slateBlue">
          {valueLabel}: {value}
        </div>
      </div>

      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(event) => onChange(dimensionId, Number(event.target.value))}
        className="mt-4 w-full"
      />

      <div className="mt-2 flex justify-between gap-4 text-xs leading-5 text-ink/55">
        <span>Less influence</span>
        <span>More influence</span>
      </div>
    </div>
  );
}
