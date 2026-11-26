import Link from "next/link";

import Typography from "@/components/shared/typography";
import PriceBoard from "@/features/home/components/price-board";
import type { PriceBoard as Board } from "@/features/home/showcase";

export default function HomePrices({
  board,
  loading = false,
}: {
  board: Board | null;
  loading?: boolean;
}) {
  return (
    <section
      aria-labelledby="prices-title"
      className="py-21.5 min-[980px]:py-28"
    >
      <div className="mx-auto grid max-w-330 grid-cols-1 gap-10 px-5 min-[980px]:grid-cols-[minmax(0,1fr)_27rem] min-[980px]:items-center min-[980px]:gap-16 min-[980px]:px-10">
        <div>
          <Typography as="h2" id="prices-title" variant="headline">
            Harga dihitung{" "}
            <em className="font-light text-gold-accent-soft">terbuka</em>.
          </Typography>
          <Typography variant="body" className="mt-5 text-muted-foreground">
            Setiap botol: tarif per ml dikali ukuran, ditambah harga botol.
            Tarifnya bergantung pada wangi dan racikannya. Papan ini memuat
            rentang tarif semua wangi kami; harga pasti tiap wangi ada di
            halamannya.
          </Typography>
          <Link
            href="/koleksi?kind=perfume"
            className="mt-6 inline-block border-b border-gold-accent pb-0.5 text-[13px] font-semibold transition-colors hover:text-gold-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Lihat harga tiap wangi →
          </Link>
        </div>
        <PriceBoard board={board} loading={loading} />
      </div>
    </section>
  );
}
