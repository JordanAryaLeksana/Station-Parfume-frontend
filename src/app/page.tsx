import { connection } from "next/server";
import { Suspense } from "react";

import { findProduct, listProducts } from "@/features/catalog/server";
import type { ProductDetail } from "@/features/catalog/types";
import HomeAromas from "@/features/home/components/home-aromas";
import HomeFaq from "@/features/home/components/home-faq";
import HomeLanes from "@/features/home/components/home-lanes";
import HomePrices from "@/features/home/components/home-prices";
import HomeStarters from "@/features/home/components/home-starters";
import HomeStory from "@/features/home/components/home-story";
import Journey from "@/features/home/components/journey";
import JourneyLive from "@/features/home/components/journey-live";
import { JourneyStagePlaceholder } from "@/features/home/components/journey-stage";
import WhatsAppBand from "@/features/home/components/whatsapp-band";
import { HERO_SLUGS } from "@/features/home/hero-scents";
import {
  aromaShowcase,
  lanes,
  priceBoard,
  priceExample,
  starterPerfumes,
} from "@/features/home/showcase";
import { whatsappUrl } from "@/lib/whatsapp";

const askHref = whatsappUrl("Halo Station Parfume, saya mau tanya soal wangi.");
const similarHref = whatsappUrl(
  "Halo Station Parfume, saya cari wangi yang mirip dengan: ",
);
const souvenirHref = whatsappUrl(
  "Halo Station Parfume, saya mau tanya souvenir pernikahan atau pesanan jumlah banyak.",
);

export default function HomePage() {
  return (
    <>
      <Journey whatsappHref={askHref}>
        <Suspense fallback={<JourneyStagePlaceholder />}>
          <Steps />
        </Suspense>
      </Journey>
      <Suspense fallback={<HomePrices board={null} loading />}>
        <Prices />
      </Suspense>
      <Suspense
        fallback={<HomeLanes lanes={null} souvenirHref={souvenirHref} />}
      >
        <Lanes />
      </Suspense>
      <Suspense fallback={<HomeStarters products={null} total={null} />}>
        <CatalogSections />
      </Suspense>
      <Suspense
        fallback={
          <HomeFaq
            example={null}
            souvenirFrom={null}
            similarHref={similarHref}
            souvenirHref={souvenirHref}
          />
        }
      >
        <Faq />
      </Suspense>
      <HomeStory />
      {similarHref && <WhatsAppBand href={similarHref} />}
    </>
  );
}

async function loadProducts() {
  await connection();
  try {
    return await listProducts();
  } catch (error) {
    console.error("Beranda: katalog tidak bisa dimuat", error);
    return null;
  }
}

async function loadFeatured(): Promise<ProductDetail[]> {
  await connection();
  const results = await Promise.allSettled(
    HERO_SLUGS.map((slug) => findProduct(slug)),
  );
  const failed = results.filter((result) => result.status === "rejected");
  if (failed.length > 0) {
    console.error("Beranda: wangi unggulan tidak bisa dimuat", failed);
  }
  return results.flatMap((result) =>
    result.status === "fulfilled" && result.value ? [result.value] : [],
  );
}

async function Prices() {
  const [products, featured] = await Promise.all([
    loadProducts(),
    loadFeatured(),
  ]);
  const perfumes = products?.filter((product) => product.kind === "perfume");
  const sizes = featured.at(0)?.size_options;
  const board = perfumes && sizes ? priceBoard(perfumes, sizes) : null;

  return <HomePrices board={board} />;
}

async function Lanes() {
  const products = await loadProducts();
  return (
    <HomeLanes
      lanes={products ? lanes(products) : []}
      souvenirHref={souvenirHref}
    />
  );
}

async function Steps() {
  return (
    <JourneyLive products={await loadFeatured()} similarHref={similarHref} />
  );
}

async function CatalogSections() {
  const products = await loadProducts();
  const perfumes = products?.filter((product) => product.kind === "perfume");
  if (!perfumes) return null;

  return (
    <>
      <HomeStarters
        products={starterPerfumes(perfumes)}
        total={perfumes.length}
      />
      <HomeAromas aromas={aromaShowcase(perfumes)} />
    </>
  );
}

async function Faq() {
  const [products, featured] = await Promise.all([
    loadProducts(),
    loadFeatured(),
  ]);
  const souvenir = products
    ? lanes(products).find((lane) => lane.key === "souvenir")
    : undefined;

  return (
    <HomeFaq
      example={priceExample(featured)}
      souvenirFrom={souvenir?.from ?? null}
      similarHref={similarHref}
      souvenirHref={souvenirHref}
    />
  );
}
