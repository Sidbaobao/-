import { PrimaryButtonLink } from "@/components/ui/primary-button";

export function HeroSection() {
  return (
    <section className="grid gap-6 rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-soft lg:grid-cols-[1.3fr_0.7fr] lg:p-10">
      <div className="space-y-6">
        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-teal">Decision support for reflection</p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            A structured way to think through staying in the US or returning to China.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-ink/75">
            This V1 app helps Chinese international students compare priorities, answer guided questions, adjust
            weights, and read a clear recommendation report without turning the decision into a black box.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <PrimaryButtonLink href="/questionnaire">Start questionnaire</PrimaryButtonLink>
          <PrimaryButtonLink href="/results">View sample structure</PrimaryButtonLink>
        </div>
      </div>

      <div className="rounded-[1.5rem] bg-mist p-6">
        <h2 className="text-lg font-semibold text-ink">Methodology and Disclaimer</h2>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-ink/75">
          <li>This is a decision-support tool.</li>
          <li>This is not legal, immigration, or financial advice.</li>
          <li>Results depend on your own answers and weights.</li>
          <li>You should treat the output as a structured reflection tool, not a final verdict.</li>
        </ul>
      </div>
    </section>
  );
}
