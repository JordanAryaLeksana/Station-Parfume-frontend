"use client";

import React from "react";
import { cn } from "cn";

import Typography from "@/components/shared/typography";
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
import type { ProductDetail, Variant } from "@/features/catalog/types";
import { formatRupiah } from "@/lib/format";
import { whatsappUrl } from "@/lib/whatsapp";

// How many of a variant one order line may take: 20 at most, and never more
// than the stock when the stock is counted (`available` is null when it
// isn't). A variant that can't be bought stays at 1.
export function maxQuantity(variant: Variant): number {
  if (!variant.in_stock) return MIN_QUANTITY;
  if (variant.available === null) return MAX_QUANTITY;
  return Math.max(MIN_QUANTITY, Math.min(MAX_QUANTITY, variant.available));
}

// The variant the panel opens on: the first one in stock, or the first one.
export function openingVariant(variants: Variant[]): Variant | undefined {
  return variants.find((variant) => variant.in_stock) ?? variants.at(0);
}

// The buy panel of a general product (car perfume, souvenirs, spray
// bottles): no size or blend, just a choice of label when there are several
// (e.g. the twelve car perfume scents), the quantity and the bag button. No
// nota racik: nothing is blended. Out of stock, the button says so and the
// WhatsApp link asks when it comes back.
export default function GeneralPurchase({
  product,
}: {
  product: ProductDetail;
}) {
  const variants = product.variants;
  const [chosenId, setChosenId] = React.useState(openingVariant(variants)?.id);
  const [quantity, setQuantity] = React.useState(MIN_QUANTITY);

  const variant = variants.find((item) => item.id === chosenId);
  if (!variant) return null;

  const max = maxQuantity(variant);

  // A new label may have less stock: the quantity never goes over it.
  function choose(item: Variant) {
    setChosenId(item.id);
    setQuantity(Math.min(quantity, maxQuantity(item)));
  }
  function decrease() {
    setQuantity(Math.max(MIN_QUANTITY, quantity - 1));
  }
  function increase() {
    setQuantity(Math.min(max, quantity + 1));
  }

  const total = variant.in_stock ? variant.price * quantity : null;
  const bagHref = variant.in_stock
    ? `/login?${new URLSearchParams({
        next: `/produk/${product.slug}`,
        add: String(variant.id),
        qty: String(quantity),
      })}`
    : null;

  // Labels only when there is something to choose from.
  const labelled = variants.length > 1 && variants.every((item) => item.label);
  // Each choice shows its price only when the prices differ.
  const pricesDiffer = new Set(variants.map((item) => item.price)).size > 1;
  // "habis" on a choice only when some labels are in stock and others not.
  const mixedStock =
    variants.some((item) => item.in_stock) &&
    variants.some((item) => !item.in_stock);

  const what = variant.label
    ? `${product.name} (${variant.label})`
    : product.name;
  const waMessage = variant.in_stock
    ? `Halo, saya mau tanya tentang ${what}, ${quantity} buah.`
    : `Halo, apakah ${what} tersedia lagi?`;
  const waUrl = whatsappUrl(waMessage);

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <Typography
          variant="price-lg"
          aria-live="polite"
          aria-atomic
          className={variant.in_stock ? "text-gold-accent" : "text-foreground"}
        >
          {formatRupiah(variant.price)}
        </Typography>
        {!variant.in_stock && (
          <Typography as="span" variant="label">
            Stok habis
          </Typography>
        )}
      </div>

      {labelled && (
        <fieldset className="mt-9">
          <legend className="sr-only">Pilihan</legend>
          <OptionHeader label="Pilihan" value={variant.label} />
          <div className="mt-3 flex flex-wrap gap-2.5">
            {variants.map((item) => (
              <label key={item.id} className="cursor-pointer">
                <input
                  type="radio"
                  name="pilihan"
                  value={item.id}
                  checked={item.id === variant.id}
                  onChange={() => choose(item)}
                  className="peer sr-only"
                />
                <span
                  className={cn(
                    CHOICE,
                    "flex min-h-10 flex-col justify-center px-4 py-2",
                  )}
                >
                  <Typography
                    as="span"
                    variant="caption"
                    className="font-semibold"
                  >
                    {item.label}
                  </Typography>
                  {pricesDiffer && (
                    <Typography
                      as="span"
                      variant="caption"
                      className="tabular-nums opacity-75"
                    >
                      {formatRupiah(item.price)}
                    </Typography>
                  )}
                  {mixedStock && !item.in_stock && (
                    <Typography
                      as="span"
                      variant="caption"
                      className="italic opacity-75"
                    >
                      habis
                    </Typography>
                  )}
                  {!mixedStock && !item.in_stock && (
                    <span className="sr-only"> (stok habis)</span>
                  )}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="mt-8 flex gap-2.5">
        <QuantityStepper
          quantity={quantity}
          max={max}
          disabled={!variant.in_stock}
          onDecrease={decrease}
          onIncrease={increase}
        />
        <BagButton href={bagHref} total={total} unavailable="Stok habis" />
      </div>

      <WhatsAppLink href={waUrl}>
        {variant.in_stock
          ? "Tanya soal produk ini di WhatsApp"
          : "Tanya stok di WhatsApp"}
      </WhatsAppLink>

      <Assurances prepared="Dikemas" />
    </div>
  );
}
