"use client";

import { useRouter } from "next/navigation";
import { resetAppState } from "@/lib/storage";

export function ResetProgressButton() {
  const router = useRouter();

  const handleReset = () => {
    resetAppState();
    router.push("/questionnaire");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleReset}
      className="rounded-full border border-ink/15 px-4 py-2 text-sm font-medium text-ink/75 hover:border-slateBlue hover:text-slateBlue"
    >
      Reset progress
    </button>
  );
}
