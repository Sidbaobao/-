import { PrimaryButtonLink } from "@/components/ui/primary-button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="grid gap-6 rounded-xl border border-white/70 bg-white/85 p-6 shadow-soft sm:p-8 lg:grid-cols-[1.35fr_0.65fr] lg:p-10">
      <div className="space-y-6">
        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-teal">Decision support for reflection</p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-ink sm:text-5xl">
            Think through staying in the US or returning to China with a clearer structure.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-ink/75">
            Compare practical tradeoffs, set your priorities, and see a transparent recommendation that explains what is
            driving the result.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <PrimaryButtonLink href="/questionnaire">Start questionnaire</PrimaryButtonLink>
          <Link href="/results" className="inline-flex min-h-11 items-center rounded-xl px-4 py-3 text-sm font-semibold text-ink/70 hover:text-ink">
            View results structure
          </Link>
        </div>
      </div>

      <div className="rounded-xl bg-mist p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-ink">How to read the output</h2>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-ink/75">
          <li>Use it as a structured reflection tool.</li>
          <li>Results depend on your answers and weights.</li>
          <li>It is not legal, immigration, or financial advice.</li>
        </ul>
      </div>
    </section>
  );
}
