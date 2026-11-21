"use client";

import React from "react";
import Form from "next/form";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { catalogHref, type CatalogFilters } from "@/features/catalog/filters";

// How long the typing must pause before the search runs (step 4).
const SEARCH_DELAY_MS = 300;

export default function CatalogSearch({
  filters,
}: {
  filters: CatalogFilters;
}) {
  const router = useRouter();
  const fromUrl = filters.q ?? "";
  const [query, setQuery] = React.useState(fromUrl);
  const [lastFromUrl, setLastFromUrl] = React.useState(fromUrl);
  const [sent, setSent] = React.useState<string | null>(null);
  if (fromUrl !== lastFromUrl) {
    setLastFromUrl(fromUrl);
    if (fromUrl !== sent) setQuery(fromUrl);
  }

  React.useEffect(() => {
    const text = query.trim();
    if (text === fromUrl) return;

    const timer = setTimeout(() => {
      setSent(text);
      router.replace(catalogHref({ ...filters, q: text || undefined }), {
        scroll: false,
      });
    }, SEARCH_DELAY_MS);

    return () => clearTimeout(timer);
  }, [query, fromUrl, filters, router]);

  return (
    <Form
      action="/koleksi"
      scroll={false}
      role="search"
      className="flex w-full items-stretch gap-2 min-[980px]:max-w-md"
    >
      <div className="relative flex-1">
        <label htmlFor="koleksi-q" className="sr-only">
          Cari wangi
        </label>
        <SearchIcon
          aria-hidden
          strokeWidth={1.5}
          className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          id="koleksi-q"
          type="search"

          name={query.trim() ? "q" : undefined}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          maxLength={60}
          placeholder="Cari nama wangi"
          className="h-12 bg-card pl-10 text-[15px] md:text-[15px]"
        />
      </div>

      {filters.letters.map((letter) => (
        <input key={letter} type="hidden" name="letter" value={letter} />
      ))}
      {filters.notes.map((note) => (
        <input key={note} type="hidden" name="note" value={note} />
      ))}
      {filters.grades.map((grade) => (
        <input key={grade} type="hidden" name="grade" value={grade} />
      ))}
      {filters.kinds.map((kind) => (
        <input key={kind} type="hidden" name="kind" value={kind} />
      ))}
      {filters.inStock && <input type="hidden" name="stock" value="1" />}

      <Button
        type="submit"
        size="lg"
        className="h-12 px-6 text-[11px] font-semibold tracking-[0.18em] uppercase"
      >
        Cari
      </Button>
    </Form>
  );
}
