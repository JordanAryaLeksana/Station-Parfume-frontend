import Link from "next/link";
import { MenuIcon, MessageCircleMoreIcon, XIcon } from "lucide-react";
import { cn } from "cn";

import Logo from "@/components/shared/logo";
import { NAV, NAV_EXTRA } from "@/components/shared/nav-items";
import ThemeToggle from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AROMAS } from "@/features/catalog/aroma";
import { whatsappUrl } from "@/lib/whatsapp";

// The phone menu (below 980px): a button that opens a panel from the left.
// No "use client" needed here: Sheet already has it inside sheet.tsx.
//
// Every link is wrapped in <SheetClose asChild>, so the panel closes when a
// link is tapped. `asChild` means "don't add your own <button>, give your
// behavior to my child (the Link) instead".
//
// The panel is rendered at the end of <body> (a portal), outside the black
// header, so it simply follows the color mode: ivory in light, black in dark.
export default function MobileMenu({ className }: { className?: string }) {
  const waHref = whatsappUrl(
    "Halo Station Parfume, saya mau tanya soal parfum.",
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Buka menu"
          className={cn(
            "inline-flex size-11 items-center justify-center transition-colors hover:text-gold-light",
            className,
          )}
        >
          <MenuIcon aria-hidden className="size-5" strokeWidth={1.25} />
        </button>
      </SheetTrigger>

      <SheetContent
        side="left"
        showCloseButton={false}
        className="gap-0 overflow-y-auto border-gold/60 p-0 data-[side=left]:w-[88%]"
      >
        <SheetHeader className="flex-row items-center justify-between border-b border-border py-2.5 pr-2 pl-5">
          {/* Radix requires a title and description so screen readers can
              announce the panel; here both are only for screen readers. */}
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Navigasi utama Station Parfume
          </SheetDescription>
          <SheetClose asChild>
            <Logo tone="auto" className="h-10" />
          </SheetClose>
          <SheetClose
            aria-label="Tutup menu"
            className="inline-flex size-11 items-center justify-center transition-colors hover:text-gold-accent-soft"
          >
            <XIcon aria-hidden className="size-5" strokeWidth={1.25} />
          </SheetClose>
        </SheetHeader>

        <nav aria-label="Menu utama" className="px-5">
          <ul>
            {NAV.map((item, index) => (
              <li key={item.href}>
                <SheetClose asChild>
                  <Link
                    href={item.href}
                    className="group flex items-baseline gap-3.5 border-b border-border py-3.5"
                  >
                    <span className="w-4.5 shrink-0 text-[10.5px] font-semibold tracking-[0.06em] text-gold-accent tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-primary text-[1.8rem] leading-tight transition-colors group-hover:text-gold-accent-soft">
                      {item.label}
                    </span>
                  </Link>
                </SheetClose>
              </li>
            ))}
          </ul>

          <div className="mt-7 mb-1 flex items-baseline justify-between">
            <h2 className="font-primary text-xl font-light text-gold-accent-soft italic">
              Aroma
            </h2>
            <span className="text-xs text-muted-foreground">13 keluarga</span>
          </div>
          <ul className="grid grid-cols-2 gap-x-4">
            {AROMAS.map((aroma) => (
              <li key={aroma.note}>
                <SheetClose asChild>
                  <Link
                    href={`/koleksi?note=${aroma.note}`}
                    className="group flex min-h-9 items-baseline gap-1.5 pt-2"
                  >
                    <span className="font-primary text-[1.05rem] transition-colors group-hover:text-gold-accent-soft">
                      {aroma.label}
                    </span>
                    <span className="font-primary text-[0.8rem] font-light text-muted-foreground italic">
                      {aroma.indonesian}
                    </span>
                  </Link>
                </SheetClose>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto border-t border-border px-5 pt-4 pb-5">
          {/* Only when NEXT_PUBLIC_WHATSAPP_NUMBER is set. The primary button
              is black in light mode and gold in dark mode. */}
          {waHref && (
            <Button
              asChild
              className="h-12 w-full gap-2.5 text-[11.5px] font-semibold tracking-[0.16em] uppercase"
            >
              <a href={waHref} target="_blank" rel="noopener noreferrer">
                <MessageCircleMoreIcon aria-hidden className="size-4.5" />
                Tanya peracik di WhatsApp
                <span className="sr-only">(buka di tab baru)</span>
              </a>
            </Button>
          )}
          <div className="mt-2 flex items-center justify-between gap-4">
            <ul className="flex flex-wrap gap-x-5 text-[11px] font-light tracking-[0.2em] uppercase">
              {NAV_EXTRA.map((item) => (
                <li key={item.href}>
                  <SheetClose asChild>
                    <Link
                      href={item.href}
                      className="inline-flex min-h-11 items-center transition-colors hover:text-gold-accent-soft"
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                </li>
              ))}
            </ul>
            <ThemeToggle className="-mr-3 hover:text-gold-accent-soft" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
