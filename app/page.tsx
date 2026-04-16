import { HeroSection } from "@/components/home/hero-section";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <PageHeader
        eyebrow="How it works"
        title="A transparent decision flow for an emotionally complex choice"
        description="The app keeps the method visible: answer explicit questions, decide how much each dimension matters, compare scores, and read a structured report."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="1. Questionnaire" description="Answer explicit questions across the six decision dimensions.">
          <p className="text-sm leading-6 text-ink/75">
            Each option has separate scores for staying in the US and returning to China, so the logic stays easy to inspect.
          </p>
        </SectionCard>

        <SectionCard title="2. Weights" description="Tell the tool what matters more to you right now.">
          <p className="text-sm leading-6 text-ink/75">
            Weights keep the process transparent by showing how much each dimension shapes the final result.
          </p>
        </SectionCard>

        <SectionCard title="3. Results and Report" description="See the score breakdown and read a structured recommendation.">
          <p className="text-sm leading-6 text-ink/75">
            The report is meant to support reflection, not replace your own judgment or professional advice.
          </p>
        </SectionCard>
      </div>
    </>
  );
}
