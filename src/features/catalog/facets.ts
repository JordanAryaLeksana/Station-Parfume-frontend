import { isAromaNote, type AromaNote } from "./aroma";
import {
  GRADES,
  isLetter,
  KINDS,
  LETTERS,
  NOTES,
  type CatalogFilters,
  type Letter,
} from "./filters";
import type { Grade, ProductCard, ProductKind } from "./types";

// Applies the /koleksi filters to the product list and counts the choices.
// The backend takes only one value per filter, so the page fetches the list
// once (cached, 66 products, no pages) and does the rest here.
//
// The rule, as in most shops: inside a group any choice may match (Floral
// OR Woody), and every group must match (… AND Exclusive). An empty group
// lets everything through.

// The letter a name is filed under in the A–Z filter: its first LETTER,
// skipping digits, spaces and symbols, so "1000 Bunga" goes under "b".
// Lowercase, like LETTERS; undefined when the name has no letter at all.
export function firstLetter(name: string): Letter | undefined {
  for (const char of name.toLowerCase()) {
    if (isLetter(char)) return char;
  }
  return undefined;
}

type Group = "letters" | "notes" | "grades" | "kinds" | "inStock";
const GROUPS: readonly Group[] = [
  "letters",
  "notes",
  "grades",
  "kinds",
  "inStock",
];

function passes(
  product: ProductCard,
  filters: CatalogFilters,
  group: Group,
): boolean {
  switch (group) {
    case "letters": {
      if (filters.letters.length === 0) return true;
      const letter = firstLetter(product.name);
      return letter !== undefined && filters.letters.includes(letter);
    }
    case "notes":
      // A product has two aroma families; either one counts.
      return (
        filters.notes.length === 0 ||
        filters.notes.some(
          (note) =>
            note === product.note_primary || note === product.note_secondary,
        )
      );
    case "grades":
      return (
        filters.grades.length === 0 ||
        (product.grade !== undefined && filters.grades.includes(product.grade))
      );
    case "kinds":
      return filters.kinds.length === 0 || filters.kinds.includes(product.kind);
    case "inStock":
      return !filters.inStock || product.in_stock;
  }
}

// Every group except `skip` (used for the counts below).
function passesAll(
  product: ProductCard,
  filters: CatalogFilters,
  skip?: Group,
): boolean {
  return GROUPS.every(
    (group) => group === skip || passes(product, filters, group),
  );
}

export function applyFilters(
  products: ProductCard[],
  filters: CatalogFilters,
): ProductCard[] {
  return products.filter((product) => passesAll(product, filters));
}

export type FacetCounts = {
  letters: Record<Letter, number>;
  notes: Record<AromaNote, number>;
  grades: Record<Grade, number>;
  kinds: Record<ProductKind, number>;
  inStock: number;
};

function zeros<T extends string>(keys: readonly T[]): Record<T, number> {
  return Object.fromEntries(keys.map((key) => [key, 0])) as Record<T, number>;
}

// The number next to each checkbox. A choice is counted with every other
// group applied but its own group ignored, so with Floral checked, "Woody
// (18)" still tells how many woody perfumes there are to add. A choice with
// 0 can be disabled: checking it would show nothing new.
export function facetCounts(
  products: ProductCard[],
  filters: CatalogFilters,
): FacetCounts {
  const counts: FacetCounts = {
    letters: zeros(LETTERS),
    notes: zeros(NOTES),
    grades: zeros(GRADES),
    kinds: zeros(KINDS),
    inStock: 0,
  };

  for (const product of products) {
    if (passesAll(product, filters, "letters")) {
      const letter = firstLetter(product.name);
      if (letter) counts.letters[letter] += 1;
    }
    if (passesAll(product, filters, "notes")) {
      // A Set, so a product whose two families are the same counts once.
      for (const note of new Set([
        product.note_primary,
        product.note_secondary,
      ])) {
        if (note && isAromaNote(note)) counts.notes[note] += 1;
      }
    }
    if (passesAll(product, filters, "grades") && product.grade) {
      counts.grades[product.grade] += 1;
    }
    if (passesAll(product, filters, "kinds")) {
      counts.kinds[product.kind] += 1;
    }
    if (passesAll(product, filters, "inStock") && product.in_stock) {
      counts.inStock += 1;
    }
  }

  return counts;
}
