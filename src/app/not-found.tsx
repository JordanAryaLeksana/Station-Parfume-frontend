import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-330 flex-1 flex-col justify-center px-5 py-24 min-[980px]:px-10">
      <div aria-hidden className="mb-8 takar h-2 w-30" />
      <h1 className="max-w-[14ch] font-primary text-[clamp(2.375rem,4.3vw,4rem)] leading-[1.02]">
        Halaman ini <em className="font-light text-gold-accent-soft">tidak</em>{" "}
        ada.
      </h1>
      <p className="mt-5 max-w-[46ch] text-muted-foreground">
        Mungkin alamatnya salah ketik, atau halamannya sudah dipindah. Wangi
        yang kamu cari tetap bisa ditemukan di koleksi.
      </p>
      <div className="mt-9 flex flex-wrap gap-3">
        <Button asChild size="lg" className="h-12 px-6">
          <Link href="/koleksi">Lihat koleksi</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="h-12 px-6">
          <Link href="/">Kembali ke beranda</Link>
        </Button>
      </div>
    </div>
  );
}
