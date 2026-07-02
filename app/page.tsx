import {
  FileText,
  ListChecks,
  SlidersHorizontal,
  type LucideIcon
} from "lucide-react";
import { HeroSection } from "@/components/home/hero-section";
import { HomeProgressCta } from "@/components/home/home-progress-cta";
import { TwoPathsVideoSection } from "@/components/home/two-paths-video-section";

type StepSectionProps = {
  step: string;
  title: string;
  description: string;
  detail: string;
  previewLabel: string;
  guideLabel: string;
  highlights: string[];
  imageSide: "left" | "right";
  Icon: LucideIcon;
  iconClassName: string;
};

function StepSection({
  step,
  title,
  description,
  detail,
  previewLabel,
  guideLabel,
  highlights,
  imageSide,
  Icon,
  iconClassName
}: StepSectionProps) {
  const imageOrder = imageSide === "left" ? "lg:order-1" : "lg:order-2";
  const textOrder = imageSide === "left" ? "lg:order-2" : "lg:order-1";

  return (
    <section className="grid gap-10 py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-24">
      <div className={`order-1 ${imageOrder}`}>
        <div className="flex aspect-[4/3] min-h-64 w-full flex-col rounded-tile border border-surface-strong/70 bg-surface-strong/70 p-5 shadow-soft sm:p-6">
          <div className="flex min-h-0 flex-1 items-center justify-center rounded-control border border-dashed border-ink/15 bg-legacy-mist/70 text-center text-sm font-medium text-ink/55">
            <span>{previewLabel}</span>
          </div>
          <p className="mt-4 text-center text-xs font-medium uppercase tracking-[0.14em] text-ink/45">{guideLabel}</p>
        </div>
      </div>

      <div className={`order-2 max-w-none ${textOrder}`}>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-warm">{step}</p>
        <h2 className="mt-3 text-4xl font-semibold leading-tight text-ink sm:text-5xl">{title}</h2>
        <p className="mt-4 text-base leading-7 text-ink/75">{description}</p>
        <p className="mt-3 text-sm leading-6 text-ink/65">{detail}</p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {highlights.map((highlight) => (
            <div key={highlight} className="flex items-start gap-3 rounded-control border border-surface-strong/70 bg-surface-strong/70 p-4">
              <span
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-control ${iconClassName}`}
              >
                <Icon aria-hidden="true" strokeWidth={1.8} className="h-4 w-4" />
              </span>
              <p className="text-sm font-medium leading-6 text-ink/72">{highlight}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <section
        id="how-it-works"
        className="relative -mt-20 bg-gradient-to-b from-transparent via-surface-warm to-canvas px-4 pb-16 pt-32 sm:px-6 lg:px-8"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent-warm">How it works</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-ink sm:text-5xl">
              A transparent flow for a high-stakes personal decision
            </h1>
            <p className="mt-3 text-base leading-7 text-ink/75">
              The app keeps the method visible at each step, so the recommendation is something you can inspect and
              question.
            </p>
          </div>

          <div className="divide-y divide-ink/10">
            <StepSection
              step="Step 1"
              title="Answer questions"
              description="Respond to practical prompts across six decision dimensions."
              detail="Each option scores both paths separately, so the logic stays visible instead of hidden."
              previewLabel="Questionnaire preview"
              guideLabel="Step 1 of 3"
              highlights={["6 decision dimensions", "28 practical questions", "Every option scores both paths"]}
              imageSide="right"
              Icon={ListChecks}
              iconClassName="bg-action-primary/10 text-action-primary"
            />

            <StepSection
              step="Step 2"
              title="Set priorities"
              description="Adjust how much each dimension should influence the result."
              detail="Your weights make the recommendation reflect what matters most to you right now."
              previewLabel="Weights preview"
              guideLabel="Step 2 of 3"
              highlights={["Adjustable weight per dimension", "Your priorities, not a fixed formula", "Change weights anytime"]}
              imageSide="left"
              Icon={SlidersHorizontal}
              iconClassName="bg-accent-warm/10 text-accent-warm"
            />

            <StepSection
              step="Step 3"
              title="Review output"
              description="Compare scores, drivers, uncertainty, and a memo-style report."
              detail="The report highlights tradeoffs and next steps rather than treating the result as a final verdict."
              previewLabel="Results preview"
              guideLabel="Step 3 of 3"
              highlights={["Transparent score breakdown", "Charts show what drives the result", "A structured memo, not a verdict"]}
              imageSide="right"
              Icon={FileText}
              iconClassName="bg-path-return/10 text-path-return"
            />
          </div>

          <TwoPathsVideoSection />

          <div className="grid gap-6 rounded-tile border border-surface-strong/70 bg-surface-strong/75 p-6 shadow-soft lg:grid-cols-[1fr_auto] lg:items-center lg:p-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-warm">Methodology note</p>
              <h2 className="mt-3 text-2xl font-semibold leading-tight text-ink">Use this as structured reflection.</h2>
              <p className="mt-3 text-sm leading-6 text-ink/70">
                The tool is not legal, immigration, or financial advice. It helps organize your thinking based on your
                answers and priorities, so you can see the tradeoffs more clearly.
              </p>
            </div>

            <HomeProgressCta align="end" />
          </div>
        </div>
      </section>
    </>
  );
}
