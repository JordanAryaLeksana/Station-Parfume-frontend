import Image from "next/image";
import Link from "next/link";
import { cn } from "cn";

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
              <p className="font-primary text-lg leading-snug font-light text-balance text-ink italic min-[980px]:text-2xl">
                {product.category?.name ?? product.name}
              </p>
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
            360px phone the label and the number alone just fit. */}
        <div className="@container flex min-h-8 flex-wrap items-center justify-between gap-x-2">
          {isExclusive && (
            <span
              aria-hidden
              className="inline-flex items-center gap-1.5 font-primary text-[13px] leading-none text-ink italic"
            >
              <span className="hidden size-1.25 rotate-45 bg-gold-dark @min-[136px]:block" />
              Exclusive
            </span>
          )}
          <span className="ml-auto text-[10.5px] font-semibold tracking-[0.2em] text-gold-dark tabular-nums">
            No. {product.id}
          </span>
        </div>
      </div>

      <div className="mt-4">
        {/* wrap-break-word: names like "BACARAT/ALTAJH/Parfum" have no
            spaces and would otherwise run past the card. */}
        <Heading className="font-primary text-[1.1875rem] leading-[1.15] text-balance wrap-break-word transition-colors duration-300 group-hover:text-gold-accent-soft group-has-[a:focus-visible]:text-gold-accent-soft min-[980px]:text-[1.6875rem] min-[980px]:leading-[1.1]">
          <Link
            href={`/produk/${product.slug}`}
            className="outline-none after:absolute after:inset-0"
          >
            {product.name}
            {/* Bacarat and Bacarat Exclusive share a name: the link tells
                them apart for screen readers. */}
            {isExclusive && <span className="sr-only">, Exclusive</span>}
          </Link>
        </Heading>

        {details && (
          <p className="mt-1.5 text-[13px] leading-snug text-muted-foreground">
            {details}
          </p>
        )}

        <p className="mt-2 flex flex-wrap items-baseline gap-x-2 text-[13px] tabular-nums">
          {product.price_min !== product.price_max && (
            <span className="text-muted-foreground">Mulai</span>
          )}
          <span
            className={cn(
              "text-[15px] font-semibold",
              product.in_stock ? "text-gold-accent" : "text-muted-foreground",
            )}
          >
            {formatRupiah(product.price_min)}
          </span>
          {!product.in_stock && (
            <span className="text-[10.5px] font-semibold tracking-[0.18em] text-foreground uppercase">
              Stok habis
            </span>
          )}
        </p>
      </div>
    </article>
  );
}
