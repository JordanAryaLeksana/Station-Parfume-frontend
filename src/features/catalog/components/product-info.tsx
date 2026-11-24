import React from "react";
import { PlusIcon } from "lucide-react";

import { aromasOf } from "@/features/catalog/aroma";
import type { ProductDetail } from "@/features/catalog/types";

type Section = {
  title: string;
  body: React.ReactNode;
  // Open when the page loads.
  open?: boolean;
};

// Fixed text, the same on every perfume page. It still needs the owner's
// review (PRODUCT.md).
const BLEND_SECTION: Section = {
  title: "Murni atau campur?",
  body: (
    <p>
      Murni (bibit) adalah minyak wangi tanpa campuran: lebih pekat dan cukup
      dipakai sedikit. Campur (parfum) adalah bibit yang dicampur pelarut
      parfum: lebih ringan dan siap disemprot. Harganya dihitung dari tarif per
      ml dikali ukuran, ditambah harga botol.
    </p>
  ),
};

// Neutral on purpose until the ongkir scheme is decided with the owner. A
// perfume is blended after payment; a general product is just packed.
function shippingSection(kind: ProductDetail["kind"]): Section {
  const prepared = kind === "perfume" ? "diracik" : "dikemas";
  return {
    title: "Pengiriman & pembayaran",
    body: (
      <p>
        Pesanan {prepared} setelah pembayaran diterima, lalu dikirim dari
        Karawang. Ongkos kirim dan kurir dijelaskan saat checkout. Pembayaran
        lewat DOKU.
      </p>
    ),
  };
}

// The fold-out sections under the buy panel. Plain <details>: they open and
// close without JavaScript, and screen readers know what they are.
export default function ProductInfo({ product }: { product: ProductDetail }) {
  const aromas = aromasOf(product);

  // ═══════════════ LOGIKA C5: bagian Anda ═══════════════
  // Sama seperti C3 dan C4: ganti setiap baris "sementara".

  // C5 STEP 1: teks "Tentang wangi ini".
  //   Kalau admin sudah mengisi deskripsi produk (product.description),
  //   pakai itu. Kalau masih kosong (sekarang semua masih kosong), susun dari
  //   deskripsi setiap aromanya: `aromas` berisi 1–2 aroma, dan masing-masing
  //   punya `description`, misalnya "Kayu yang hangat dan kering. ...".
  //   Gabungkan dengan spasi.
  //   Petunjuk:
  //   - .trim() membuang spasi di awal dan akhir, jadi "  " menjadi "".
  //   - `a || b` memberi a kalau a berisi; kalau a kosong (""), memberi b.
  //   - .map(...) mengubah setiap isi daftar, .join(" ") menggabungkannya.
  const about =
    product.description.trim() ||
    aromas.map((aroma) => aroma.description).join(" ");

  // C5 STEP 2: daftar nama aroma untuk baris "Aroma: ...", dengan nama
  //   Indonesianya di dalam kurung dan disambung "dan":
  //   "Oud (gaharu) dan Woody (kayu)"
  //   Setiap aroma punya `label` ("Oud") dan `indonesian` ("gaharu").
  //   Kalau hasilnya kosong, baris "Aroma: ..." tidak ditampilkan.
  const families = aromas
    .map((aroma) => `${aroma.label} (${aroma.indonesian})`)
    .join(" dan ");

  // ═══════════════ DATA & TAMPILAN: sudah jadi ═══════════════
  // "Tentang wangi ini" and "Murni atau campur?" are about perfumes; a
  // general product only gets the shipping section.
  const sections: Section[] = [
    ...(product.kind === "perfume"
      ? [
          {
            title: "Tentang wangi ini",
            open: true,
            body: (
              <>
                <p>{about}</p>
                {families && <p className="mt-3">Aroma: {families}.</p>}
              </>
            ),
          },
          BLEND_SECTION,
        ]
      : []),
    shippingSection(product.kind),
  ];

  return (
    <div className="mt-10 border-t border-border">
      {sections.map((section, idx) => (
        <InfoSection key={idx} title={section.title} open={section.open}>
          {section.body}
        </InfoSection>
      ))}
    </div>
  );
}

// One fold-out: the title in label style with a + that turns into × when
// open, then the text (Body style, at most 70 characters a line).
function InfoSection({
  title,
  open,
  children,
}: {
  title: string;
  open?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details open={open} className="group border-b border-border">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[11px] font-semibold tracking-[0.22em] uppercase transition-colors hover:text-gold-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
        {title}
        <PlusIcon
          aria-hidden
          strokeWidth={1.5}
          className="size-4 shrink-0 transition-transform duration-300 ease-atelier group-open:rotate-45 motion-reduce:transition-none"
        />
      </summary>
      <div className="max-w-[70ch] pb-5 text-[15px] leading-relaxed text-muted-foreground">
        {children}
      </div>
    </details>
  );
}
