"use client";

import React from "react";
import { cn } from "cn";

import { BLENDS } from "@/features/catalog/blends";
import type { PriceBreakdown } from "@/features/catalog/pricing";
import type { Concentration } from "@/features/catalog/types";
import { formatRupiah } from "@/lib/format";

type NotaRacikProps = {
  // The atelier number, as on the card.
  number: number;
  scentName: string;
  concentration: Concentration;
  breakdown: PriceBreakdown | null;
  total: number | null;
  className?: string;
};

type Row = { id: string; label: string; value: string };

const rowKey = (row: Row) => `${row.id}:${row.label}=${row.value}`;


export default function NotaRacik({
  number,
  scentName,
  concentration,
  breakdown,
  total,
  className,
}: NotaRacikProps) {
  const blend = BLENDS[concentration];
  const rows: Row[] = [
    { id: "wangi", label: "Wangi", value: scentName },
    {
      id: "racikan",
      label: "Racikan",
      value: `${blend.name} (${blend.alias})`,
    },
  ];
  if (breakdown) {
    rows.push(
      {
        id: "cairan",
        label: `${formatRupiah(breakdown.ratePerMl)} × ${breakdown.volumeMl} ml`,
        value: formatRupiah(breakdown.liquidPrice),
      },
      {
        id: "botol",
        label: `Botol ${breakdown.volumeMl} ml`,
        value: formatRupiah(breakdown.bottlePrice),
      },
    );
  }
  const totalRow: Row = {
    id: "total",
    label: "Total",
    value: total === null ? "—" : formatRupiah(total),
  };

  const signature = [...rows, totalRow].map(rowKey).join("|");
  const [lastSignature, setLastSignature] = React.useState(signature);
  const [changed, setChanged] = React.useState<readonly string[]>([]);
  if (signature !== lastSignature) {
    const before = new Set(lastSignature.split("|"));
    setChanged(
      [...rows, totalRow]
        .filter((row) => !before.has(rowKey(row)))
        .map((row) => row.id),
    );
    setLastSignature(signature);
  }
  const flash = (row: Row) =>
    changed.includes(row.id) && "motion-safe:animate-nota-flash";

  const label =
    "flex flex-1 items-baseline gap-2 after:flex-1 after:-translate-y-1 after:border-b after:border-dotted after:border-ink/30 after:content-['']";

  return (
    <section
      aria-label="Nota racik"
      className={cn(
        "bg-white px-6.5 py-6 text-[13.5px] text-ink tabular-nums scalloped",
        className,
      )}
    >
      <h2 className="flex items-baseline justify-between gap-4 border-b border-dashed border-ink/25 pb-2.5 font-primary text-[1.375rem] font-light italic">
        Nota racik
        <span className="font-sans text-[10px] font-semibold tracking-[0.2em] text-gold-dark not-italic">
          No. {number}
        </span>
      </h2>
      <dl className="mt-2.5">
        {rows.map((row) => (
          <div
            key={rowKey(row)}
            className={cn("flex items-baseline gap-2 py-1", flash(row))}
          >
            <dt className={label}>{row.label}</dt>
            <dd className="text-right">{row.value}</dd>
          </div>
        ))}
        <div
          key={rowKey(totalRow)}
          className={cn(
            "mt-2 flex items-baseline gap-2 border-t border-dashed border-ink/25 pt-3 text-[15px] font-bold",
            flash(totalRow),
          )}
        >
          <dt className={label}>{totalRow.label}</dt>
          <dd className="text-right">{totalRow.value}</dd>
        </div>
      </dl>
    </section>
  );
}
