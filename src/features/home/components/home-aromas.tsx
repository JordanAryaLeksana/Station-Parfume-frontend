import Typography from "@/components/shared/typography";
import AromaExplorer from "@/features/home/components/aroma-explorer";
import type { AromaShowcase } from "@/features/home/showcase";

export default function HomeAromas({ aromas }: { aromas: AromaShowcase[] }) {
  return (
    <section
      id="aroma"
      aria-labelledby="aroma-title"
      className="scroll-mt-28 bg-muted py-21.5 min-[980px]:py-32.5"
    >
      <div className="mx-auto max-w-330 px-5 min-[980px]:px-10">
        <div className="mb-10 flex flex-col gap-5 min-[980px]:mb-14 min-[980px]:flex-row min-[980px]:items-end min-[980px]:justify-between min-[980px]:gap-10">
          <Typography as="h2" id="aroma-title" variant="headline">
            Mulai dari{" "}
            <em className="font-light text-gold-accent-soft">aroma</em>
            <br className="max-[979px]:hidden" /> yang kamu suka.
          </Typography>
          <Typography variant="body" className="max-w-95 text-muted-foreground">
            Setiap wangi kami punya dua keluarga aroma. Pilih keluarganya dulu,
            lalu temukan wanginya.
          </Typography>
        </div>

        <AromaExplorer aromas={aromas} />
      </div>
    </section>
  );
}
