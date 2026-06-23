import { Question } from "@/types";

type QuestionCardProps = {
  question: Question;
  value?: string;
  onChange: (questionId: string, optionId: string) => void;
};

export function QuestionCard({ question, value, onChange }: QuestionCardProps) {
  return (
    <div className="rounded-card border border-ink/10 bg-surface-strong p-5 shadow-legacy-sm">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold leading-tight text-ink sm:text-xl">{question.prompt}</h3>
        {question.helpText ? <p className="text-sm leading-6 text-ink/65">{question.helpText}</p> : null}
      </div>

      <div className="mt-5 space-y-3">
        {question.options.map((option) => {
          const isSelected = value === option.id;

          return (
            <label
              key={option.id}
              className={`group block cursor-pointer rounded-option border px-5 py-4 transition duration-200 focus-within:ring-2 focus-within:ring-accent-warm/30 focus-within:ring-offset-2 focus-within:ring-offset-canvas ${
                isSelected
                  ? "border-accent-warm/70 bg-surface-selected shadow-legacy-sm"
                  : "border-ink/10 bg-surface-raised hover:border-accent-warm/40 hover:bg-surface-strong hover:shadow-legacy-sm"
              }`}
            >
              <input
                type="radio"
                name={question.id}
                value={option.id}
                checked={isSelected}
                onChange={() => onChange(question.id, option.id)}
                className="sr-only"
              />
              <div className="flex items-start gap-4">
                <span
                  className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-pill border transition ${
                    isSelected
                      ? "border-accent-warm bg-accent-warm text-surface-strong"
                      : "border-ink/20 bg-surface-strong group-hover:border-accent-warm/50"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-pill bg-current transition ${
                      isSelected ? "scale-100 opacity-100" : "scale-0 opacity-0"
                    }`}
                  />
                </span>
                <span className="flex min-w-0 flex-col gap-2">
                  <span className="font-medium leading-6 text-ink">{option.label}</span>
                  {option.note ? (
                    <span className="text-sm leading-6 text-ink/65">{option.note}</span>
                  ) : null}
                </span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
