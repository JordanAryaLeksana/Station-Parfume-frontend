// Stands in for page.tsx while the product loads, in the same layout: the
// photo on the left (on top on phones), then the name, details, price and
// choices. Keep the grid classes in step with page.tsx, so nothing jumps
// when the product arrives.
//
// It is also what makes the page work at all: the slug is only known when a
// buyer asks for it, and Next 16 needs a loading boundary around such a page.
export default function ProductLoading() {
  return (
    <div className="mx-auto w-full max-w-330 px-5 pt-8 pb-24 min-[980px]:px-10 min-[980px]:pt-12 min-[980px]:pb-32">
      <div role="status">
        <span className="sr-only">Memuat produk…</span>
        <div aria-hidden className="motion-safe:animate-pulse">
          {/* The breadcrumb. */}
          <div className="h-3.5 w-52 bg-muted" />

          <div className="mt-8 min-[980px]:mt-10 min-[980px]:grid min-[980px]:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] min-[980px]:items-start min-[980px]:gap-12 min-[1180px]:gap-16">
            <div className="bg-white p-3 pb-8 ring-1 ring-border min-[980px]:p-4 min-[980px]:pb-10 dark:bg-cream dark:ring-0">
              <div className="aspect-square bg-cream-2" />
            </div>

            <div className="mt-10 min-[980px]:mt-0">
              <div className="h-11 w-3/4 bg-muted min-[980px]:h-16" />
              <div className="mt-5 h-3 w-44 bg-muted" />
              <div className="mt-8 h-8 w-48 bg-muted" />
              {/* Size and blend choices, then the nota. */}
              <div className="mt-10 grid grid-cols-3 gap-3">
                {Array.from({ length: 3 }, (_, index) => (
                  <div key={index} className="h-18 bg-muted" />
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {Array.from({ length: 2 }, (_, index) => (
                  <div key={index} className="h-20 bg-muted" />
                ))}
              </div>
              <div className="mt-8 h-56 bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
