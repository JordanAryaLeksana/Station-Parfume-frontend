import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Typography from "@/components/shared/typography";
import { aromasOf } from "@/features/catalog/aroma";
import ProductGallery from "@/features/catalog/components/product-gallery";
import ProductInfo from "@/features/catalog/components/product-info";
import ProductPurchase from "@/features/catalog/components/product-purchase";
import { KIND_LABELS } from "@/features/catalog/filters";
import { galleryPhotos } from "@/features/catalog/gallery";
import { defaultSelection } from "@/features/catalog/pricing";
import { findProduct } from "@/features/catalog/server";
import type { ProductDetail } from "@/features/catalog/types";
import { formatRupiah } from "@/lib/format";
import RelatedProduct from "@/features/catalog/components/related-product";

const CRUMB_LINK =
  "underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

async function loadProduct(
  params: PageProps<"/produk/[slug]">["params"],
): Promise<ProductDetail> {
  const { slug } = await params;
  const product = await findProduct(slug);
  if (!product || product.slug !== slug) notFound();
  return product;
}

// Bacarat and Bacarat Exclusive share a name; the tab title tells them apart.
function fullName(product: ProductDetail): string {
  return product.grade === "exclusive"
    ? `${product.name} Exclusive`
    : product.name;
}

// [20, 30, 50] → "20, 30, atau 50"
function orList(items: readonly (string | number)[]): string {
  if (items.length <= 2) return items.join(" atau ");
  return `${items.slice(0, -1).join(", ")}, atau ${items.at(-1)}`;
}

export async function generateMetadata({
  params,
}: PageProps<"/produk/[slug]">): Promise<Metadata> {
  const product = await loadProduct(params);
  const price = `${product.price_min !== product.price_max ? "mulai " : ""}${formatRupiah(product.price_min)}`;

  if (product.kind === "general") {
    return { title: product.name, description: `${product.name}, ${price}.` };
  }

  const aromas = aromasOf(product).map((aroma) => aroma.label);
  const sizes = product.size_options.map((size) => size.volume_ml);

  return {
    title: fullName(product),
    description: [
      `${fullName(product)}: `,
      aromas.length > 0 ? `wangi ${aromas.join(" dan ")}, ` : "",
      "diracik per ml setelah kamu memesan. ",
      sizes.length > 0 ? `Ukuran ${orList(sizes)} ml, ` : "",
      `${price}.`,
    ].join(""),
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/produk/[slug]">) {
  const product = await loadProduct(params);
  const aromas = aromasOf(product);
  const mainAroma = aromas.at(0);
  const isExclusive = product.grade === "exclusive";
  // What the buy panel opens on (30 ml campur). General products have no
  // size or blend, so null: they keep the plain price until step C7.
  const selection =
    product.kind === "perfume" ? defaultSelection(product) : null;

  return (
    <div className="mx-auto w-full max-w-330 px-5 pt-8 pb-24 min-[980px]:px-10 min-[980px]:pt-12 min-[980px]:pb-32">
      <nav aria-label="Breadcrumb">
        <Typography
          as="ol"
          variant="caption"
          className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-muted-foreground"
        >
          <li>
            <Link href="/koleksi" className={CRUMB_LINK}>
              Koleksi
            </Link>
          </li>
          {/* The aroma family for a perfume, the kind for the rest. */}
          <li className="flex items-center gap-x-2.5">
            <span aria-hidden>/</span>
            {mainAroma ? (
              <Link
                href={`/koleksi?note=${mainAroma.note}`}
                className={CRUMB_LINK}
              >
                {mainAroma.label}
              </Link>
            ) : (
              <Link href="/koleksi?kind=general" className={CRUMB_LINK}>
                {KIND_LABELS.general}
              </Link>
            )}
          </li>
          <li className="flex min-w-0 items-center gap-x-2.5">
            <span aria-hidden>/</span>
            <span aria-current="page" className="truncate text-foreground">
              {product.name}
            </span>
          </li>
        </Typography>
      </nav>

      <div className="mt-8 min-[980px]:mt-10 min-[980px]:grid min-[980px]:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] min-[980px]:items-start min-[980px]:gap-12 min-[1180px]:gap-16">
        <div className="min-[980px]:top-28 min-[980px]:[@media(min-height:48rem)]:sticky">
          <ProductGallery
            photos={galleryPhotos(product)}
            fallback={product.category?.name ?? product.name}
          />
        </div>

        <div className="mt-10 min-[980px]:mt-0">
          <Typography
            as="h1"
            variant="headline"
            className="text-balance wrap-break-word"
          >
            {product.name}
          </Typography>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            {/* "Exclusive" stands alone next to the labels here, so it keeps
                15px and regular weight (an exception to the accent role). */}
            {isExclusive && (
              <Typography
                as="span"
                variant="accent"
                className="inline-flex items-center gap-2 text-[15px] font-normal"
              >
                <span
                  aria-hidden
                  className="size-1.5 rotate-45 bg-gold-accent"
                />
                Exclusive
              </Typography>
            )}
            <Typography
              as="span"
              variant="label"
              className="text-gold-accent tabular-nums"
            >
              No. {product.id}
            </Typography>
            {aromas.length > 0 && (
              <Typography
                as="span"
                variant="label"
                className="text-muted-foreground"
              >
                {aromas.map((aroma) => aroma.label).join(" · ")}
              </Typography>
            )}
          </div>

          {selection ? (
            <ProductPurchase product={product} initialSelection={selection} />
          ) : (
            <p className="mt-8 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
              {product.price_min !== product.price_max && (
                <Typography
                  as="span"
                  variant="body"
                  className="text-muted-foreground"
                >
                  Mulai
                </Typography>
              )}
              <Typography
                as="span"
                variant="price-lg"
                className="text-gold-accent"
              >
                {formatRupiah(product.price_min)}
              </Typography>
              {!product.in_stock && (
                <Typography as="span" variant="label">
                  Stok habis
                </Typography>
              )}
            </p>
          )}

          <ProductInfo product={product} />
        </div>
      </div>
      <RelatedProduct product={product} />
    </div>
  );
}
