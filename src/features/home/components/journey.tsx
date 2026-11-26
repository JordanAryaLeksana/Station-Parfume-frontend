import type * as React from "react";
import Link from "next/link";

import Typography from "@/components/shared/typography";
import { Button } from "@/components/ui/button";
import GoArrow from "@/features/home/components/go-arrow";

export const HERO_HEIGHT =
  "min-[980px]:h-[clamp(40rem,calc(100svh-7.625rem),56rem)]";

export default function Journey({
  whatsappHref,
  children,
}: {
  whatsappHref: string | null;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate bg-background"
    >
      <div
        data-story="0"
        className={`relative z-10 mx-auto w-full max-w-330 px-5 pt-[calc(42svh+2rem)] pb-8 min-[980px]:flex min-[980px]:items-center min-[980px]:px-10 min-[980px]:py-0 ${HERO_HEIGHT}`}
      >
        <div className="max-w-xl min-[980px]:max-w-[min(36rem,44vw)]">
          <Typography as="h1" id="hero-title" variant="display">
            Parfum racik{" "}
            <em className="font-light whitespace-nowrap text-gold-accent-soft">
              per ml
            </em>
            .
          </Typography>
          <Typography
            variant="body"
            className="mt-6 max-w-lg text-muted-foreground min-[980px]:mt-8"
          >
            Station Parfume adalah stasiun racik dari Karawang. Pilih wangimu,
            takar 20, 30, atau 50 ml, lalu pilih murni atau campur. Botolmu
            diracik setelah pembayaran diterima, lalu dikirim ke seluruh
            Indonesia.
          </Typography>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="atelier">
              <Link href="/koleksi?kind=perfume">
                Lihat semua wangi
                <GoArrow />
              </Link>
            </Button>
            {whatsappHref && (
              <Button asChild size="atelier" variant="line">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Tanya di WhatsApp
                  <span className="sr-only">(tab baru)</span>
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
      {children}
    </section>
  );
}
