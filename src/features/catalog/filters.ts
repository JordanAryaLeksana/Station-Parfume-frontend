import { AROMAS, type AromaNote } from "./aroma";
import type { Grade, ProductKind } from "./types";

export const LETTERS = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
] as const;
export type Letter = (typeof LETTERS)[number];

export function isLetter(value: string): value is Letter {
  return LETTERS.some((letter) => letter === value);
}

export const NOTES: readonly AromaNote[] = AROMAS.map((aroma) => aroma.note);
export const GRADES = [
  "regular",
  "exclusive",
] as const satisfies readonly Grade[];
export const KINDS = [
  "perfume",
  "general",
] as const satisfies readonly ProductKind[];

// What the buyer reads for each choice, in the sidebar and in the chips.
export const GRADE_LABELS: Record<Grade, string> = {
  regular: "Regular",
  exclusive: "Exclusive",
};
export const KIND_LABELS: Record<ProductKind, string> = {
  perfume: "Parfum",
  general: "Mobil & souvenir",
};

export type CatalogFilters = {
  letters: Letter[];
  notes: AromaNote[];
  grades: Grade[];
  kinds: ProductKind[];
  inStock: boolean; // "Hanya yang tersedia"
  q?: string;
};

// Nothing chosen. Spread it to start over: { ...NO_FILTERS, q } keeps only
// the search.
export const NO_FILTERS: CatalogFilters = {
  letters: [],
  notes: [],
  grades: [],
  kinds: [],
  inStock: false,
};

// How many filter choices are on, not counting the search: the number on
// the phone's "Filter" button, and whether "Hapus semua filter" makes sense.
export function activeFilterCount(filters: CatalogFilters): number {
  return (
    filters.letters.length +
    filters.notes.length +
    filters.grades.length +
    filters.kinds.length +
    (filters.inStock ? 1 : 0)
  );
}

type SearchParams = Record<string, string | string[] | undefined>;

// ?note=a arrives as a string, ?note=a&note=b as an array.
function all(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function first(value: string | string[] | undefined): string | undefined {
  return all(value)[0];
}

function pick<T extends string>(
  value: string | string[] | undefined,
  allowed: readonly T[],
): T[] {
  const given = new Set(all(value));
  return allowed.filter((option) => given.has(option));
}

const MAX_QUERY_LENGTH = 60;

export function parseCatalogFilters(params: SearchParams): CatalogFilters {
  const q = first(params.q)?.trim().slice(0, MAX_QUERY_LENGTH);

  return {
    letters: pick(params.letter, LETTERS),
    notes: pick(params.note, NOTES),
    grades: pick(params.grade, GRADES),
    kinds: pick(params.kind, KINDS),
    inStock: first(params.stock) === "1",
    q: q || undefined,
  };
}

// The /koleksi URL for a set of filters, always in the same order.
export function catalogHref(filters: CatalogFilters): string {
  const params = new URLSearchParams();

  for (const letter of filters.letters) params.append("letter", letter);
  for (const note of filters.notes) params.append("note", note);
  for (const grade of filters.grades) params.append("grade", grade);
  for (const kind of filters.kinds) params.append("kind", kind);
  if (filters.inStock) params.set("stock", "1");
  if (filters.q) params.set("q", filters.q);

  const query = params.toString();
  return query ? `/koleksi?${query}` : "/koleksi";
}
