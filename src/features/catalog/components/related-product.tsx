import Typography from "@/components/shared/typography";
import { aromasOf } from "@/features/catalog/aroma";
import ProductGrid from "@/features/catalog/components/product-grid";
import { listProducts } from "@/features/catalog/server";
import type { ProductCard, ProductDetail } from "@/features/catalog/types";

const MAX_RELATED = 4;

type Aroma = ReturnType<typeof aromasOf>[number];

// Perfumes that share the main aroma. Amber, Balsamic and Creamy have only
// 2–3 perfumes, so when there are fewer than four the second aroma tops the
// list up. Never the product itself, never the same product twice.
async function relatedPerfumes(product: ProductDetail, aromas: Aroma[]) {
  const picked: ProductCard[] = [];
  const used: Aroma[] = [];

  for (const aroma of aromas) {
    if (picked.length >= MAX_RELATED) break;
    const candidates = await listProducts({ note: aroma.note });
    const others = candidates.filter(
      (item) =>
        item.id !== product.id && !picked.some((done) => done.id === item.id),
    );
    if (others.length > 0) used.push(aroma);
    picked.push(...others);
  }

  return { products: picked.slice(0, MAX_RELATED), aromas: used };
}

// General products have no aroma: show other general products.
async function relatedGeneral(product: ProductDetail) {
  const candidates = await listProducts({ kind: "general" });
  return candidates
    .filter((item) => item.id !== product.id)
    .slice(0, MAX_RELATED);
}

// "Kamu mungkin juga suka": four products like this one, under the page.
export default async function RelatedProduct({
  product,
}: {
  product: ProductDetail;
}) {
  const aromas = aromasOf(product);

  let related: ProductCard[];
  let description: string;
  if (aromas.length > 0) {
    const perfumes = await relatedPerfumes(product, aromas);
    related = perfumes.products;
    description = `Wangi lain dengan aroma ${perfumes.aromas
      .map((aroma) => `${aroma.label} (${aroma.indonesian})`)
      .join(" dan ")}.`;
  } else {
    related = await relatedGeneral(product);
    description = "Pilihan lain untuk mobil dan souvenir.";
  }

  if (related.length === 0) return null;

  return (
    <section
      aria-labelledby="related-title"
      className="mt-20 border-t border-border pt-14 min-[980px]:mt-28 min-[980px]:pt-20"
    >
      <Typography as="h2" id="related-title" variant="headline">
        Kamu mungkin juga{" "}
        <em className="font-light text-gold-accent-soft">suka</em>.
      </Typography>
      <Typography variant="body" className="mt-4 text-muted-foreground">
        {description}
      </Typography>
      <div className="mt-10">
        <ProductGrid products={related} headingLevel={3} />
      </div>
    </section>
  );
}
