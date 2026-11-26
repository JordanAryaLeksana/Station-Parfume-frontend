import Image from "next/image";

import Typography from "@/components/shared/typography";
import { AROMAS } from "@/features/catalog/aroma";
import { ATELIER_PHOTO } from "@/features/catalog/aroma-photos";
import { HOME_PHOTOS } from "@/features/home/photos";

const FACTS = [
  { value: "2010", label: "mulai meracik" },
  { value: String(AROMAS.length), label: "keluarga aroma" },
  { value: "3", label: "ukuran: 20, 30, 50 ml" },
  { value: "2", label: "racikan: murni dan campur" },
] as const;

export default function HomeStory() {
  const photo = HOME_PHOTOS.mejaRacik ?? ATELIER_PHOTO.src;

  return (
    <section
      aria-labelledby="story-title"
      className="bg-muted py-21.5 min-[980px]:py-28"
    >
      <div className="mx-auto grid max-w-330 items-center gap-12 px-5 min-[980px]:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] min-[980px]:gap-20 min-[980px]:px-10">
        <figure className="mx-auto w-full max-w-md min-[980px]:mx-0">
          <div className="bg-white p-3 pb-8 ring-1 ring-border dark:bg-cream dark:ring-0">
            <Image
              src={photo}
              alt="Botol-botol Station Parfume di atas nampan kayu, dengan bunga kamboja, kayu manis, bunga lawang, dan blueberry"
              sizes="(min-width: 980px) 448px, 100vw"
              placeholder="blur"
              className="aspect-4/5 w-full object-cover"
            />
          </div>
          <Typography
            as="figcaption"
            variant="caption"
            className="mt-3 text-muted-foreground"
          >
            Meja racik Station Parfume, Karawang.
          </Typography>
        </figure>

        <div>
          <Typography as="h2" id="story-title" variant="headline">
            Meracik sejak{" "}
            <em className="font-light text-gold-accent-soft">2010</em>.
          </Typography>
          <Typography variant="body" className="mt-5 text-muted-foreground">
            Dari Karawang, kami meracik setiap botol setelah pesananmu masuk:
            bibitnya ditakar per ml, diracik murni atau campur sesuai pilihanmu,
            lalu dikemas dan dikirim ke seluruh Indonesia.
          </Typography>

          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-border pt-8">
            {FACTS.map((fact) => (
              <div key={fact.label} className="flex flex-col">
                <Typography
                  as="dt"
                  variant="caption"
                  className="text-muted-foreground"
                >
                  {fact.label}
                </Typography>
                <Typography
                  as="dd"
                  variant="headline"
                  className="order-first mt-1 text-gold-accent tabular-nums"
                >
                  {fact.value}
                </Typography>
              </div>
            ))}
          </dl>

          <Typography
            variant="title"
            className="mt-10 font-light text-gold-accent-soft italic"
          >
            — Peracik Station Parfume
          </Typography>
        </div>
      </div>
    </section>
  );
}
