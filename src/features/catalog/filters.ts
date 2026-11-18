import { isAromaNote, type AromaNote } from "./aroma";
import type { Grade, ProductKind } from "./types";

export type CatalogFilters = {
    note?: AromaNote
    grade?: Grade
    kind?: ProductKind
    q?: string
}

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] |undefined ): string | undefined {
    return Array.isArray(value) ? value[0] : value
}

const GRADES = ["regular", "exclusive"] as const satisfies readonly Grade[];
function isGrade(value: string):value is Grade{
    return GRADES.some((grade) => grade === value)
}

const KINDS = ["perfume" , "general"] as const satisfies readonly ProductKind[];
function isProductKind(value: string): value is ProductKind{
    return KINDS.some((kind) => kind === value)
}


const MAX_QUERY_LENGTH = 60;
export function parseCatalogFilters(params: SearchParams): CatalogFilters{
    const note = first(params.note)
    const grade = first(params.grade)
    const kind = first(params.kind)
    const q = first(params.q)?.trim().slice(0, MAX_QUERY_LENGTH)
    return {
        note : note && isAromaNote(note) ? note: undefined,
        grade : grade && isGrade(grade) ? grade : undefined,
        kind : kind && isProductKind(kind) ? kind: undefined,
        q: q || undefined,
    }
}


const FILTER_KEYS = ["note", "grade", "kind", "q"] as const satisfies readonly (keyof CatalogFilters)[]

export function catalogHref(current: CatalogFilters, change: CatalogFilters = {}): string{
    const next = {...current, ...change}
    const params = new URLSearchParams()

    for (const key of FILTER_KEYS) {
        const value = next[key]
        if (value){
            params.set(key, value)
        }
    }
    const query = params.toString()
    return query ? `/koleksi?${query}` : "/koleksi"
}


