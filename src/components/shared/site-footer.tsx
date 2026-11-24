import Link from "next/link";
import { cn } from "cn";

import Logo from "@/components/shared/logo";
import Typography from "@/components/shared/typography";
import { Button } from "@/components/ui/button";
import { whatsappUrl } from "@/lib/whatsapp";

// Link columns. Pages that don't exist yet (Stage 5) show the 404 page.
const FOOTER_LINKS = [
  {
    title: "Belanja",
    links: [
      { label: "Semua wangi", href: "/koleksi" },
      { label: "Exclusive", href: "/koleksi?grade=exclusive" },
      { label: "Mobil & souvenir", href: "/koleksi?kind=general" },
    ],
  },
  {
    title: "Bantuan",
    links: [
      { label: "Lacak pesanan", href: "/pesanan" },
      { label: "Pengiriman", href: "/pengiriman" },
      { label: "Pengembalian", href: "/pengembalian" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Station Parfume",
    links: [
      { label: "Cerita kami", href: "/tentang" },
      { label: "Kontak", href: "/kontak" },
      { label: "Syarat & ketentuan", href: "/syarat-ketentuan" },
      { label: "Kebijakan privasi", href: "/kebijakan-privasi" },
    ],
  },
] as const;

const PAYMENTS = ["QRIS", "Virtual account", "E-wallet"] as const;

// The site footer. Part of the black frame (DESIGN.md), so it stays Deep Ink
// in both modes. The year is left out on purpose: `new Date()` would break
// the prerender with cacheComponents on, and "Sejak 2010" already dates us.
export default function SiteFooter({ className }: { className?: string }) {
  const waHref = whatsappUrl(
    "Halo Station Parfume, saya mau tanya soal parfum.",
  );

  return (
    <footer className={cn("dark bg-ink-2", className)}>
      {/* The gold ruler, flipped so the ticks hang from the top edge. */}
      <div aria-hidden className="takar h-2 rotate-180" />

      <div className="mx-auto max-w-330 px-5 min-[980px]:px-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 border-b border-border pt-16 pb-12 min-[980px]:grid-cols-[1.5fr_repeat(3,1fr)] min-[980px]:gap-10 min-[980px]:pt-22">
          <div className="col-span-2 min-[980px]:col-span-1">
            <Logo variant="badge" tone="dark" className="w-40" />
            <Typography
              variant="body"
              className="mt-5 max-w-75 text-muted-foreground"
            >
              Atelier racik parfum dari Karawang. Setiap botol diracik setelah
              kamu memesan.
            </Typography>
            {waHref && (
              <Button asChild variant="outline" size="lg" className="mt-6">
                <a href={waHref} target="_blank" rel="noopener noreferrer">
                  Chat di WhatsApp
                  <span className="sr-only">(buka di tab baru)</span>
                </a>
              </Button>
            )}
          </div>

          {FOOTER_LINKS.map((column) => (
            <div key={column.title}>
              <Typography as="h2" variant="label" className="mb-4 text-gold">
                {column.title}
              </Typography>
              <ul className="space-y-1 text-sm">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-block py-1 transition-colors hover:text-gold-light"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 border-b border-border py-6">
          <Typography
            as="span"
            variant="caption"
            className="mr-1 text-muted-foreground"
          >
            Pembayaran
          </Typography>
          {PAYMENTS.map((method) => (
            <span
              key={method}
              className="border border-border px-3 py-1.5 text-[11px] tracking-[0.08em] uppercase"
            >
              {method}
            </span>
          ))}
        </div>

        {/* pb-24 on phones leaves room for the floating WhatsApp button. */}
        <Typography
          as="div"
          variant="caption"
          className="flex flex-col gap-2 pt-6 pb-24 text-muted-foreground min-[980px]:flex-row min-[980px]:justify-between min-[980px]:pb-6"
        >
          <p>© Station Parfume · Karawang, Jawa Barat</p>
          <p>Pure Nature · Meracik sejak 2010</p>
        </Typography>
      </div>
    </footer>
  );
}
