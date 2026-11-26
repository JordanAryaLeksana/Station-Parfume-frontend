"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { cn } from "cn";

import Typography from "@/components/shared/typography";
import { Button } from "@/components/ui/button";
import { aromasOf } from "@/features/catalog/aroma";
import { BLEND_ORDER, BLENDS } from "@/features/catalog/blends";
import NotaRacik from "@/features/catalog/components/nota-racik";
import {
  CHOICE,
  OptionHeader,
} from "@/features/catalog/components/purchase-parts";
import { findVariant, priceBreakdown } from "@/features/catalog/pricing";
import { getProductPhotos } from "@/features/catalog/product-photos";
import type { Concentration, ProductDetail } from "@/features/catalog/types";
import GoArrow from "@/features/home/components/go-arrow";
import HeroScentCard from "@/features/home/components/hero-scent-card";
import { HERO_HEIGHT } from "@/features/home/components/journey";
import JourneyStage, {
  JourneyStagePlaceholder,
} from "@/features/home/components/journey-stage";
import { toHeroScent } from "@/features/home/hero-scents";
import { formatRupiah } from "@/lib/format";

const ROUND_BUTTON =
  "grid size-10 place-items-center rounded-full border border-border transition-colors hover:border-gold hover:bg-gold hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const ACCENT = "font-light text-gold-accent-soft";

function Step({
  number,
  title,
  active,
  heading,
  className,
  children,
}: {
  number: number;
  title: string;
  active: boolean;
  heading?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <li
      data-story={number}
      className={cn(
        "relative flex min-h-[64svh] flex-col justify-center py-12 min-[980px]:min-h-[86svh]",
        className,
      )}
    >
      <div className="relative pl-10 min-[980px]:max-w-[min(27rem,34vw)] min-[980px]:pl-12">
        <span
          aria-hidden
          className={cn(
            "absolute top-1 left-1.5 z-10 size-3 rotate-45 border border-gold transition-colors duration-300 motion-reduce:transition-none",
            active ? "bg-gold" : "bg-background",
          )}
        />
        {heading}
        <Typography as="p" variant="label" className="text-gold-accent">
          Stasiun {String(number).padStart(2, "0")}
        </Typography>
        <Typography as="h3" variant="subtitle" className="mt-1">
          {title}
        </Typography>
        <div className="mt-4">{children}</div>
      </div>
    </li>
  );
}

export default function JourneyLive({
  products,
  similarHref,
}: {
  products: ProductDetail[];
  similarHref: string | null;
}) {
  const scents = React.useMemo(() => products.map(toHeroScent), [products]);
  const [index, setIndex] = React.useState(0);
  const [volume, setVolume] = React.useState(30);
  const [concentration, setConcentration] =
    React.useState<Concentration>("campur");
  const [active, setActive] = React.useState<number | null>(null);
  const [heroInView, setHeroInView] = React.useState(true);
  const root = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const hero = root.current
      ?.closest("section")
      ?.querySelector('[data-story="0"]');
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) =>
      setHeroInView(entry?.isIntersecting ?? true),
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const product = products.at(index);
  if (!product) return <JourneyStagePlaceholder photo />;

  const scent = product.scent_options.at(0);
  const size =
    product.size_options.find((option) => option.volume_ml === volume) ??
    product.size_options.at(0);
  const concentrations = BLEND_ORDER.filter((option) =>
    product.concentrations.includes(option),
  );
  const blend = concentrations.includes(concentration)
    ? concentration
    : (concentrations.at(0) ?? "campur");
  const variantFor = (sizeId: number, option: Concentration) =>
    scent
      ? findVariant(product, {
          scentId: scent.id,
          sizeId,
          concentration: option,
        })
      : undefined;
  const variant = size ? variantFor(size.id, blend) : undefined;
  const breakdown = variant ? priceBreakdown(product, variant) : null;
  const photo = getProductPhotos(product.slug)?.card ?? null;
  const aromas = aromasOf(product)
    .map((aroma) => aroma.label)
    .join(" · ");
  const current = scents.at(index) ?? toHeroScent(product);
  const racik = {
    scent: current,
    volume: size?.volume_ml ?? 30,
    blend,
    price: variant?.price ?? null,
  };

  function choose(next: number) {
    setIndex((next + products.length) % products.length);
    setActive(1);
  }

  return (
    <div ref={root}>
      <JourneyStage racik={racik} />

      <div
        className={`relative z-10 min-[980px]:pointer-events-none min-[980px]:absolute min-[980px]:inset-x-0 min-[980px]:top-0 min-[980px]:[&>*]:pointer-events-auto ${HERO_HEIGHT}`}
      >
        <HeroScentCard
          scents={scents}
          index={index}
          onIndexChange={setIndex}
          held={!heroInView || active !== null}
        />
      </div>

      <ol className="relative z-10 mx-auto max-w-330 px-5 before:absolute before:top-0 before:bottom-[50svh] before:left-[2.0625rem] before:w-px before:bg-gold min-[980px]:px-10 min-[980px]:pb-[50svh] min-[980px]:before:left-[3.1875rem]">
        <Step
          number={1}
          title="Pilih wangi"
          active={active === 1}
          heading={
            <div className="mb-10">
              <Typography as="h2" id="stations-title" variant="headline">
                Begini cara pesan di <em className={ACCENT}>stasiun</em> kami.
              </Typography>
              <Typography variant="body" className="mt-4 text-muted-foreground">
                Enam pemberhentian, dari memilih wangi sampai botolmu dikirim.
                Ubah pilihannya, notanya ikut menghitung.
              </Typography>
            </div>
          }
        >
          <div className="flex items-center gap-4">
            <div className="shrink-0 bg-cream p-1">
              <div className="relative size-16 bg-cream-2">
                {photo && (
                  <Image
                    key={product.id}
                    src={photo}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                )}
              </div>
            </div>
            <div aria-live="polite" className="min-w-0 flex-1">
              <Typography
                as="p"
                variant="label"
                className="text-gold-accent tabular-nums"
              >
                No. {product.id}
              </Typography>
              <Typography
                as="p"
                variant="title"
                className="mt-1 wrap-break-word"
              >
                {product.name}
              </Typography>
              {aromas && (
                <Typography
                  as="p"
                  variant="caption"
                  className="text-muted-foreground"
                >
                  {aromas}
                </Typography>
              )}
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => choose(index - 1)}
                aria-label="Wangi sebelumnya"
                className={ROUND_BUTTON}
              >
                <ArrowLeftIcon
                  aria-hidden
                  className="size-4"
                  strokeWidth={1.5}
                />
              </button>
              <button
                type="button"
                onClick={() => choose(index + 1)}
                aria-label="Wangi berikutnya"
                className={ROUND_BUTTON}
              >
                <ArrowRightIcon
                  aria-hidden
                  className="size-4"
                  strokeWidth={1.5}
                />
              </button>
            </div>
          </div>
          <Typography variant="caption" className="mt-3 text-muted-foreground">
            Contoh dari {products.length} wangi unggulan.{" "}
            <Link
              href="/koleksi?kind=perfume"
              className="font-semibold text-foreground underline underline-offset-4 hover:text-gold-accent"
            >
              Lihat semua wangi
            </Link>
          </Typography>
        </Step>

        <Step number={2} title="Takar ukuran" active={active === 2}>
          <fieldset>
            <legend className="sr-only">Ukuran</legend>
            <OptionHeader label="Ukuran" value={size?.label} />
            <div className="mt-3 grid grid-cols-3 gap-2.5">
              {product.size_options.map((option) => {
                const price = variantFor(option.id, blend)?.price;
                return (
                  <label key={option.id} className="cursor-pointer">
                    <input
                      type="radio"
                      name="racik-ukuran"
                      value={option.volume_ml}
                      checked={size?.id === option.id}
                      onChange={() => {
                        setVolume(option.volume_ml);
                        setActive(2);
                      }}
                      className="peer sr-only"
                    />
                    <span
                      className={cn(
                        CHOICE,
                        "flex h-full flex-col items-center gap-1 px-2 py-3 text-center",
                      )}
                    >
                      <Typography
                        as="span"
                        variant="caption"
                        className="font-semibold tabular-nums"
                      >
                        {option.label}
                      </Typography>
                      {price !== undefined && (
                        <Typography
                          as="span"
                          variant="caption"
                          className="tabular-nums opacity-75"
                        >
                          {formatRupiah(price)}
                        </Typography>
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
          <Typography variant="caption" className="mt-3 text-muted-foreground">
            Besar botol di stasiun sebanding dengan isinya.
          </Typography>
        </Step>

        <Step number={3} title="Pilih racikan" active={active === 3}>
          <fieldset>
            <legend className="sr-only">Racikan</legend>
            <OptionHeader label="Racikan" value={BLENDS[blend].name} />
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {concentrations.map((option) => {
                const rate =
                  option === "murni"
                    ? scent?.price_per_ml_murni
                    : scent?.price_per_ml_campur;
                return (
                  <label key={option} className="cursor-pointer">
                    <input
                      type="radio"
                      name="racik-racikan"
                      value={option}
                      checked={blend === option}
                      onChange={() => {
                        setConcentration(option);
                        setActive(3);
                      }}
                      className="peer sr-only"
                    />
                    <span
                      className={cn(CHOICE, "flex h-full flex-col gap-1 p-4")}
                    >
                      <Typography as="span" variant="subtitle">
                        {BLENDS[option].name}{" "}
                        <em className="font-light">{BLENDS[option].alias}</em>
                      </Typography>
                      <Typography
                        as="span"
                        variant="caption"
                        className="opacity-75"
                      >
                        {BLENDS[option].description}
                      </Typography>
                      {rate != null && (
                        <Typography
                          as="span"
                          variant="caption"
                          className="mt-auto pt-2 font-semibold tabular-nums"
                        >
                          {formatRupiah(rate)} / ml
                        </Typography>
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
          <div className="mt-8 max-w-sm">
            <NotaRacik
              number={product.id}
              scentName={product.name}
              concentration={blend}
              breakdown={breakdown}
              total={variant?.price ?? null}
            />
            <Button asChild size="atelier" className="mt-6 w-full">
              <Link href={`/produk/${product.slug}`}>
                Lihat {product.name}
                <GoArrow />
              </Link>
            </Button>
            <Typography
              variant="caption"
              className="mt-3 text-muted-foreground"
            >
              Ukuran dan racikan dipilih lagi di halaman wanginya, lalu masuk ke
              tas.
            </Typography>
          </div>
        </Step>

        <Step number={4} title="Bayar" active={false}>
          <Typography variant="body" className="text-muted-foreground">
            Bayar lewat QRIS, virtual account, atau e-wallet (DOKU), paling
            lambat 24 jam setelah pesanan dibuat. Begitu pembayaran masuk,
            notamu lunas.
          </Typography>
        </Step>

        <Step number={5} title="Kami racik & kemas" active={false}>
          <Typography variant="body" className="text-muted-foreground">
            Botolmu baru diracik setelah pembayaran diterima, ditutup, lalu
            dikemas dalam kotak bersegel.
          </Typography>
        </Step>

        <Step
          number={6}
          title="Dikirim"
          active={false}
          className="min-[980px]:min-h-[120svh] min-[980px]:justify-start min-[980px]:pt-[18svh]"
        >
          <Typography as="p" variant="statement" className="max-w-[24ch]">
            Dikemas, lalu dikirim dari <em className={ACCENT}>Karawang</em> ke
            seluruh Indonesia.
          </Typography>
          {similarHref && (
            <Typography variant="body" className="mt-6 text-muted-foreground">
              Cari yang mirip parfum favoritmu?{" "}
              <a
                href={similarHref}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold whitespace-nowrap text-foreground underline decoration-gold-accent underline-offset-4 hover:text-gold-accent"
              >
                Tanya di WhatsApp →<span className="sr-only"> (tab baru)</span>
              </a>
            </Typography>
          )}
        </Step>
      </ol>
    </div>
  );
}
