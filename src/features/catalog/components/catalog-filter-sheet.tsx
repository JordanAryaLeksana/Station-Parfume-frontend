import Link from "next/link";
import { SlidersHorizontalIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import CatalogFilterPanel from "@/features/catalog/components/catalog-filter-panel";
import type { FacetCounts } from "@/features/catalog/facets";
import {
  activeFilterCount,
  catalogHref,
  NO_FILTERS,
  type CatalogFilters,
} from "@/features/catalog/filters";

// The filters on phones (below 980px, where the sidebar is hidden): a
// "Filter" button that opens the same checkbox panel from the right (the
// site menu already slides in from the left).
//
// No "use client" needed here: Sheet already has it inside sheet.tsx.
//
// A tap on a box applies at once, like in the sidebar, and the list behind
// the panel updates. The panel stays open meanwhile: its open state lives in
// <Sheet>, which keeps its place in the page when the new list arrives.
// "Lihat N produk" closes it; N is the count for the filters now chosen.
export default function CatalogFilterSheet({
  filters,
  counts,
  resultCount,
}: {
  filters: CatalogFilters;
  counts: FacetCounts;
  resultCount: number;
}) {
  const chosen = activeFilterCount(filters);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex h-12 items-center gap-2.5 border border-input bg-card px-4 text-[11px] font-semibold tracking-[0.18em] uppercase transition-colors hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring min-[980px]:hidden"
        >
          <SlidersHorizontalIcon
            aria-hidden
            className="size-4"
            strokeWidth={1.5}
          />
          Filter
          {chosen > 0 && (
            <span className="inline-flex min-w-5 items-center justify-center bg-primary px-1.5 py-0.5 text-[10px] tracking-normal text-primary-foreground tabular-nums">
              {chosen}
              <span className="sr-only"> filter aktif</span>
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        showCloseButton={false}
        className="gap-0 p-0 data-[side=right]:w-[88%]"
      >
        <SheetHeader className="flex-row items-center justify-between border-b border-border py-2.5 pr-2 pl-5">
          <SheetTitle className="font-primary text-2xl font-normal">
            Filter
          </SheetTitle>
          <SheetDescription className="sr-only">
            Saring koleksi menurut abjad, aroma, grade, jenis, dan ketersediaan.
          </SheetDescription>
          <SheetClose
            aria-label="Tutup filter"
            className="inline-flex size-11 items-center justify-center transition-colors hover:text-gold-accent-soft"
          >
            <XIcon aria-hidden className="size-5" strokeWidth={1.25} />
          </SheetClose>
        </SheetHeader>

        {/* The choices scroll; the header and the buttons stay. The first
            group drops its top rule: the header's line is right above it. */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-1 pb-6 [&_fieldset:first-of-type]:border-t-0">
          <CatalogFilterPanel filters={filters} counts={counts} />
        </div>

        <SheetFooter className="mt-0 flex-row gap-3 border-t border-border p-4">
          {chosen > 0 && (
            // Clears the filters but keeps the search; the panel stays open
            // so the buyer sees everything unchecked.
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 px-4 text-[11px] font-semibold tracking-[0.16em] uppercase"
            >
              <Link
                href={catalogHref({ ...NO_FILTERS, q: filters.q })}
                scroll={false}
              >
                Hapus semua
              </Link>
            </Button>
          )}
          <SheetClose asChild>
            <Button
              size="lg"
              className="h-12 flex-1 px-4 text-[11px] font-semibold tracking-[0.16em] uppercase"
            >
              Lihat {resultCount} produk
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
