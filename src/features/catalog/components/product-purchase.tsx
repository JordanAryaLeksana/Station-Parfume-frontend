"use client";

import React from "react";
import { cn } from "cn";

import { BLEND_ORDER, BLENDS } from "@/features/catalog/blends";
import NotaRacik from "@/features/catalog/components/nota-racik";
import {
  findVariant,
  priceBreakdown,
  type Selection,
} from "@/features/catalog/pricing";
import type { Concentration, ProductDetail } from "@/features/catalog/types";
import { formatRupiah } from "@/lib/format";

type ProductPurchaseProps = {
  product: ProductDetail;
  initialSelection: Selection;
};

export default function ProductPurchase({
  product,
  initialSelection,
}: ProductPurchaseProps) {
  const [selection, setSelection] = React.useState(initialSelection);
  const variant = findVariant(product, selection);
  const breakdown = variant ? priceBreakdown(product, variant) : null;
  function chooseSize(sizeId: number) {
    setSelection({ ...selection, sizeId });
  }
  function chooseConcentration(concentration: Concentration) {
    setSelection({ ...selection, concentration });
  }

  const scent = product.scent_options.find(
    (option) => option.id === selection.scentId,
  );
  const chosenSize = product.size_options.find(
    (size) => size.id === selection.sizeId,
  );
  const concentrations = BLEND_ORDER.filter((concentration) =>
    product.concentrations.includes(concentration),
  );

  return (
    <div className="mt-8">
      <p
        aria-live="polite"
        aria-atomic
        className="text-[2.25rem] leading-none font-semibold text-gold-accent tabular-nums"
      >
        {variant ? formatRupiah(variant.price) : "—"}
      </p>
      {breakdown && (
        <p className="mt-2.5 text-[13px] text-muted-foreground tabular-nums">
          {formatRupiah(breakdown.ratePerMl)} per ml × {breakdown.volumeMl} ml +
          botol {formatRupiah(breakdown.bottlePrice)}
        </p>
      )}

      <fieldset className="mt-9">
        <legend className="sr-only">Ukuran</legend>
        <OptionHeader label="Ukuran" value={chosenSize?.label} />
        <div className="mt-3 grid grid-cols-3 gap-2.5">
          {product.size_options.map((size, index) => (
            <label key={size.id} className="cursor-pointer">
              <input
                type="radio"
                name="ukuran"
                value={size.id}
                checked={selection.sizeId === size.id}
                onChange={() => chooseSize(size.id)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  CHOICE,
                  "flex h-20 flex-col items-center justify-end gap-2 pb-3",
                )}
              >
                <BottleIcon step={index} />
                <span className="text-[13px] font-semibold tabular-nums">
                  {size.label}
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-7">
        <legend className="sr-only">Racikan</legend>
        <OptionHeader
          label="Racikan"
          value={BLENDS[selection.concentration].name}
        />
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          {concentrations.map((concentration) => {
            const blend = BLENDS[concentration];
            const rate =
              concentration === "murni"
                ? scent?.price_per_ml_murni
                : scent?.price_per_ml_campur;
            return (
              <label key={concentration} className="cursor-pointer">
                <input
                  type="radio"
                  name="racikan"
                  value={concentration}
                  checked={selection.concentration === concentration}
                  onChange={() => chooseConcentration(concentration)}
                  className="peer sr-only"
                />
                <span className={cn(CHOICE, "flex h-full flex-col gap-1 p-4")}>
                  <span className="font-primary text-xl leading-tight">
                    {blend.name} <em className="font-light">{blend.alias}</em>
                  </span>
                  <span className="text-[13px] leading-snug opacity-75">
                    {blend.description}
                  </span>
                  {rate != null && (
                    <span className="mt-auto pt-2 text-[13px] font-semibold tabular-nums">
                      {formatRupiah(rate)} / ml
                    </span>
                  )}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <NotaRacik
        className="mt-8"
        number={product.id}
        scentName={scent?.name ?? product.name}
        concentration={selection.concentration}
        breakdown={breakdown}
        total={variant?.price ?? null}
      />
    </div>
  );
}

const CHOICE =
  "border border-input bg-card transition-colors hover:border-foreground peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring";

function OptionHeader({ label, value }: { label: string; value?: string }) {
  return (
    <div aria-hidden className="flex items-baseline justify-between gap-4">
      <span className="text-[11px] font-semibold tracking-[0.22em] uppercase">
        {label}
      </span>
      {value && (
        <span className="font-primary text-lg text-gold-accent italic">
          {value}
        </span>
      )}
    </div>
  );
}

const BOTTLES = [
  { width: 15, height: 23, liquidY: 15, liquidHeight: 11.5, stroke: 1.4 },
  { width: 19, height: 29, liquidY: 13, liquidHeight: 13.5, stroke: 1.3 },
  { width: 24, height: 36, liquidY: 10.5, liquidHeight: 16, stroke: 1.1 },
];

function BottleIcon({ step }: { step: number }) {
  const bottle = BOTTLES[Math.min(step, BOTTLES.length - 1)];
  return (
    <svg
      aria-hidden
      width={bottle.width}
      height={bottle.height}
      viewBox="0 0 20 30"
    >
      <rect x="7" y="0.5" width="6" height="5" fill="currentColor" />
      <rect
        x="1.5"
        y="7"
        width="17"
        height="22"
        rx="3"
        fill="none"
        stroke="currentColor"
        strokeWidth={bottle.stroke}
      />
      <rect
        x="4"
        y={bottle.liquidY}
        width="12"
        height={bottle.liquidHeight}
        rx="1.5"
        fill="currentColor"
        opacity="0.35"
      />
    </svg>
  );
}
