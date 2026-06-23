import Link from "next/link";
import { DecisionMapCanvas } from "@/components/home/decision-map-canvas";
import { HomeProgressCta } from "@/components/home/home-progress-cta";

export function HeroSection() {
  return (
    <section className="relative isolate min-h-[88svh] overflow-hidden bg-hero text-surface-strong">
      <DecisionMapCanvas />

      <div className="absolute inset-0" style={{ backgroundImage: "var(--gradient-hero-vignette)" }} />
      <div className="absolute inset-x-0 bottom-0 h-[18vh] bg-gradient-to-b from-transparent via-hero-raised/72 to-canvas" />

      <div className="relative z-10 mx-auto flex min-h-[88svh] w-full max-w-6xl flex-col items-center justify-center px-4 pb-28 pt-28 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-surface-strong/62">Decision support for reflection</p>
        <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[0.98] text-surface-strong sm:text-6xl lg:text-7xl">
          Think clearly about staying in the US or returning to China.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-surface-strong/74 sm:text-lg sm:leading-8">
          Compare practical tradeoffs, set your priorities, and see what is driving the recommendation without turning
          the decision into a black box.
        </p>

        <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <HomeProgressCta />
          <Link
            href="#how-it-works"
            className="inline-flex min-h-11 max-w-full items-center justify-center rounded-control px-5 py-3 text-center text-sm font-semibold leading-5 text-surface-strong/72 hover:text-surface-strong"
          >
            See how it works
          </Link>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-surface-strong/48">
        <span>Scroll</span>
        <span className="h-8 w-px bg-gradient-to-b from-surface-strong/45 to-transparent" />
      </div>
    </section>
  );
}
