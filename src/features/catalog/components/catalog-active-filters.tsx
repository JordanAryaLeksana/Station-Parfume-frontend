import Link from "next/link";
import { XIcon } from "lucide-react";
import { cn } from "cn";

import { getAroma } from "@/features/catalog/aroma";
import {
  catalogHref,
  GRADE_LABELS,
  KIND_LABELS,
  type CatalogFilters,
} from "@/features/catalog/filters";

type Chip = { key: string; label: string; href: string; quoted?: boolean };

export default function CatalogActiveFilters({
  filters,
}: {
  filters: CatalogFilters;
}) {
  const chips: Chip[] = [
    ...filters.letters.map((letter) => ({
      key: `letter-${letter}`,
      label: `Huruf ${letter.toUpperCase()}`,
      href: catalogHref({
        ...filters,
        letters: filters.letters.filter((item) => item !== letter),
      }),
    })),
    ...filters.notes.map((note) => ({
      key: `note-${note}`,
      label: getAroma(note).label,
      href: catalogHref({
        ...filters,
        notes: filters.notes.filter((item) => item !== note),
      }),
    })),
    ...filters.grades.map((grade) => ({
      key: `grade-${grade}`,
      label: GRADE_LABELS[grade],
      href: catalogHref({
        ...filters,
        grades: filters.grades.filter((item) => item !== grade),
      }),
    })),
    ...filters.kinds.map((kind) => ({
      key: `kind-${kind}`,
      label: KIND_LABELS[kind],
      href: catalogHref({
        ...filters,
        kinds: filters.kinds.filter((item) => item !== kind),
      }),
    })),
  ];
  if (filters.inStock) {
    chips.push({
      key: "stock",
      label: "Hanya yang tersedia",
      href: catalogHref({ ...filters, inStock: false }),
    });
  }
  if (filters.q) {
    chips.push({
      key: "q",
      label: `“${filters.q}”`,
      href: catalogHref({ ...filters, q: undefined }),
      quoted: true,
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <ul aria-label="Filter aktif" className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <li key={chip.key}>
            {/* scroll={false}: removing a filter changes the list, not the
                place on the page. */}
            <Link
              href={chip.href}
              scroll={false}
              aria-label={`Hapus filter ${chip.label}`}
              className={cn(
                "inline-flex h-9 items-center gap-2 border border-border bg-card px-3.5 text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors duration-300 hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                // The search is the buyer's own words: keep their case.
                chip.quoted &&
                  "text-[13px] font-medium tracking-normal normal-case",
              )}
            >
              {chip.label}
              <XIcon aria-hidden className="size-3.5" strokeWidth={1.5} />
            </Link>
          </li>
        ))}
      </ul>
      {chips.length > 1 && (
        <Link
          href="/koleksi"
          scroll={false}
          className="ml-1 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase underline underline-offset-4 transition-colors hover:text-foreground"
        >
          Hapus semua
        </Link>
      )}
    </div>
  );
}
