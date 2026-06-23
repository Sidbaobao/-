"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type VideoPanelProps = {
  accentClassName: string;
  label: string;
  shouldPlayVideo: boolean;
  supportingText: string;
  src: string;
};

function VideoPanel({ accentClassName, label, shouldPlayVideo, supportingText, src }: VideoPanelProps) {
  const [hasVideoError, setHasVideoError] = useState(false);

  return (
    <div>
      <div className="relative min-h-[34rem] overflow-hidden rounded-tile bg-hero shadow-soft sm:min-h-[42rem] lg:min-h-[48rem]">
        {!hasVideoError ? (
          <video
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay={shouldPlayVideo}
            loop
            muted
            playsInline
            preload="metadata"
            src={src}
            tabIndex={-1}
            onError={() => setHasVideoError(true)}
          />
        ) : null}
      </div>

      <div className="pt-5">
        <div className={`mb-4 h-1 w-16 rounded-pill ${accentClassName}`} />
        <h3 className="text-3xl font-semibold leading-tight text-ink sm:text-4xl">{label}</h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-ink/68 sm:text-base">{supportingText}</p>
      </div>
    </div>
  );
}

export function TwoPathsVideoSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [shouldPlayVideo, setShouldPlayVideo] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncVideoPlayback = () => {
      const canPlay = !motionQuery.matches;
      const videos = Array.from(sectionRef.current?.querySelectorAll("video") ?? []);

      setShouldPlayVideo(canPlay);

      videos.forEach((video) => {
        if (canPlay) {
          video.play().catch(() => {
            // Autoplay can still be blocked by some browser settings; the fallback panel remains readable.
          });
        } else {
          video.pause();
          video.currentTime = 0;
        }
      });
    };

    syncVideoPlayback();
    motionQuery.addEventListener("change", syncVideoPlayback);

    return () => {
      motionQuery.removeEventListener("change", syncVideoPlayback);
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-16 lg:py-24" aria-labelledby="two-paths-heading">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-warm">Two paths</p>
        <h2 id="two-paths-heading" className="mt-3 text-4xl font-semibold leading-tight text-ink sm:text-5xl">
          Make both futures concrete before you compare them.
        </h2>
        <p className="mt-4 text-base leading-7 text-ink/72">
          The goal is not to romanticize either path. It is to pause, see both directions clearly, and then answer with
          your real constraints in mind.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <VideoPanel
          accentClassName="bg-path-stay"
          label="Stay in the US"
          shouldPlayVideo={shouldPlayVideo}
          supportingText="Build your life on the US path."
          src="/manhattan.mp4"
        />
        <VideoPanel
          accentClassName="bg-path-return"
          label="Return to China"
          shouldPlayVideo={shouldPlayVideo}
          supportingText="Build your life on the China path."
          src="/shanghai.mp4"
        />
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/questionnaire"
          className="inline-flex min-h-11 max-w-full items-center justify-center rounded-control bg-action-primary px-5 py-3 text-center text-sm font-semibold leading-5 text-surface-strong hover:bg-action-primary-hover"
        >
          Start questionnaire
        </Link>
      </div>
    </section>
  );
}
