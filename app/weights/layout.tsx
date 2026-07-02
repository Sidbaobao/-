import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Weights",
  description: "Set how much each of the six decision dimensions influences the final result."
};

export default function WeightsLayout({ children }: { children: ReactNode }) {
  return children;
}
