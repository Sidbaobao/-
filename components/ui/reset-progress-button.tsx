"use client";

import { useRouter } from "next/navigation";
import { resetAppState } from "@/lib/storage";

type ResetProgressButtonProps = {
  variant?: "light" | "default";
};

export function ResetProgressButton({ variant = "default" }: ResetProgressButtonProps) {
  const router = useRouter();
  const className =
    variant === "light"
      ? "rounded-xl border border-white/25 px-4 py-2 text-sm font-medium text-white/75 hover:border-white/60 hover:text-white"
      : "rounded-full border border-ink/15 px-4 py-2 text-sm font-medium text-ink/75 hover:border-slateBlue hover:text-slateBlue";

  const handleReset = () => {
    resetAppState();
    router.push("/questionnaire");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleReset}
      className={className}
    >
      Reset progress
    </button>
  );
}
