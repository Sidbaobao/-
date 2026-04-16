import { DimensionId } from "@/types";

type WeightSliderProps = {
  dimensionId: DimensionId;
  label: string;
  description: string;
  value: number;
  onChange: (dimensionId: DimensionId, value: number) => void;
};

export function WeightSlider({ dimensionId, label, description, value, onChange }: WeightSliderProps) {
  return (
    <div className="rounded-[1.25rem] border border-ink/10 bg-mist/60 p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <h3 className="text-lg font-semibold text-ink">{label}</h3>
          <p className="text-sm leading-6 text-ink/65">{description}</p>
        </div>
        <div className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slateBlue">Weight: {value}</div>
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

      <div className="mt-2 flex justify-between text-xs text-ink/55">
        <span>Lower importance</span>
        <span>Higher importance</span>
      </div>
    </div>
  );
}
