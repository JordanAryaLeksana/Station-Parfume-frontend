import type * as React from "react";
import Link from "next/link";
import { MinusIcon, PlusIcon } from "lucide-react";
import { cn } from "cn";

import Typography from "@/components/shared/typography";
import { formatRupiah } from "@/lib/format";

// The pieces both buy panels share: the perfume one (product-purchase.tsx)
// and the general product one (general-purchase.tsx).

// How many of one variant fit in one order line.
export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 20;

// A choice box behind a hidden radio. Picked = solid, in the mode's primary
// color (Night Ink in Gading, gold in Noir), like the chips in DESIGN.md.
// Mode tokens only, no dark: overrides, so the picked state always wins.
export const CHOICE =
  "border border-input bg-card transition-colors hover:border-foreground peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring";

// The label of a group of choices and the choice it holds, e.g.
// "UKURAN ··· 30 ml". Hidden from screen readers: the legend and the radios
// already say it.
export function OptionHeader({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div aria-hidden className="flex items-baseline justify-between gap-4">
      <Typography as="span" variant="label">
        {label}
      </Typography>
      {value && (
        <Typography
          as="span"
          variant="subtitle"
          className="text-gold-accent italic"
        >
          {value}
        </Typography>
      )}
    </div>
  );
}

// − and + around the quantity: 44px wide, so they are easy to tap.
const STEPPER_BUTTON =
  "flex h-full w-11 items-center justify-center transition-colors hover:text-gold-accent focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-35";

// − quantity +. The buttons switch off at the limits, and both when the
// product can't be bought.
export function QuantityStepper({
  quantity,
  max = MAX_QUANTITY,
  disabled = false,
  onDecrease,
  onIncrease,
}: {
  quantity: number;
  max?: number;
  disabled?: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div className="flex h-13.5 shrink-0 items-center border border-input bg-card">
      <button
        type="button"
        onClick={onDecrease}
        disabled={disabled || quantity <= MIN_QUANTITY}
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
        onClick={onIncrease}
        disabled={disabled || quantity >= max}
        aria-label="Tambah jumlah"
        className={STEPPER_BUTTON}
      >
        <PlusIcon aria-hidden className="size-4" strokeWidth={1.5} />
      </button>
    </div>
  );
}

// DESIGN.md buttons: 54px tall, sharp, label type; the primary color of the
// mode. The price keeps its "Rp" casing.
const BAG_BUTTON =
  "flex min-h-13.5 flex-1 flex-wrap items-center justify-center gap-x-2 gap-y-0.5 bg-primary px-5 py-2 text-center text-[11px] font-semibold tracking-[0.18em] text-primary-foreground uppercase tabular-nums transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

// "Masukkan ke tas · Rp…". Until the bag exists (stage 3), a guest goes to
// log in first and carries the chosen variant along (`href`). Without an
// href or a total it is a switched-off button that says why.
export function BagButton({
  href,
  total,
  unavailable = "Tidak tersedia",
}: {
  href: string | null;
  total: number | null;
  unavailable?: string;
}) {
  if (!href || total === null) {
    return (
      <button
        type="button"
        disabled
        className={cn(BAG_BUTTON, "cursor-not-allowed opacity-50")}
      >
        {unavailable}
      </button>
    );
  }
  return (
    <Link href={href} className={BAG_BUTTON}>
      Masukkan ke tas
      <span aria-hidden>·</span>
      <span className="normal-case">{formatRupiah(total)}</span>
    </Link>
  );
}

// The chat link under the buttons, with a message already typed. Hidden when
// the shop's number isn't set (NEXT_PUBLIC_WHATSAPP_NUMBER).
export function WhatsAppLink({
  href,
  children,
}: {
  href: string | null;
  children: React.ReactNode;
}) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold underline-offset-4 transition-colors hover:text-gold-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <ChatIcon />
      {children}
      <span aria-hidden>→</span>
      <span className="sr-only"> (membuka WhatsApp)</span>
    </a>
  );
}

// The three promises under the buttons, with the line icons of prototype
// v5. A perfume is blended ("Diracik") after payment, a general product is
// packed ("Dikemas").
export function Assurances({ prepared }: { prepared: "Diracik" | "Dikemas" }) {
  const items = [
    { text: `${prepared} setelah pembayaran diterima`, icon: <BottleLine /> },
    { text: "Dikirim dari Karawang", icon: <TruckLine /> },
    { text: "Pembayaran aman lewat DOKU", icon: <CardLine /> },
  ];
  return (
    <Typography
      as="ul"
      variant="caption"
      role="list"
      className="mt-8 grid gap-3 border-t border-border pt-6 text-muted-foreground"
    >
      {items.map((item) => (
        <li key={item.text} className="flex items-center gap-3">
          <span aria-hidden className="text-foreground">
            {item.icon}
          </span>
          {item.text}
        </li>
      ))}
    </Typography>
  );
}

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

function BottleLine() {
  return (
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
  );
}

function TruckLine() {
  return (
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
  );
}

function CardLine() {
  return (
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
  );
}
