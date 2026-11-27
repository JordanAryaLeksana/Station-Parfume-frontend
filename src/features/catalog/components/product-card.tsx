import Image from "next/image";
import Link from "next/link";
import { cn } from "cn";

import Typography from "@/components/shared/typography";
import {
  getAroma,
  isAromaNote,
  type AromaNote,
} from "@/features/catalog/aroma";
import { getProductPhotos } from "@/features/catalog/product-photos";
import type { ProductCard as Product } from "@/features/catalog/types";
import { formatRupiah } from "@/lib/format";

// Photo widths per grid column (product-grid.tsx): 2 columns on phones, 3
// from 980px, 4 from 1180px inside the 1320px container.
const PHOTO_SIZES = "(min-width: 1180px) 300px, (min-width: 980px) 33vw, 50vw";

// Hover lift from DESIGN.md (Elevation & Depth), also used on keyboard focus.
const LIFT =
  "group-hover:-translate-y-1.5 group-hover:shadow-[0_30px_50px_-28px_rgb(0_0_0/0.6)] group-has-[a:focus-visible]:-translate-y-1.5 group-has-[a:focus-visible]:shadow-[0_30px_50px_-28px_rgb(0_0_0/0.6)]";

type ProductCardProps = {
  product: Product;
  // 2 when the cards sit right under the page title (/koleksi), 3 under a
  // section heading (home page).
  headingLevel?: 2 | 3;
  // Load the photo right away: for cards on screen when the page opens.
  eager?: boolean;
};

// One product in a grid. The whole card links to the product page: the link
// is on the name, and its ::after covers the card (a "stretched link"), so a
// screen reader announces the name instead of every text in the card.
export default function ProductCard({
  product,
  headingLevel = 3,
  eager = false,
}: ProductCardProps) {
  const Heading = `h${headingLevel}` as const;
  const photos = getProductPhotos(product.slug);
  const isExclusive = product.grade === "exclusive";
  const scents = product.scents ?? [];

  const aromas = [product.note_primary, product.note_secondary]
    .filter(
      (note): note is AromaNote => note !== undefined && isAromaNote(note),
    )
    .map((note) => getAroma(note).label);
  // Since 20 Nov 2026 each perfume is its own product, so the count only
  // shows if a product is ever given more than one scent again.
  const details = [
    ...aromas,
    scents.length > 1 ? `${scents.length} varian` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    // Keyboard focus outlines the whole card; the 8px offset leaves room for
    // the mat's 6px lift.
    <article className="group relative has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-8 has-[a:focus-visible]:outline-ring">
      {/* The mat, like a framed print: white with a thin line in Gading,
          cream in Noir. It is light in both modes, so the text on it uses
          fixed dark colors. */}
      <div
        className={cn(
          "bg-white p-3 pb-0 ring-1 ring-border dark:bg-cream dark:ring-0",
          "transition-[translate,box-shadow] duration-700 ease-atelier motion-reduce:transition-none",
          LIFT,
        )}
      >
        <div className="relative aspect-square overflow-hidden bg-cream-2">
          {photos ? (
            <>
              <Image
                src={photos.card}
                alt=""
                fill
                sizes={PHOTO_SIZES}
                loading={eager ? "eager" : "lazy"}
                className="object-cover"
              />
              {/* The bottle close-up fades in on hover. It is hidden on
                  screens without hover (phones), so they never download it. */}
              <Image
                src={photos.detail}
                alt=""
                fill
                sizes={PHOTO_SIZES}
                className="hidden object-cover opacity-0 transition-opacity duration-700 ease-atelier group-hover:opacity-100 group-has-[a:focus-visible]:opacity-100 motion-reduce:transition-none [@media(hover:hover)]:block"
              />
            </>
          ) : (
            // No photo yet (general products): the category name on cream,
            // over a measuring-tick ruler.
            <div className="absolute inset-0 flex items-center justify-center px-4 pb-6 text-center">
              <Typography
                variant="subtitle"
                className="font-light text-balance text-ink italic"
              >
                {product.category?.name ?? product.name}
              </Typography>
              <span
                aria-hidden
                className="absolute inset-x-3 bottom-3 takar h-2"
              />
            </div>
          )}
        </div>
        {/* The wider bottom margin, like the edition line under a print:
            "Exclusive" written in italic on the left for that line, the
            atelier number on the right. Screen readers get "Exclusive" from
            the name link instead, so it is hidden here. The gold diamond only
            shows when the row has room for it (a container query): on a
            360px phone the label and the number alone just fit. "Exclusive"
            keeps 13px and regular weight (an exception to the accent role):
            that is what fits next to the number on a phone, and light italic
            this small is hard to read. */}
        <div className="@container flex min-h-8 flex-wrap items-center justify-between gap-x-2">
          {isExclusive && (
            <Typography
              as="span"
              variant="accent"
              aria-hidden
              className="inline-flex items-center gap-1.5 text-[13px] leading-none font-normal text-ink"
            >
              <span className="hidden size-1.25 rotate-45 bg-gold-dark @min-[136px]:block" />
              Exclusive
            </Typography>
          )}
          <Typography
            as="span"
            variant="label"
            className="ml-auto text-gold-dark tabular-nums"
          >
            No. {product.id}
          </Typography>
        </div>
      </div>

      <div className="mt-4">
        {/* wrap-break-word: a long name without spaces would otherwise run
            past the card. */}
        <Typography
          as={Heading}
          variant="title"
          className="text-balance wrap-break-word transition-colors duration-300 group-hover:text-gold-accent-soft group-has-[a:focus-visible]:text-gold-accent-soft"
        >
          <Link
            href={`/produk/${product.slug}`}
            className="outline-none after:absolute after:inset-0"
          >
            {product.name}
            {/* A Regular and an Exclusive perfume can share a name: the link
                tells them apart for screen readers. */}
            {isExclusive && <span className="sr-only">, Exclusive</span>}
          </Link>
        </Typography>

        {details && (
          <Typography
            variant="caption"
            className="mt-1.5 text-muted-foreground"
          >
            {details}
          </Typography>
        )}

        <Typography
          variant="caption"
          className="mt-2 flex flex-wrap items-baseline gap-x-2 tabular-nums"
        >
          {product.price_min !== product.price_max && (
            <span className="text-muted-foreground">Mulai</span>
          )}
          <Typography
            as="span"
            variant="price"
            className={
              product.in_stock ? "text-gold-accent" : "text-muted-foreground"
            }
          >
            {formatRupiah(product.price_min)}
          </Typography>
          {!product.in_stock && (
            <Typography as="span" variant="label" className="text-foreground">
              Stok habis
            </Typography>
          )}
        </Typography>
      </div>
    </article>
  );
}
