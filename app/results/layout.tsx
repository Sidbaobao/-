import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Results",
  description:
    "The weighted comparison of staying in the US versus returning to China, with key drivers and confidence."
};

export default function ResultsLayout({ children }: { children: ReactNode }) {
  return children;
}
