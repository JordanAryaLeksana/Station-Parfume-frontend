// Needs state and change handlers (the boxes apply at once), so it is a
// Client Component.
"use client";

import type * as React from "react";
import { useState } from "react";
import Form from "next/form";
import { CheckIcon } from "lucide-react";
import { cn } from "cn";

import { AROMAS, aromaSwatch } from "@/features/catalog/aroma";
import type { FacetCounts } from "@/features/catalog/facets";
import {
  GRADE_LABELS,
  GRADES,
  KIND_LABELS,
  KINDS,
  LETTERS,
  type CatalogFilters,
  type Letter,
} from "@/features/catalog/filters";

// The /koleksi filters as checkbox groups, like the sidebar of most shops.
//
// It is a plain GET form: the checked boxes become the URL
// (?note=floral&note=woody&grade=exclusive…), so it works without
// JavaScript too (a "Terapkan" button shows then). With JavaScript, every
// change submits at once; next/form turns that into a client-side navigation
// and the page sends back the new list and counts.
//
// The number after each choice is how many products it would show
// (facetCounts in facets.ts). A choice with 0 that isn't checked is disabled.
export default function CatalogFilterPanel({
  filters,
  counts,
}: {
  filters: CatalogFilters;
  counts: FacetCounts;
}) {
  return (
    <Form action="/koleksi" scroll={false} className="flex flex-col gap-7">
      {/* A filter change keeps the search. */}
      {filters.q && <input type="hidden" name="q" value={filters.q} />}

      {/* A–Z: a grid of letter boxes instead of 26 rows. */}
      <FilterGroup legend="Abjad" className="grid grid-cols-7 gap-1.5">
        {LETTERS.map((letter) => (
          <LetterOption
            key={letter}
            letter={letter}
            checked={filters.letters.includes(letter)}
            count={counts.letters[letter]}
          />
        ))}
      </FilterGroup>

      <FilterGroup legend="Aroma">
        {AROMAS.map((aroma) => (
          <FilterOption
            key={aroma.note}
            name="note"
            value={aroma.note}
            checked={filters.notes.includes(aroma.note)}
            count={counts.notes[aroma.note]}
          >
            <span
              aria-hidden
              className="size-2.5 shrink-0 rounded-full"
              style={{ background: aromaSwatch(aroma) }}
            />
            {aroma.label}
            <span className="font-primary font-light text-muted-foreground italic">
              {aroma.indonesian}
            </span>
          </FilterOption>
        ))}
      </FilterGroup>

      <FilterGroup legend="Grade">
        {GRADES.map((grade) => (
          <FilterOption
            key={grade}
            name="grade"
            value={grade}
            checked={filters.grades.includes(grade)}
            count={counts.grades[grade]}
          >
            {GRADE_LABELS[grade]}
          </FilterOption>
        ))}
      </FilterGroup>

      <FilterGroup legend="Jenis">
        {KINDS.map((kind) => (
          <FilterOption
            key={kind}
            name="kind"
            value={kind}
            checked={filters.kinds.includes(kind)}
            count={counts.kinds[kind]}
          >
            {KIND_LABELS[kind]}
          </FilterOption>
        ))}
      </FilterGroup>

      <FilterGroup legend="Ketersediaan">
        <FilterOption
          name="stock"
          value="1"
          checked={filters.inStock}
          count={counts.inStock}
        >
          Hanya yang tersedia
        </FilterOption>
      </FilterGroup>

      {/* Without JavaScript nothing submits on change, so a button does. */}
      <noscript>
        <button
          type="submit"
          className="h-12 w-full bg-primary text-[11px] font-semibold tracking-[0.18em] text-primary-foreground uppercase"
        >
          Terapkan
        </button>
      </noscript>
    </Form>
  );
}

// A <fieldset> with a <legend>: screen readers announce "Aroma, group"
// before the choices. The legend is styled as a label, not a heading.
function FilterGroup({
  legend,
  className,
  children,
}: {
  legend: string;
  // Lays out the choices; a column of rows by default.
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border-t border-border pt-5">
      {/* float + full width makes the legend behave like a normal block. */}
      <legend className="float-left mb-2 w-full text-[11px] font-semibold tracking-[0.22em] text-muted-foreground uppercase">
        {legend}
      </legend>
      <div className={cn("clear-both flex flex-col", className)}>
        {children}
      </div>
    </fieldset>
  );
}

// A box shows a click right away, before the new page arrives. When the URL
// changes some other way (Back, or removing a filter elsewhere), the box
// follows it: React's "adjust state when a prop changes" pattern. A `key`
// would also reset it, but would remount the box and lose the keyboard
// focus. Shared by the rows and the letter boxes.
function useCheckedFromUrl(inUrl: boolean) {
  const [checked, setChecked] = useState(inUrl);
  const [lastInUrl, setLastInUrl] = useState(inUrl);
  if (inUrl !== lastInUrl) {
    setLastInUrl(inUrl);
    setChecked(inUrl);
  }
  return [checked, setChecked] as const;
}

// One letter of the A–Z group: a square that fills when chosen. The count
// is not drawn (no room), but screen readers hear it and the mouse sees it
// as a tooltip.
function LetterOption({
  letter,
  checked: inUrl,
  count,
}: {
  letter: Letter;
  checked: boolean;
  count: number;
}) {
  const [checked, setChecked] = useCheckedFromUrl(inUrl);
  const disabled = count === 0 && !checked;

  return (
    <label
      title={`${count} produk`}
      className={cn("relative", disabled ? "opacity-35" : "cursor-pointer")}
    >
      <input
        type="checkbox"
        name="letter"
        value={letter}
        checked={checked}
        disabled={disabled}
        onChange={(event) => {
          setChecked(event.target.checked);
          event.target.form?.requestSubmit();
        }}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "flex aspect-square items-center justify-center border border-border text-[13px] font-semibold uppercase transition-colors duration-200 peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring",
          !disabled && "hover:border-foreground",
        )}
      >
        {letter}
      </span>
      <span className="sr-only">{`${letter.toUpperCase()}, ${count} produk`}</span>
    </label>
  );
}

function FilterOption({
  name,
  value,
  checked: inUrl,
  count,
  children,
}: {
  name: string;
  value: string;
  checked: boolean;
  count: number;
  children: React.ReactNode;
}) {
  const [checked, setChecked] = useCheckedFromUrl(inUrl);
  const disabled = count === 0 && !checked;

  return (
    <label
      className={cn(
        "flex min-h-11 items-center gap-3 text-sm min-[980px]:min-h-9",
        disabled ? "opacity-45" : "cursor-pointer",
      )}
    >
      {/* The real checkbox is visually hidden but still focusable; Space
          toggles it. The square next to it draws its state. */}
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={(event) => {
          setChecked(event.target.checked);
          event.target.form?.requestSubmit();
        }}
        className="peer sr-only"
      />
      {/* Empty: bg-card (white in Gading, raised black in Noir). Checked:
          bg-primary (Night Ink in Gading, gold in Noir). Only mode tokens,
          no dark: override: a dark:bg-… here would beat peer-checked:bg-…
          (same specificity, later in the CSS) and leave the box empty. */}
      <span
        aria-hidden
        className="flex size-4.5 shrink-0 items-center justify-center border border-input bg-card transition-colors duration-200 peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100"
      >
        <CheckIcon className="size-3.5" strokeWidth={2.5} />
      </span>
      <span className="flex min-w-0 items-center gap-2">{children}</span>
      <span className="ml-auto pl-2 text-[13px] text-muted-foreground tabular-nums">
        {count}
      </span>
    </label>
  );
}
