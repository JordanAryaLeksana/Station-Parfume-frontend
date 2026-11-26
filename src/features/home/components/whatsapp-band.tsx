import { MessageCircleMoreIcon } from "lucide-react";

import Typography from "@/components/shared/typography";
import { Button } from "@/components/ui/button";

const STEPS = [
  "Sebutkan parfum favoritmu, atau ceritakan wanginya.",
  "Peracik kami mencocokkan karakter wanginya dengan racikan kami.",
  "Kamu dapat nomor dan link wangi yang paling mirip, tinggal pesan.",
] as const;

export default function WhatsAppBand({ href }: { href: string }) {
  return (
    <section
      aria-labelledby="whatsapp-title"
      className="bg-gold bg-kawung py-21.5 text-ink min-[980px]:py-24"
    >
      <div className="mx-auto grid max-w-330 gap-10 px-5 min-[980px]:grid-cols-[minmax(0,1fr)_minmax(0,27rem)] min-[980px]:items-center min-[980px]:gap-16 min-[980px]:px-10">
        <div>
          <Typography as="h2" id="whatsapp-title" variant="headline">
            Cari yang mirip parfum <em className="font-light">favoritmu</em>?
          </Typography>
          <Typography variant="body" className="mt-4 max-w-115 text-ink/80">
            Setiap wangi di sini memakai nama racikan kami sendiri. Sebutkan
            parfum yang kamu suka, peracik kami carikan racikan yang paling
            mirip.
          </Typography>
        </div>

        <div>
          <ol className="border-t border-ink/20">
            {STEPS.map((step, index) => (
              <li
                key={step}
                className="grid grid-cols-[2.75rem_minmax(0,1fr)] items-baseline border-b border-ink/20 py-3.5"
              >
                <Typography
                  as="span"
                  variant="subtitle"
                  aria-hidden
                  className="font-light italic tabular-nums"
                >
                  {String(index + 1).padStart(2, "0")}
                </Typography>
                <Typography as="span" variant="body">
                  {step}
                </Typography>
              </li>
            ))}
          </ol>

          <Button
            asChild
            size="atelier"
            className="mt-7 bg-ink text-gold-light hover:bg-ink/90 focus-visible:border-ink focus-visible:ring-ink/40"
          >
            <a href={href} target="_blank" rel="noopener noreferrer">
              <MessageCircleMoreIcon
                aria-hidden
                className="size-4"
                strokeWidth={1.7}
              />
              Tanya yang mirip
              <span className="sr-only">(WhatsApp, tab baru)</span>
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
