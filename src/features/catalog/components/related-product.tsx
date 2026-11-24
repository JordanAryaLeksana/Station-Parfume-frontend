import Typography from "@/components/shared/typography";
import { aromasOf } from "@/features/catalog/aroma";
import ProductGrid from "@/features/catalog/components/product-grid";
import { listProducts } from "@/features/catalog/server";
import type { ProductDetail } from "@/features/catalog/types";

export default async function RelatedProduct({
  product,
}: {
  product: ProductDetail;
}) {
  const mainAroma = aromasOf(product).at(0);
  if (!mainAroma) return null;

  const candidates = await listProducts({ note: mainAroma.note });
  const others = candidates.filter((item) => item.id !== product.id);
  const related = others.slice(0, 4);
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
        Wangi lain dengan aroma {mainAroma.label} ({mainAroma.indonesian}).
      </Typography>
      <div className="mt-10">
        <ProductGrid products={related} headingLevel={3} />
      </div>
    </section>
  );
}
