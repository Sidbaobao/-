import Link from "next/link";
import { PrimaryButton } from "@/components/ui/primary-button";

type QuestionnaireActionsProps = {
  canContinue: boolean;
  onSave: () => void;
};

export function QuestionnaireActions({ canContinue, onSave }: QuestionnaireActionsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Link href="/" className="text-sm font-medium text-ink/70 hover:text-ink">
        Back to home
      </Link>
      <PrimaryButton onClick={onSave} disabled={!canContinue} className="w-full sm:w-auto">
        Save and continue to weights
      </PrimaryButton>
    </div>
  );
}
