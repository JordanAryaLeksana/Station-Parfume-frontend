import type { Concentration, ProductDetail, Variant } from "./types";

export type Selection = {
  scentId: number;
  sizeId: number;
  concentration: Concentration;
};

export type PriceBreakdown = {
  ratePerMl: number; // rupiah per ml of the chosen scent, murni or campur
  volumeMl: number;
  liquidPrice: number; // ratePerMl × volumeMl
  bottlePrice: number; // the empty bottle of the chosen size
};


const DEFAULT_VOLUME_ML = 30;
const DEFAULT_CONCENTRATION: Concentration = "campur";


export function findVariant(
  product: ProductDetail,
  selection: Selection,
): Variant | undefined {
  return product.variants.find(
    (variant) =>
      variant.scent_id === selection.scentId &&
      variant.size_id === selection.sizeId &&
      variant.concentration === selection.concentration,
  );
}

export function priceBreakdown(
  product: ProductDetail,
  variant: Variant,
): PriceBreakdown | null {
  const scent = product.scent_options.find(
    (option) => option.id === variant.scent_id,
  );
  const size = product.size_options.find(
    (option) => option.id === variant.size_id,
  );

  if (!scent || !size || !variant.concentration) return null;

  const ratePerMl =
    variant.concentration === "murni"
      ? scent.price_per_ml_murni
      : scent.price_per_ml_campur;

  if (ratePerMl === null) return null;

  const liquidPrice = ratePerMl * size.volume_ml;

  if (liquidPrice + size.bottle_price !== variant.price) return null;

  return {
    ratePerMl,
    volumeMl: size.volume_ml,
    liquidPrice,
    bottlePrice: size.bottle_price,
  };
}

// The blend a variant stands for, or null for a general product's variant.
function selectionOf(variant: Variant): Selection | null {
  if (
    variant.scent_id === undefined ||
    variant.size_id === undefined ||
    variant.concentration === undefined
  ) {
    return null;
  }

  return {
    scentId: variant.scent_id,
    sizeId: variant.size_id,
    concentration: variant.concentration,
  };
}

export function defaultSelection(product: ProductDetail): Selection | null {
  // .at(0) is typed `| undefined`, unlike [0], because the list can be empty.
  const scent = product.scent_options.at(0);
  const size =
    product.size_options.find(
      (option) => option.volume_ml === DEFAULT_VOLUME_ML,
    ) ?? product.size_options.at(0);
  const concentration = product.concentrations.includes(DEFAULT_CONCENTRATION)
    ? DEFAULT_CONCENTRATION
    : product.concentrations.at(0);

  if (!scent || !size || !concentration) return null;

  const preferred: Selection = {
    scentId: scent.id,
    sizeId: size.id,
    concentration,
  };

  if (findVariant(product, preferred)?.in_stock) return preferred;

  for (const variant of product.variants) {
    const selection = selectionOf(variant);

    if (variant.in_stock && selection) return selection;
  }

  // Nothing can be bought: open on the preferred blend, shown as out of stock.
  return preferred;
}
