import type * as React from "react";

import Typography from "@/components/shared/typography";
import { InfoSection } from "@/features/catalog/components/product-info";
import type { PriceExample } from "@/features/home/showcase";
import { formatRupiah } from "@/lib/format";

const LINK =
  "font-semibold text-foreground underline underline-offset-4 hover:text-gold-accent";

export default function HomeFaq({
  example,
  souvenirFrom,
  similarHref,
  souvenirHref,
}: {
  example: PriceExample | null;
  souvenirFrom: number | null;
  similarHref: string | null;
  souvenirHref: string | null;
}) {
  const items: { question: string; answer: React.ReactNode }[] = [
    {
      question: "Apa beda murni dan campur?",
      answer: (
        <p>
          Murni (bibit) adalah minyak wangi tanpa campuran: lebih pekat, cukup
          dioles sedikit. Campur (parfum) adalah bibit yang dicampur pelarut
          parfum: lebih ringan dan siap disemprot.
        </p>
      ),
    },
    {
      question: "Bagaimana harganya dihitung?",
      answer: (
        <p>
          Tarif per ml dikali ukuran, ditambah harga botol.
          {example && (
            <>
              {" "}
              Contoh: {example.name} {example.volumeMl} ml campur ={" "}
              {formatRupiah(example.ratePerMl)} × {example.volumeMl} ml + botol{" "}
              {formatRupiah(example.bottlePrice)} ={" "}
              <strong className="font-semibold text-foreground">
                {formatRupiah(example.price)}
              </strong>
              .
            </>
          )}{" "}
          Tarif setiap wangi tertulis di halamannya.
        </p>
      ),
    },
    {
      question: "Kapan parfumku diracik dan dikirim?",
      answer: (
        <p>
          Botolmu diracik setelah pembayaran diterima, lalu dikemas dan dikirim
          dari Karawang ke seluruh Indonesia. Lama pengerjaan bisa ditanyakan ke
          peracik di WhatsApp.
        </p>
      ),
    },
    {
      question: "Bisa cari yang mirip dengan parfum favoritku?",
      answer: (
        <p>
          Bisa. Setiap wangi di sini memakai nama racikan kami sendiri. Sebutkan
          parfum favoritmu, peracik kami carikan yang paling mirip lalu mengirim
          nomor dan link-nya.{" "}
          {similarHref && (
            <a
              href={similarHref}
              target="_blank"
              rel="noopener noreferrer"
              className={LINK}
            >
              Tanya di WhatsApp
              <span className="sr-only"> (tab baru)</span>
            </a>
          )}
        </p>
      ),
    },
    {
      question: "Pembayarannya lewat apa?",
      answer: (
        <p>
          QRIS, virtual account, atau e-wallet, lewat DOKU. Pembayaran ditunggu
          paling lambat 24 jam setelah pesanan dibuat.
        </p>
      ),
    },
    {
      question: "Berapa ongkos kirimnya?",
      answer: <p>Ongkos kirim dan kurir dijelaskan saat checkout.</p>,
    },
    {
      question: "Bisa pesan souvenir atau dalam jumlah banyak?",
      answer: (
        <p>
          Bisa.
          {souvenirFrom !== null &&
            ` Souvenir pernikahan mulai ${formatRupiah(souvenirFrom)} per pcs.`}{" "}
          Untuk jumlah dan waktu pengerjaannya, tanya dulu di WhatsApp.{" "}
          {souvenirHref && (
            <a
              href={souvenirHref}
              target="_blank"
              rel="noopener noreferrer"
              className={LINK}
            >
              Tanya souvenir
              <span className="sr-only"> (WhatsApp, tab baru)</span>
            </a>
          )}
        </p>
      ),
    },
    {
      question: "Apakah ada toko yang bisa dikunjungi?",
      answer: (
        <p>
          Saat ini kami hanya melayani pesanan online. Semua botol diracik di
          Karawang.
        </p>
      ),
    },
  ];

  return (
    <section aria-labelledby="faq-title" className="py-21.5 min-[980px]:py-28">
      <div className="mx-auto grid max-w-330 gap-10 px-5 min-[980px]:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] min-[980px]:gap-16 min-[980px]:px-10">
        <div>
          <Typography as="h2" id="faq-title" variant="headline">
            Yang sering{" "}
            <em className="font-light text-gold-accent-soft">ditanyakan</em>.
          </Typography>
          <Typography variant="body" className="mt-4 text-muted-foreground">
            Jawaban singkat sebelum kamu memesan. Pertanyaan lain bisa langsung
            ke peracik di WhatsApp.
          </Typography>
        </div>
        <div className="border-t border-border">
          {items.map((item) => (
            <InfoSection key={item.question} title={item.question}>
              {item.answer}
            </InfoSection>
          ))}
        </div>
      </div>
    </section>
  );
}
