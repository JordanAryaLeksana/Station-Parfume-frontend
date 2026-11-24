import type { Metadata } from "next";
import Link from "next/link";

import Typography from "@/components/shared/typography";
import { Button } from "@/components/ui/button";
import CatalogActiveFilters from "@/features/catalog/components/catalog-active-filters";
import CatalogFilterPanel from "@/features/catalog/components/catalog-filter-panel";
import CatalogFilterSheet from "@/features/catalog/components/catalog-filter-sheet";
import CatalogSearch from "@/features/catalog/components/catalog-search";
import ProductGrid from "@/features/catalog/components/product-grid";
import { applyFilters, facetCounts } from "@/features/catalog/facets";
import {
  activeFilterCount,
  catalogHref,
  NO_FILTERS,
  parseCatalogFilters,
} from "@/features/catalog/filters";
import { listProducts } from "@/features/catalog/server";
import { whatsappUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Koleksi",
  description:
    "Semua wangi Station Parfume, diracik per ml setelah kamu memesan: pilih dari aromanya, grade Regular atau Exclusive, atau cari namanya.",
};

export default async function KoleksiPage({
  searchParams,
}: PageProps<"/koleksi">) {
  const filters = parseCatalogFilters(await searchParams);

  const found = await listProducts({ q: filters.q });
  const products = applyFilters(found, filters);
  const counts = facetCounts(found, filters);

  // For the empty state: with a search AND filters on, offer the search
  // without the filters first.
  const filterCount = activeFilterCount(filters);
  const searchWithoutFilters =
    filters.q && filterCount > 0
      ? catalogHref({ ...NO_FILTERS, q: filters.q })
      : null;
  const waHref = whatsappUrl(
    filters.q
      ? `Halo Station Parfume, saya mencari wangi "${filters.q}" tapi belum ketemu di website.`
      : "Halo Station Parfume, saya mau tanya soal wangi.",
  );

  return (
    <div className="mt-12 min-[980px]:grid min-[980px]:grid-cols-[14rem_minmax(0,1fr)] min-[980px]:gap-10 min-[1180px]:grid-cols-[15.5rem_minmax(0,1fr)] min-[1180px]:gap-14">
      <aside aria-label="Filter produk" className="hidden min-[980px]:block">
        <div className="sticky top-28 max-h-[calc(100svh-8.5rem)] scrollbar-thin [scrollbar-color:var(--color-border)_transparent] overflow-y-auto overscroll-contain pr-3 pb-6">
          <CatalogFilterPanel filters={filters} counts={counts} />
        </div>
      </aside>

      <section aria-label="Daftar produk">
        <div className="mb-8 flex flex-col gap-4">
          <div className="flex flex-col gap-4 min-[980px]:flex-row min-[980px]:items-center min-[980px]:justify-between">
            <CatalogSearch filters={filters} />
            <div className="flex items-center justify-between gap-4">
              <CatalogFilterSheet
                filters={filters}
                counts={counts}
                resultCount={products.length}
              />
              {/* aria-live: screen readers announce the new count after a
                  filter change. */}
              <Typography
                variant="caption"
                aria-live="polite"
                className="text-muted-foreground"
              >
                <span className="font-semibold text-foreground tabular-nums">
                  {products.length}
                </span>{" "}
                produk
                {filters.q && <> untuk “{filters.q}”</>}
              </Typography>
            </div>
          </div>
          <CatalogActiveFilters filters={filters} />
        </div>

        {products.length > 0 ? (
          // h2: the names sit right under the page's h1.
          <ProductGrid
            products={products}
            headingLevel={2}
            eagerFirstRow
            withSidebar
          />
        ) : (
          <div className="border-t border-border pt-12">
            <Typography variant="title">
              Belum ada wangi yang{" "}
              <em className="font-light text-gold-accent-soft">cocok</em>.
            </Typography>
            <Typography
              variant="body"
              className="mt-3 max-w-[46ch] text-muted-foreground"
            >
              {filterCount > 0
                ? "Coba lepas beberapa filter di atas, atau mulai lagi dari semua koleksi."
                : "Coba kata lain, atau lihat semua wangi di koleksi."}
            </Typography>
            <div className="mt-8 flex flex-wrap gap-3">
              {searchWithoutFilters && (
                <Button asChild size="lg" className="h-12 px-6">
                  <Link href={searchWithoutFilters} scroll={false}>
                    Cari “{filters.q}” tanpa filter
                  </Link>
                </Button>
              )}
              <Button
                asChild
                size="lg"
                variant={searchWithoutFilters ? "outline" : "default"}
                className="h-12 px-6"
              >
                <Link href="/koleksi" scroll={false}>
                  {filterCount > 0 && !filters.q
                    ? "Hapus semua filter"
                    : "Lihat semua koleksi"}
                </Link>
              </Button>
              {waHref && (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 px-6"
                >
                  <a href={waHref} target="_blank" rel="noopener noreferrer">
                    Tanya peracik
                    <span className="sr-only"> (WhatsApp, tab baru)</span>
                  </a>
                </Button>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
