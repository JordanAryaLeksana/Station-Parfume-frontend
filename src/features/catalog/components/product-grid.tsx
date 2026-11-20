import ProductCard from "@/features/catalog/components/product-card";
import type { ProductCard as Product } from "@/features/catalog/types";

// DESIGN.md (Layout): 2 columns on phones, 3 from 980px, 4 from 1180px. Rows
// get more room than columns, so each name stays with its own photo.
const GRID =
  "grid grid-cols-2 gap-x-4 gap-y-10 min-[980px]:grid-cols-3 min-[980px]:gap-x-6 min-[980px]:gap-y-14 min-[1180px]:grid-cols-4";

// Next to the filter sidebar (/koleksi) there is room for one column less,
// so the cards keep about the same width (~290px).
const GRID_WITH_SIDEBAR =
  "grid grid-cols-2 gap-x-4 gap-y-10 min-[980px]:gap-x-6 min-[980px]:gap-y-14 min-[1180px]:grid-cols-3";

type ProductGridProps = {
  products: Product[];
  headingLevel?: 2 | 3;
  // The grid is on screen when the page opens (/koleksi): load the first
  // row's photos right away instead of waiting for the scroll.
  eagerFirstRow?: boolean;
  withSidebar?: boolean;
};

export default function ProductGrid({
  products,
  headingLevel,
  eagerFirstRow = false,
  withSidebar = false,
}: ProductGridProps) {
  return (
    // role="list": Safari drops the list role when list-style is none.
    <ul role="list" className={withSidebar ? GRID_WITH_SIDEBAR : GRID}>
      {products.map((product, index) => (
        <li key={product.id}>
          <ProductCard
            product={product}
            headingLevel={headingLevel}
            eager={eagerFirstRow && index < (withSidebar ? 3 : 4)}
          />
        </li>
      ))}
    </ul>
  );
}

export function ProductGridSkeleton({
  count = 8,
  withSidebar = false,
}: {
  count?: number;
  withSidebar?: boolean;
}) {
  return (
    <div role="status">
      <span className="sr-only">Memuat produk…</span>
      <ul aria-hidden className={withSidebar ? GRID_WITH_SIDEBAR : GRID}>
        {Array.from({ length: count }, (_, index) => (
          <li key={index} className="motion-safe:animate-pulse">
            <div className="bg-white p-3 pb-8 ring-1 ring-border dark:bg-cream dark:ring-0">
              <div className="aspect-square bg-cream-2" />
            </div>
            <div className="mt-4 h-5 w-3/4 bg-muted min-[980px]:h-7" />
            <div className="mt-2.5 h-3.5 w-1/2 bg-muted" />
            <div className="mt-2.5 h-4 w-2/5 bg-muted" />
          </li>
        ))}
      </ul>
    </div>
  );
}
