import Image from "next/image";
import Link from "next/link";
import { cn } from "cn";

import Typography from "@/components/shared/typography";
import type { Lane } from "@/features/home/showcase";
import { formatRupiah } from "@/lib/format";

export default function HomeLanes({
  lanes,
  souvenirHref,
}: {
  lanes: Lane[] | null;
  souvenirHref: string | null;
}) {
  return (
    <section
      aria-labelledby="lanes-title"
      className="py-21.5 min-[980px]:py-28"
    >
      <div className="mx-auto max-w-330 px-5 min-[980px]:px-10">
        <div className="mb-10 flex flex-col gap-4 min-[980px]:mb-12 min-[980px]:flex-row min-[980px]:items-end min-[980px]:justify-between min-[980px]:gap-10">
          <Typography as="h2" id="lanes-title" variant="headline">
            Pilih <em className="font-light text-gold-accent-soft">jalurmu</em>.
          </Typography>
          <Typography variant="body" className="max-w-95 text-muted-foreground">
            Parfum diracik per ml, atau produk siap kirim untuk mobil, ruangan,
            dan acara.
          </Typography>
        </div>

        {lanes ? (
          <ul
            role="list"
            className="grid grid-cols-2 gap-3 min-[980px]:grid-cols-4 min-[980px]:gap-5"
          >
            {lanes.map((lane, index) => (
              <LaneTile
                key={lane.key}
                lane={lane}
                number={index + 1}
                extraHref={lane.key === "souvenir" ? souvenirHref : null}
              />
            ))}
          </ul>
        ) : (
          <div
            role="status"
            className="grid grid-cols-2 gap-3 min-[980px]:grid-cols-4 min-[980px]:gap-5"
          >
            <span className="sr-only">Memuat jalur…</span>
            {[0, 1, 2, 3, 4, 5].map((tile) => (
              <div
                key={tile}
                aria-hidden
                className={cn(
                  "h-64 bg-muted motion-safe:animate-pulse",
                  (tile === 0 || tile === 3) && "col-span-2",
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function LaneTile({
  lane,
  number,
  extraHref,
}: {
  lane: Lane;
  number: number;
  extraHref: string | null;
}) {
  const price = `${lane.unit === null ? "mulai " : ""}${formatRupiah(lane.from)}${lane.unit ?? ""}`;

  return (
    <li
      className={cn(
        "group relative flex flex-col border border-border bg-card transition-colors hover:border-gold-accent has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-ring",
        lane.wide && "col-span-2",
      )}
    >
      <div className="flex items-center justify-between px-4 pt-3 pb-2.5">
        <Typography as="span" variant="label" className="text-gold-accent">
          Jalur {String(number).padStart(2, "0")}
        </Typography>
        <span
          aria-hidden
          className="text-gold-accent transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
        >
          →
        </span>
      </div>

      <div
        className={cn(
          "relative overflow-hidden bg-cream-2",
          !lane.photo && "h-28 min-[980px]:h-32",
          lane.photo && (lane.wide ? "aspect-2/1" : "aspect-square"),
        )}
      >
        {lane.photo ? (
          <Image
            src={lane.photo}
            alt=""
            fill
            sizes={
              lane.wide
                ? "(min-width: 980px) 600px, 100vw"
                : "(min-width: 980px) 300px, 50vw"
            }
            className="object-cover transition-transform duration-700 ease-atelier group-hover:scale-[1.03] motion-reduce:transition-none"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1 px-4 text-center text-ink">
            {lane.unit === null && (
              <Typography as="span" variant="label" className="text-gold-dark">
                Mulai
              </Typography>
            )}
            <Typography as="span" variant="price-lg">
              {formatRupiah(lane.from)}
              {lane.unit && (
                <Typography as="span" variant="caption" className="ml-1">
                  {lane.unit}
                </Typography>
              )}
            </Typography>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-4 pt-4 pb-5">
        <Typography as="h3" variant="title">
          <Link
            href={lane.href}
            className="outline-none after:absolute after:inset-0 after:content-['']"
          >
            {lane.title}
          </Link>
        </Typography>
        <Typography variant="caption" className="mt-1 text-muted-foreground">
          {lane.detail}
        </Typography>
        {lane.photo && (
          <Typography
            as="p"
            variant="price"
            className="mt-auto pt-3 text-gold-accent"
          >
            {price}
          </Typography>
        )}
        {extraHref && (
          <a
            href={extraHref}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 mt-3 self-start border-b border-gold-accent pb-0.5 text-[13px] font-semibold transition-colors hover:text-gold-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Pesan jumlah banyak? Tanya di WhatsApp →
            <span className="sr-only"> (tab baru)</span>
          </a>
        )}
      </div>
    </li>
  );
}
