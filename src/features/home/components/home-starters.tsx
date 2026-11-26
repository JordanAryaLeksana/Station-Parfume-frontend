import Link from "next/link";

import Typography from "@/components/shared/typography";
import { Button } from "@/components/ui/button";
import ProductGrid, {
  ProductGridSkeleton,
} from "@/features/catalog/components/product-grid";
import type { ProductCard } from "@/features/catalog/types";
import GoArrow from "@/features/home/components/go-arrow";

export default function HomeStarters({
  products,
  total,
}: {
  products: ProductCard[] | null;
  total: number | null;
}) {
  return (
    <section
      aria-labelledby="starters-title"
      className="py-21.5 min-[980px]:py-32.5"
    >
      <div className="mx-auto max-w-330 px-5 min-[980px]:px-10">
        <div className="mb-10 flex flex-col gap-5 min-[980px]:mb-14 min-[980px]:flex-row min-[980px]:items-end min-[980px]:justify-between min-[980px]:gap-10">
          <Typography as="h2" id="starters-title" variant="headline">
            Pilihan{" "}
            <em className="font-light text-gold-accent-soft">peracik</em>.
          </Typography>
          <Typography variant="body" className="max-w-95 text-muted-foreground">
            Delapan wangi untuk mulai berkenalan. Harga di kartu adalah ukuran
            terkecil, 20 ml campur.
          </Typography>
        </div>

        {products ? (
          <ProductGrid products={products} headingLevel={3} />
        ) : (
          <ProductGridSkeleton count={8} />
        )}

        <div className="mt-12 flex justify-center min-[980px]:mt-15">
          <Button asChild size="atelier" variant="line">
            <Link href="/koleksi?kind=perfume">
              {total === null
                ? "Lihat semua wangi"
                : `Lihat semua ${total} wangi`}
              <GoArrow />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
