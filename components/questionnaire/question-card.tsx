import { Question } from "@/types";

type QuestionCardProps = {
  question: Question;
  value?: string;
  onChange: (questionId: string, optionId: string) => void;
};

export function QuestionCard({ question, value, onChange }: QuestionCardProps) {
  return (
    <div className="rounded-[1.25rem] border border-ink/10 bg-mist/60 p-5">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-ink">{question.prompt}</h3>
        {question.helpText ? <p className="text-sm leading-6 text-ink/65">{question.helpText}</p> : null}
      </div>

      <div className="mt-4 space-y-3">
        {question.options.map((option) => {
          const isSelected = value === option.id;

          return (
            <label
              key={option.id}
              className={`block cursor-pointer rounded-2xl border p-4 transition ${
                isSelected ? "border-slateBlue bg-white" : "border-ink/10 bg-white/70 hover:border-teal"
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
              <div className="flex flex-col gap-2">
                <span className="font-medium text-ink">{option.label}</span>
                {option.note ? <span className="text-sm leading-6 text-ink/65">{option.note}</span> : null}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
