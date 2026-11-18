"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { whatsappUrl } from "@/lib/whatsapp";

// Shown when a page throws while rendering. It renders inside the layout, so
// the header and footer stay. `retry` renders the page again.
export default function ErrorPage({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    // Send this to an error reporting service once the project has one.
    console.error(error);
  }, [error]);

  const waHref = whatsappUrl(
    "Halo Station Parfume, halaman website gagal dimuat.",
  );

  return (
    <div
      role="alert"
      className="mx-auto flex w-full max-w-330 flex-1 flex-col justify-center px-5 py-24 min-[980px]:px-10"
    >
      <div aria-hidden className="mb-8 takar h-2 w-30" />
      <h1 className="max-w-[16ch] font-primary text-[clamp(2.375rem,4.3vw,4rem)] leading-[1.02]">
        Ada yang <em className="font-light text-gold-accent-soft">tidak</em>{" "}
        beres.
      </h1>
      <p className="mt-5 max-w-[46ch] text-muted-foreground">
        Halaman ini gagal dimuat. Coba sekali lagi. Kalau masih gagal, kabari
        kami lewat WhatsApp.
      </p>
      <div className="mt-9 flex flex-wrap gap-3">
        <Button size="lg" className="h-12 px-6" onClick={() => retry()}>
          Coba lagi
        </Button>
        {waHref && (
          <Button asChild size="lg" variant="outline" className="h-12 px-6">
            <a href={waHref} target="_blank" rel="noopener noreferrer">
              Kabari lewat WhatsApp
              <span className="sr-only">(buka di tab baru)</span>
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
