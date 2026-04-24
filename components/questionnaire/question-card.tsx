import { Question } from "@/types";

type QuestionCardProps = {
  question: Question;
  value?: string;
  onChange: (questionId: string, optionId: string) => void;
};

export function QuestionCard({ question, value, onChange }: QuestionCardProps) {
  return (
    <div className="rounded-xl border border-ink/10 bg-white p-5">
      <div className="space-y-2">
        <h3 className="text-base font-semibold leading-7 text-ink sm:text-lg">{question.prompt}</h3>
        {question.helpText ? <p className="text-sm leading-6 text-ink/65">{question.helpText}</p> : null}
      </div>

      <div className="mt-4 space-y-3">
        {question.options.map((option) => {
          const isSelected = value === option.id;

          return (
            <label
              key={option.id}
              className={`block cursor-pointer rounded-xl border p-4 transition ${
                isSelected ? "border-slateBlue bg-blue-50/70" : "border-ink/10 bg-white hover:border-teal"
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
              <div className="flex items-start gap-3">
                <span
                  className={`mt-1 h-3 w-3 shrink-0 rounded-full border ${
                    isSelected ? "border-slateBlue bg-slateBlue" : "border-ink/25 bg-white"
                  }`}
                />
                <span className="flex min-w-0 flex-col gap-2">
                  <span className="font-medium leading-6 text-ink">{option.label}</span>
                {option.note ? <span className="text-sm leading-6 text-ink/65">{option.note}</span> : null}
                </span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
