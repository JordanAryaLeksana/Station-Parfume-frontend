"use client";

import React from "react";
import { cn } from "cn";

import Typography from "@/components/shared/typography";
import { BLEND_ORDER, BLENDS } from "@/features/catalog/blends";
import NotaRacik from "@/features/catalog/components/nota-racik";
import {
  Assurances,
  BagButton,
  CHOICE,
  MAX_QUANTITY,
  MIN_QUANTITY,
  OptionHeader,
  QuantityStepper,
  WhatsAppLink,
} from "@/features/catalog/components/purchase-parts";
import {
  findVariant,
  priceBreakdown,
  type Selection,
} from "@/features/catalog/pricing";
import type { Concentration, ProductDetail } from "@/features/catalog/types";
import { formatRupiah } from "@/lib/format";
import { whatsappUrl } from "@/lib/whatsapp";

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

  const [quantity, setQuantity] = React.useState(MIN_QUANTITY);

  function decrease() {
    setQuantity(Math.max(MIN_QUANTITY, quantity - 1));
  }
  function increase() {
    setQuantity(Math.min(MAX_QUANTITY, quantity + 1));
  }

  const total = variant ? variant.price * quantity : null;
  const bagHref = variant
    ? `/login?${new URLSearchParams({
        next: `/produk/${product.slug}`,
        add: String(variant.id),
        qty: String(quantity),
      })}`
    : null;

  const waMessage = `Halo, saya mau tanya tentang ${product.name} ${chosenSize?.label}, ${BLENDS[selection.concentration].name}, ${quantity} botol.`;
  const waUrl = whatsappUrl(waMessage);

  return (
    <div className="mt-8">
      <Typography
        variant="price-lg"
        aria-live="polite"
        aria-atomic
        className="text-gold-accent"
      >
        {variant ? formatRupiah(variant.price) : "—"}
      </Typography>
      {breakdown && (
        <Typography
          variant="caption"
          className="mt-2.5 text-muted-foreground tabular-nums"
        >
          {formatRupiah(breakdown.ratePerMl)} per ml × {breakdown.volumeMl} ml +
          botol {formatRupiah(breakdown.bottlePrice)}
        </Typography>
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
                <Typography
                  as="span"
                  variant="caption"
                  className="font-semibold tabular-nums"
                >
                  {size.label}
                </Typography>
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
                  <Typography as="span" variant="subtitle">
                    {blend.name} <em className="font-light">{blend.alias}</em>
                  </Typography>
                  <Typography
                    as="span"
                    variant="caption"
                    className="opacity-75"
                  >
                    {blend.description}
                  </Typography>
                  {rate != null && (
                    <Typography
                      as="span"
                      variant="caption"
                      className="mt-auto pt-2 font-semibold tabular-nums"
                    >
                      {formatRupiah(rate)} / ml
                    </Typography>
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
        quantity={quantity}
        total={total}
      />

      {/* The quantity and the bag button share one row. */}
      <div className="mt-6 flex gap-2.5">
        <QuantityStepper
          quantity={quantity}
          max={MAX_QUANTITY}
          onDecrease={decrease}
          onIncrease={increase}
        />
        <BagButton href={bagHref} total={total} />
      </div>

      <WhatsAppLink href={waUrl}>
        Tanya peracik soal wangi ini di WhatsApp
      </WhatsAppLink>

      <Assurances prepared="Diracik" />
    </div>
  );
}

// The bottle drawings from prototype v5: each size a little taller and
// fuller. Step 0 is the smallest size.
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
