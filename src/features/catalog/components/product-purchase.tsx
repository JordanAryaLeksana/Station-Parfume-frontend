"use client";

import React from "react";
import Link from "next/link";
import { MinusIcon, PlusIcon } from "lucide-react";
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
import { whatsappUrl } from "@/lib/whatsapp";

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 20;

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
        quantity={quantity}
        total={total}
      />

      {/* The quantity and the bag button share one row. */}
      <div className="mt-6 flex gap-2.5">
        <div className="flex h-13.5 shrink-0 items-center border border-input bg-card">
          <button
            type="button"
            onClick={decrease}
            disabled={quantity <= MIN_QUANTITY}
            aria-label="Kurangi jumlah"
            className={STEPPER_BUTTON}
          >
            <MinusIcon aria-hidden className="size-4" strokeWidth={1.5} />
          </button>
          <output
            aria-live="polite"
            aria-label="Jumlah"
            className="w-8 text-center text-[15px] font-semibold tabular-nums"
          >
            {quantity}
          </output>
          <button
            type="button"
            onClick={increase}
            disabled={quantity >= MAX_QUANTITY}
            aria-label="Tambah jumlah"
            className={STEPPER_BUTTON}
          >
            <PlusIcon aria-hidden className="size-4" strokeWidth={1.5} />
          </button>
        </div>
        {bagHref && total !== null ? (
          <Link href={bagHref} className={BAG_BUTTON}>
            Masukkan ke tas
            <span aria-hidden>·</span>
            <span className="normal-case">{formatRupiah(total)}</span>
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className={cn(BAG_BUTTON, "cursor-not-allowed opacity-50")}
          >
            Tidak tersedia
          </button>
        )}
      </div>

      {/* Hidden when the shop's number isn't set (NEXT_PUBLIC_WHATSAPP_NUMBER). */}
      {waUrl && (
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold underline-offset-4 transition-colors hover:text-gold-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ChatIcon />
          Tanya peracik soal wangi ini di WhatsApp
          <span aria-hidden>→</span>
          <span className="sr-only"> (membuka WhatsApp)</span>
        </a>
      )}

      <ul
        role="list"
        className="mt-8 grid gap-3 border-t border-border pt-6 text-[13px] text-muted-foreground"
      >
        {ASSURANCES.map((item) => (
          <li key={item.text} className="flex items-center gap-3">
            <span aria-hidden className="text-foreground">
              {item.icon}
            </span>
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

const STEPPER_BUTTON =
  "flex h-full w-11 items-center justify-center transition-colors hover:text-gold-accent focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-35";

const BAG_BUTTON =
  "flex min-h-13.5 flex-1 flex-wrap items-center justify-center gap-x-2 gap-y-0.5 bg-primary px-5 py-2 text-center text-[11px] font-semibold tracking-[0.18em] text-primary-foreground uppercase tabular-nums transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const ASSURANCES = [
  {
    text: "Diracik setelah pembayaran diterima",
    icon: (
      <svg
        width="18"
        height="22"
        viewBox="0 0 28 36"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <rect x="9.5" y="1" width="9" height="5.5" rx="1" />
        <rect x="2.5" y="9" width="23" height="25.5" rx="4" />
      </svg>
    ),
  },
  {
    text: "Dikirim dari Karawang",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
        <circle cx="7" cy="17.5" r="1.6" />
        <circle cx="17" cy="17.5" r="1.6" />
      </svg>
    ),
  },
  {
    text: "Pembayaran aman lewat DOKU",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18" />
      </svg>
    ),
  },
];

function ChatIcon() {
  return (
    <svg
      aria-hidden
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M4 5h16v11H11l-5 4v-4H4z" />
    </svg>
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
