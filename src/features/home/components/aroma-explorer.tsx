"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "cn";

import Typography, { typographyStyles } from "@/components/shared/typography";
import { Button } from "@/components/ui/button";
import {
  AROMAS,
  aromaSwatch,
  getAroma,
  type AromaNote,
} from "@/features/catalog/aroma";
import { ATELIER_PHOTO, getAromaPhoto } from "@/features/catalog/aroma-photos";
import AromaCarousel from "@/features/home/components/aroma-carousel";
import GoArrow from "@/features/home/components/go-arrow";
import type { AromaShowcase } from "@/features/home/showcase";

const FIRST_NOTE: AromaNote = "floral";

const STEP: Record<string, number> = {
  ArrowDown: 1,
  ArrowRight: 1,
  ArrowUp: -1,
  ArrowLeft: -1,
};

export default function AromaExplorer({ aromas }: { aromas: AromaShowcase[] }) {
  const [selected, setSelected] = React.useState<AromaNote>(
    aromas.some((item) => item.note === FIRST_NOTE)
      ? FIRST_NOTE
      : (aromas.at(0)?.note ?? FIRST_NOTE),
  );
  const tabs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const current = aromas.find((item) => item.note === selected);
  if (!current) return null;

  const aroma = getAroma(current.note);
  const photo = getAromaPhoto(current.note) ?? ATELIER_PHOTO;
  const tube = AROMAS.findIndex((item) => item.note === current.note);

  function choose(position: number) {
    const target = (position + aromas.length) % aromas.length;
    const item = aromas[target];
    if (!item) return;
    setSelected(item.note);
    tabs.current[target]?.focus();
  }

  function onKeyDown(event: React.KeyboardEvent, position: number) {
    const step = STEP[event.key];
    if (step !== undefined) {
      event.preventDefault();
      choose(position + step);
    } else if (event.key === "Home") {
      event.preventDefault();
      choose(0);
    } else if (event.key === "End") {
      event.preventDefault();
      choose(aromas.length - 1);
    }
  }

  return (
    <div className="grid gap-8 min-[980px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] min-[980px]:gap-14">
      <div
        role="tablist"
        aria-label="Keluarga aroma"
        aria-orientation="vertical"
        className="grid grid-cols-2 gap-x-4 self-start border-t border-border min-[980px]:grid-cols-1"
      >
        {aromas.map((item, position) => {
          const family = getAroma(item.note);
          const isSelected = item.note === selected;

          return (
            <button
              key={item.note}
              ref={(element) => {
                tabs.current[position] = element;
              }}
              type="button"
              role="tab"
              id={`aroma-tab-${item.note}`}
              aria-selected={isSelected}
              aria-controls="aroma-panel"
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setSelected(item.note)}
              onKeyDown={(event) => onKeyDown(event, position)}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") setSelected(item.note);
              }}
              className="group relative grid min-h-12 grid-cols-[1rem_minmax(0,1fr)_auto] items-center gap-2.5 border-b border-border py-2.5 text-left outline-none after:absolute after:-bottom-px after:left-0 after:h-px after:w-0 after:bg-gold-accent after:transition-[width] after:duration-700 after:ease-atelier focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring aria-selected:after:w-full motion-reduce:after:transition-none min-[980px]:grid-cols-[2.125rem_1.375rem_minmax(0,1fr)_auto] min-[980px]:gap-3.5 min-[980px]:py-3"
            >
              <Typography
                as="span"
                variant="label"
                aria-hidden
                className="hidden text-muted-foreground tabular-nums min-[980px]:block"
              >
                {String(position + 1).padStart(2, "0")}
              </Typography>
              <span
                aria-hidden
                className="size-4 rounded-full min-[980px]:size-5.5"
                style={{ background: aromaSwatch(family) }}
              />
              <span className="min-w-0 truncate transition-[translate] duration-500 ease-atelier group-aria-selected:translate-x-2 motion-reduce:transition-none">
                <Typography
                  as="span"
                  variant="subtitle"
                  className="transition-colors duration-500 group-hover:text-gold-accent-soft group-aria-selected:text-gold-accent group-aria-selected:italic motion-reduce:transition-none"
                >
                  {family.label}
                </Typography>
                <Typography
                  as="span"
                  variant="caption"
                  className="ml-2.5 text-muted-foreground max-[979px]:sr-only"
                >
                  {family.indonesian}
                </Typography>
              </span>
              <Typography
                as="span"
                variant="caption"
                className="text-muted-foreground tabular-nums"
              >
                {item.count}
                <span className="max-[979px]:sr-only"> wangi</span>
              </Typography>
            </button>
          );
        })}
      </div>

      <div
        id="aroma-panel"
        role="tabpanel"
        aria-labelledby={`aroma-tab-${current.note}`}
        className="group/panel dark relative isolate flex min-h-135 flex-col overflow-hidden bg-ink-2 min-[980px]:min-h-155"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-3.5 z-10 border border-gold"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-[10%] -z-10"
        >
          <div
            key={current.note}
            className="absolute inset-0 animate-in duration-1000 fade-in motion-reduce:animate-none"
          >
            <div
              className="absolute top-[10%] left-[12%] aspect-square w-[62%] rounded-full opacity-40 blur-[80px]"
              style={{ background: aroma.colors.deep }}
            />
          </div>
          <div className="absolute right-[6%] bottom-[4%] aspect-square w-[62%] rounded-full bg-gold opacity-20 blur-[80px]" />
        </div>

        <AromaCarousel
          selected={tube}
          className="mx-3.5 mt-3.5 h-52 shrink-0 min-[980px]:h-60"
        />
        <div
          key={current.note}
          className="relative flex flex-1 animate-in flex-col px-8 pt-2 pb-8 duration-500 fade-in slide-in-from-bottom-2 motion-reduce:animate-none min-[980px]:px-14 min-[980px]:pt-4 min-[980px]:pb-14 min-[1180px]:static"
        >
          <Typography as="h3" variant="headline">
            {aroma.label}
          </Typography>
          <Typography
            as="p"
            variant="subtitle"
            className="mt-1 text-gold-accent-soft italic"
          >
            {aroma.indonesian}
          </Typography>
          <Typography variant="body" className="mt-5 max-w-95">
            {aroma.description}
          </Typography>

          {current.examples.length > 0 && (
            <ul
              role="list"
              aria-label={`Contoh wangi ${aroma.label}`}
              className="mt-7 flex flex-wrap gap-2"
            >
              {current.examples.map((example) => (
                <li key={example.slug}>
                  <Link
                    href={`/produk/${example.slug}`}
                    className={cn(
                      typographyStyles.variants.caption,
                      "inline-flex min-h-10 items-center border border-border px-3.5 transition-colors hover:border-gold hover:text-gold-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    )}
                  >
                    {example.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-auto flex flex-col-reverse gap-8 pt-10 min-[1180px]:flex-row min-[1180px]:items-end min-[1180px]:justify-between min-[1180px]:gap-6">
            {current.count > 0 && (
              <Button asChild size="atelier" className="self-start">
                <Link href={`/koleksi?note=${current.note}`}>
                  Lihat {current.count} wangi {aroma.label}
                  <GoArrow />
                </Link>
              </Button>
            )}
            <figure className="relative w-32.5 shrink-0 rotate-[3.5deg] self-end bg-cream px-2.5 pt-7 pb-3 text-ink shadow-[0_26px_50px_-18px_rgb(0_0_0/0.8)] transition-transform duration-700 ease-atelier group-hover/panel:-translate-y-1.5 group-hover/panel:-rotate-[1.5deg] before:absolute before:top-2.25 before:left-1/2 before:size-2.75 before:-translate-x-1/2 before:rounded-full before:bg-ink motion-reduce:transition-none min-[980px]:w-44.5 min-[1180px]:absolute min-[1180px]:top-12 min-[1180px]:right-12 min-[1180px]:w-36">
              <Image
                src={photo.src}
                alt=""
                sizes="180px"
                placeholder="blur"
                className="aspect-square w-full object-cover"
              />
              <Typography
                as="figcaption"
                variant="subtitle"
                className="mt-2 text-center font-light italic"
              >
                {photo.caption}
              </Typography>
            </figure>
          </div>
        </div>
      </div>
    </div>
  );
}
