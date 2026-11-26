"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PauseIcon,
  PlayIcon,
} from "lucide-react";
import { cn } from "cn";

import Typography from "@/components/shared/typography";
import type { HeroScent } from "@/features/home/hero-scents";

const ROUND_BUTTON =
  "grid size-10 place-items-center rounded-full border border-border transition-colors hover:border-gold hover:bg-gold hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring min-[980px]:size-11.5";

export default function HeroScentCard({
  scents,
  index,
  onIndexChange,
  held = false,
}: {
  scents: HeroScent[];
  index: number;
  onIndexChange: (index: number) => void;
  held?: boolean;
}) {
  const [stopped, setStopped] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const paused = stopped || hovered || focused || held;

  const scent = scents.at(index);
  if (!scent) return null;

  function showPrevious() {
    onIndexChange((index - 1 + scents.length) % scents.length);
  }
  function showNext() {
    onIndexChange((index + 1) % scents.length);
  }

  function togglePause() {
    setStopped(!stopped);
  }
  function pointerIn() {
    setHovered(true);
  }
  function pointerOut() {
    setHovered(false);
  }
  function focusIn() {
    setFocused(true);
  }
  function focusOut() {
    setFocused(false);
  }

  return (
    <section
      aria-label="Wangi di meja racik"
      onMouseEnter={pointerIn}
      onMouseLeave={pointerOut}
      onFocus={focusIn}
      onBlur={focusOut}
      className="relative z-10 mx-5 mb-12 border-t border-border pt-4 motion-safe:animate-hero-fade motion-safe:[animation-delay:600ms] min-[980px]:absolute min-[980px]:right-28 min-[980px]:bottom-14 min-[980px]:mx-0 min-[980px]:mb-0 min-[980px]:flex min-[980px]:w-[min(31rem,46%)] min-[980px]:items-center min-[980px]:gap-4 min-[980px]:border min-[980px]:bg-background/85 min-[980px]:px-4 min-[980px]:pt-5 min-[980px]:pb-4 min-[980px]:backdrop-blur-md"
    >
      <div className="grid grid-cols-[4rem_minmax(0,1fr)] items-center gap-x-4 min-[980px]:min-w-0 min-[980px]:flex-1 min-[980px]:grid-cols-[3.5rem_minmax(0,1fr)]">
        <div className="bg-cream p-1">
          <div className="relative aspect-square overflow-hidden bg-cream-2">
            {scent.photo && (
              <Image
                key={scent.id}
                src={scent.photo}
                alt=""
                fill
                sizes="80px"
                className="animate-in object-cover duration-700 fade-in motion-reduce:animate-none"
              />
            )}
          </div>
        </div>
        <div aria-live={paused ? "polite" : "off"} aria-atomic>
          <div
            key={scent.id}
            className="animate-in duration-500 fade-in slide-in-from-bottom-1 motion-reduce:animate-none"
          >
            <Typography
              as="p"
              variant="label"
              className="text-gold-accent tabular-nums"
            >
              No. {scent.id}
              <span className="max-[1179px]:hidden"> · di atas meja racik</span>
            </Typography>
            <Typography
              as="p"
              variant="title"
              className="mt-1.5 wrap-break-word"
            >
              {scent.name}
            </Typography>
            {scent.aromas && (
              <Typography
                as="p"
                variant="caption"
                className="mt-1 text-muted-foreground"
              >
                {scent.aromas}
              </Typography>
            )}
            <Link
              href={`/produk/${scent.slug}`}
              className="mt-2.5 inline-block border-b border-gold pb-0.5 text-[11px] font-semibold tracking-[0.16em] text-gold-accent-soft uppercase transition-colors hover:text-gold-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              Lihat wangi ini
              <span className="sr-only">: {scent.name}</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 min-[980px]:mt-0 min-[980px]:shrink-0">
        <div
          aria-hidden
          className="grid flex-1 gap-1.5 min-[980px]:absolute min-[980px]:inset-x-4 min-[980px]:top-2.5"
          style={{ gridTemplateColumns: `repeat(${scents.length}, 1fr)` }}
        >
          {scents.map((item, position) => (
            <span
              key={item.id}
              className="relative h-0.5 overflow-hidden bg-foreground/15"
            >
              <span
                className={cn(
                  "absolute inset-0 origin-left bg-gold",
                  position > index && "scale-x-0",
                  position === index && "motion-safe:animate-hero-progress",
                )}
                style={
                  position === index
                    ? { animationPlayState: paused ? "paused" : "running" }
                    : undefined
                }
                onAnimationEnd={position === index ? showNext : undefined}
              />
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={togglePause}
          aria-pressed={stopped}
          aria-label="Jeda pergantian wangi"
          className="grid size-8 place-items-center text-muted-foreground transition-colors hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:hidden"
        >
          {stopped ? (
            <PlayIcon aria-hidden className="size-3.5" strokeWidth={1.5} />
          ) : (
            <PauseIcon aria-hidden className="size-3.5" strokeWidth={1.5} />
          )}
        </button>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={showPrevious}
            aria-label="Wangi sebelumnya"
            className={ROUND_BUTTON}
          >
            <ArrowLeftIcon aria-hidden className="size-4" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={showNext}
            aria-label="Wangi berikutnya"
            className={ROUND_BUTTON}
          >
            <ArrowRightIcon aria-hidden className="size-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </section>
  );
}
