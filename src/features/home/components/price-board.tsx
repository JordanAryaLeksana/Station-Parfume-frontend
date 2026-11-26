import Link from "next/link";

import Typography from "@/components/shared/typography";
import { BLENDS } from "@/features/catalog/blends";
import { GRADE_LABELS } from "@/features/catalog/filters";
import type { PriceBoard as Board, RateRange } from "@/features/home/showcase";
import { formatRupiah } from "@/lib/format";

const LEADER =
  "flex min-w-[9rem] flex-1 items-baseline gap-2 after:flex-1 after:-translate-y-1 after:border-b after:border-dotted after:border-foreground/25 after:content-['']";

function rate({ min, max }: RateRange) {
  return min === max
    ? formatRupiah(min)
    : `${formatRupiah(min)} – ${formatRupiah(max)}`;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-end gap-x-2">
      <Typography as="dt" variant="caption" className={LEADER}>
        {label}
      </Typography>
      <Typography as="dd" variant="price" className="text-gold-accent-soft">
        {value}
      </Typography>
    </div>
  );
}

export default function PriceBoard({
  board,
  loading = false,
}: {
  board: Board | null;
  loading?: boolean;
}) {
  const sizes = board?.examples.at(0)?.prices.map((price) => price.ml) ?? [];

  return (
    <section
      aria-labelledby="price-board-title"
      className="dark border border-gold bg-card"
    >
      <div className="flex items-baseline justify-between gap-4 bg-gold px-5 py-2.5 text-ink">
        <Typography as="h3" id="price-board-title" variant="label">
          Papan harga
        </Typography>
        <Typography as="span" variant="label">
          Tarif per ml
        </Typography>
      </div>

      {board ? (
        <>
          <div className="grid gap-5 px-5 py-5">
            {board.grades.map((grade) => (
              <div key={grade.grade}>
                <Typography
                  as="h4"
                  variant="label"
                  className="text-gold-accent"
                >
                  {GRADE_LABELS[grade.grade]} · {grade.count} wangi
                </Typography>
                <dl className="mt-2.5 grid gap-2">
                  <Row
                    label={`${BLENDS.campur.name} (${BLENDS.campur.alias})`}
                    value={rate(grade.campur)}
                  />
                  <Row
                    label={`${BLENDS.murni.name} (${BLENDS.murni.alias})`}
                    value={rate(grade.murni)}
                  />
                </dl>
              </div>
            ))}
            <div>
              <Typography as="h4" variant="label" className="text-gold-accent">
                Botol
              </Typography>
              <dl className="mt-2.5">
                <Row
                  label={`${sizes.join(" · ")} ml`}
                  value={rate(board.bottle)}
                />
              </dl>
            </div>
          </div>

          <table className="w-full border-t border-border">
            <caption className="px-5 pt-4 text-left">
              <Typography
                as="span"
                variant="label"
                className="text-gold-accent"
              >
                Harga botol termurah
              </Typography>
            </caption>
            <thead>
              <tr>
                <Typography
                  as="th"
                  scope="col"
                  variant="caption"
                  className="px-5 pt-2.5 text-left font-normal text-muted-foreground"
                >
                  Ukuran
                </Typography>
                {board.examples.map((example) => (
                  <Typography
                    key={example.concentration}
                    as="th"
                    scope="col"
                    variant="caption"
                    className="px-2 pt-2.5 text-right font-normal text-muted-foreground last:pr-5"
                  >
                    {BLENDS[example.concentration].name}
                  </Typography>
                ))}
              </tr>
            </thead>
            <tbody>
              {sizes.map((ml, row) => (
                <tr key={ml}>
                  <Typography
                    as="th"
                    scope="row"
                    variant="caption"
                    className="px-5 py-1.5 text-left font-normal whitespace-nowrap"
                  >
                    {ml} ml
                  </Typography>
                  {board.examples.map((example) => (
                    <Typography
                      key={example.concentration}
                      as="td"
                      variant="caption"
                      className="px-2 py-1.5 text-right font-semibold whitespace-nowrap tabular-nums last:pr-5"
                    >
                      {formatRupiah(example.prices[row]?.price ?? 0)}
                    </Typography>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <Typography
            variant="caption"
            className="mt-4 border-t border-border px-5 py-3.5 text-muted-foreground"
          >
            Harga = tarif per ml × ukuran + botol. Harga tiap wangi ada di
            halamannya.
          </Typography>
        </>
      ) : loading ? (
        <div role="status" className="grid gap-3 px-5 py-6">
          <span className="sr-only">Memuat harga…</span>
          {[0, 1, 2, 3, 4, 5].map((row) => (
            <div
              key={row}
              aria-hidden
              className="h-4 bg-muted motion-safe:animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="px-5 py-6">
          <Typography variant="body" className="text-muted-foreground">
            Harga per ml belum bisa dimuat. Harga setiap wangi tetap tercantum
            di halamannya.
          </Typography>
          <Link
            href="/koleksi"
            className="mt-3 inline-block font-semibold text-gold-accent-soft underline underline-offset-4"
          >
            Lihat koleksi →
          </Link>
        </div>
      )}
    </section>
  );
}
