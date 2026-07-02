import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Questionnaire",
  description:
    "Answer questions across six decision dimensions comparing staying in the US with returning to China."
};

export default function QuestionnaireLayout({ children }: { children: ReactNode }) {
  return children;
}
