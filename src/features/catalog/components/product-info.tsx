import React from "react";
import { PlusIcon } from "lucide-react";

import Typography from "@/components/shared/typography";
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

export default function ProductInfo({ product }: { product: ProductDetail }) {
  const aromas = aromasOf(product);
  const about =
    product.description.trim() ||
    aromas.map((aroma) => aroma.description).join(" ");
  const families = aromas
    .map((aroma) => `${aroma.label} (${aroma.indonesian})`)
    .join(" dan ");

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
      <Typography
        as="summary"
        variant="label"
        className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 transition-colors hover:text-gold-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden"
      >
        {title}
        <PlusIcon
          aria-hidden
          strokeWidth={1.5}
          className="size-4 shrink-0 transition-transform duration-300 ease-atelier group-open:rotate-45 motion-reduce:transition-none"
        />
      </Typography>
      <Typography
        as="div"
        variant="body"
        className="pb-5 text-muted-foreground"
      >
        {children}
      </Typography>
    </details>
  );
}
