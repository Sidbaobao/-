import { HeroSection } from "@/components/home/hero-section";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <PageHeader
        eyebrow="How it works"
        title="A transparent flow for a high-stakes personal decision"
        description="The app keeps the method visible at each step, so the recommendation is something you can inspect and question."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="1. Answer questions" description="Respond to practical prompts across six decision dimensions." variant="subtle">
          <p className="text-sm leading-6 text-ink/75">
            Each option scores both paths separately, so the logic stays visible instead of hidden.
          </p>
        </SectionCard>

        <SectionCard title="2. Set priorities" description="Adjust how much each dimension should influence the result." variant="subtle">
          <p className="text-sm leading-6 text-ink/75">
            Your weights make the recommendation reflect what matters most to you right now.
          </p>
        </SectionCard>

        <SectionCard title="3. Review output" description="Compare scores, drivers, uncertainty, and a memo-style report." variant="subtle">
          <p className="text-sm leading-6 text-ink/75">
            The report highlights tradeoffs and next steps rather than treating the result as a final verdict.
          </p>
        </SectionCard>
      </div>
    </>
  );
}
