import { ProductGridSkeleton } from "@/features/catalog/components/product-grid";
export default function KoleksiLoading() {
  return (
    <div className="mt-12 min-[980px]:grid min-[980px]:grid-cols-[14rem_minmax(0,1fr)] min-[980px]:gap-10 min-[1180px]:grid-cols-[15.5rem_minmax(0,1fr)] min-[1180px]:gap-14">
      {/* The sidebar: the A–Z boxes, then a few rows. */}
      <div
        aria-hidden
        className="hidden motion-safe:animate-pulse min-[980px]:block"
      >
        <div className="border-t border-border pt-5">
          <div className="mb-3 h-3 w-14 bg-muted" />
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: 26 }, (_, index) => (
              <div key={index} className="aspect-square bg-muted" />
            ))}
          </div>
        </div>
        <div className="mt-7 border-t border-border pt-5">
          <div className="mb-3 h-3 w-16 bg-muted" />
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="flex h-9 items-center gap-3">
              <div className="size-4.5 bg-muted" />
              <div className="h-3.5 w-2/3 bg-muted" />
            </div>
          ))}
        </div>
      </div>

      <div>
        {/* The search box and the count. */}
        <div
          aria-hidden
          className="mb-8 flex flex-col gap-4 motion-safe:animate-pulse min-[980px]:flex-row min-[980px]:items-center min-[980px]:justify-between"
        >
          <div className="h-12 w-full bg-muted min-[980px]:max-w-md" />
          <div className="h-5 w-24 bg-muted" />
        </div>
        <ProductGridSkeleton count={6} withSidebar />
      </div>
    </div>
  );
}
