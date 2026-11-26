"use client";

import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

import { ATELIER_PHOTO } from "@/features/catalog/aroma-photos";
import StageFrame from "@/features/home/components/stage-frame";
import type { JourneyRacik } from "@/features/home/three/journey-scene";
import { storyFrom, type Story } from "@/features/home/three/story";

const JourneyScene = dynamic(
  () => import("@/features/home/three/journey-scene"),
  { ssr: false },
);

const STICKY =
  "sticky top-[4.5rem] h-[42svh] overflow-hidden min-[980px]:top-[5.5rem] min-[980px]:h-[calc(100svh-5.5rem)]";

const TRACK = "pointer-events-none absolute inset-0 z-20 min-[980px]:z-0";

const SCRIM = {
  "--clear": "clamp(0%, calc((var(--journey-s, 0) - 5.6) * 170%), 100%)",
  maskImage:
    "linear-gradient(to bottom, #000 calc(100% - var(--clear)), transparent calc(112% - var(--clear)))",
} as React.CSSProperties;

export function JourneyStagePlaceholder({
  photo = false,
}: {
  photo?: boolean;
}) {
  return (
    <div aria-hidden className={TRACK}>
      <div className={`${STICKY} bg-background`}>
        {photo && (
          <Image
            src={ATELIER_PHOTO.src}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[75%_50%] opacity-40 saturate-50"
          />
        )}
      </div>
    </div>
  );
}

function lineFor(wide: boolean) {
  if (wide) return window.innerHeight * 0.5;
  const top = 72 + window.innerHeight * 0.42;
  return top + (window.innerHeight - top) * 0.35;
}

export default function JourneyStage({ racik }: { racik: JourneyRacik }) {
  const storyRef = React.useRef<Story>({ target: 0, value: 0, velocity: 0 });
  const invalidateRef = React.useRef<(() => void) | null>(null);
  const track = React.useRef<HTMLDivElement>(null);
  const sticky = React.useRef<HTMLDivElement>(null);
  const onStory = React.useCallback((value: number) => {
    sticky.current?.style.setProperty("--journey-s", value.toFixed(3));
    track.current?.setAttribute("data-story", value.toFixed(2));
  }, []);

  React.useEffect(() => {
    const section = track.current?.closest("section");
    if (!section) return;
    const wide = window.matchMedia("(min-width: 980px)");
    let frame = 0;
    const measure = () => {
      frame = 0;
      const panels = [
        ...section.querySelectorAll<HTMLElement>("[data-story]"),
      ].map((panel) => {
        const rect = panel.getBoundingClientRect();
        return {
          index: Number(panel.dataset.story ?? 0),
          top: rect.top,
          height: rect.height,
        };
      });
      storyRef.current.target = storyFrom(panels, lineFor(wide.matches));
      track.current?.setAttribute(
        "data-story-target",
        storyRef.current.target.toFixed(2),
      );
      invalidateRef.current?.();
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div ref={track} aria-hidden className={TRACK}>
      <div ref={sticky} className={`${STICKY} bg-background`}>
        <StageFrame
          eager
          className="absolute inset-0"
          fallback={
            <Image
              src={ATELIER_PHOTO.src}
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-[75%_50%] opacity-40 saturate-50"
            />
          }
        >
          {({ active, onReady }) => (
            <JourneyScene
              racik={racik}
              storyRef={storyRef}
              invalidateRef={invalidateRef}
              onStory={onStory}
              active={active}
              onReady={onReady}
            />
          )}
        </StageFrame>
        <div
          style={SCRIM}
          className="absolute inset-0 hidden bg-[linear-gradient(90deg,var(--background)_0%,var(--background)_34%,color-mix(in_oklab,var(--background)_70%,transparent)_44%,transparent_56%)] min-[980px]:block"
        />
        <div className="absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-background to-transparent min-[980px]:hidden" />
      </div>
    </div>
  );
}
