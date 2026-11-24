// Needs state (open/closed, highlighted aroma) and event handlers, so it is a
// Client Component.
"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useRef, useState } from "react";
import { ArrowRightIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "cn";

import { navLinkClass } from "@/components/shared/nav-items";
import Typography from "@/components/shared/typography";
import { AROMAS, type AromaNote } from "@/features/catalog/aroma";
import { ATELIER_PHOTO, getAromaPhoto } from "@/features/catalog/aroma-photos";

// The "Aroma" item of the desktop menu, with a panel of the 13 aroma families.
// - Mouse: the panel opens on hover and closes when the mouse leaves.
// - Keyboard: Enter or Space on "Aroma" opens/closes it, Tab walks through the
//   aromas, and Escape closes it and puts focus back on "Aroma".
// - Clicking an aroma closes it. The header stays on screen when the page
//   changes, so without this the panel would stay open over the new page.
// - Hovering or focusing an aroma shows its ingredient photo on the right.
//
// It must sit inside a positioned header (site-header.tsx is `sticky`): the
// panel is `absolute inset-x-0 top-full`, so it is as wide as the header and
// starts right below it. That is also why this <li> must NOT be `relative`.
//
// The header is always black (class `dark`), but the panel follows the color
// mode: `theme-page` switches it back to ivory in light mode (globals.css).
export default function AromaMenu() {
  const [open, setOpen] = useState(false);
  // The aroma under the mouse or keyboard focus; null shows the atelier photo.
  const [active, setActive] = useState<AromaNote | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  // A unique id that links the button to its panel (aria-controls).
  const panelId = useId();

  const close = () => setOpen(false);

  const activeAroma = AROMAS.find((aroma) => aroma.note === active);
  const photo = (active && getAromaPhoto(active)) ?? ATELIER_PHOTO;

  return (
    <li
      className="h-full"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={close}
      onBlur={(event) => {
        // relatedTarget is the element that receives focus next. If it is
        // outside this <li> (Tab past the last aroma), close the panel.
        if (!event.currentTarget.contains(event.relatedTarget)) close();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          close();
          buttonRef.current?.focus();
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        // event.detail is 0 when the "click" came from Enter or Space: toggle.
        // A real mouse click keeps the panel open, because hovering already
        // opened it (a toggle would close it again right away).
        onClick={(event) =>
          setOpen((current) => (event.detail === 0 ? !current : true))
        }
        className={navLinkClass}
      >
        Aroma
        <ChevronDownIcon
          aria-hidden
          strokeWidth={1.5}
          className={cn(
            "size-3.5 transition-transform duration-300 motion-reduce:transition-none",
            open && "rotate-180",
          )}
        />
      </button>

      <div
        id={panelId}
        className={cn(
          // Full header width, right below it.
          "absolute inset-x-0 top-full",
          // Follows the color mode; a crisp gold line on top and the
          // floating-panel shadow from DESIGN.md.
          "theme-page border-t border-gold/70 bg-popover text-popover-foreground shadow-[0_40px_60px_-30px_rgb(0_0_0/0.6)]",
          // An invisible strip over the ruler between the menu and the panel,
          // so the mouse doesn't "leave" on its way down.
          "before:absolute before:inset-x-0 before:bottom-full before:h-3",
          "transition-[opacity,translate,visibility] duration-300 ease-atelier motion-reduce:transition-none",
          // `invisible` also takes the links out of the Tab order while closed.
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1.5 opacity-0",
        )}
      >
        <div className="mx-auto grid max-w-330 grid-cols-[13rem_1fr] gap-12 px-10 pt-11 pb-12 min-[1180px]:grid-cols-[15rem_1fr_12.5rem] min-[1180px]:gap-13">
          <div>
            {/* Headline at 36px (an exception): the full headline size does
                not fit this 13–15rem column. */}
            <Typography variant="headline" className="text-4xl leading-[1.06]">
              Temukan wangi dari{" "}
              <em className="font-light text-gold-accent-soft">aromanya</em>.
            </Typography>
            <Typography variant="body" className="mt-4 text-muted-foreground">
              Tiga belas keluarga aroma, dari manis sampai gaharu. Setiap wangi
              diracik setelah kamu memesan.
            </Typography>
            <Link
              href="/koleksi"
              onClick={close}
              className="mt-6 inline-flex items-center gap-2.5 border-b border-current pb-1.5 text-[11px] font-semibold tracking-[0.18em] text-gold-accent-soft uppercase transition-colors hover:text-foreground"
            >
              Lihat semua koleksi
              <ArrowRightIcon aria-hidden className="size-3.5" />
            </Link>
          </div>

          {/* Numbered list in 3 columns, read top to bottom (grid-flow-col). */}
          <ol className="grid grid-flow-col grid-cols-3 grid-rows-5 content-start gap-x-8">
            {AROMAS.map((aroma, index) => (
              <li key={aroma.note}>
                <Link
                  href={`/koleksi?note=${aroma.note}`}
                  onClick={close}
                  onMouseEnter={() => setActive(aroma.note)}
                  onFocus={() => setActive(aroma.note)}
                  className="group/aroma flex items-baseline gap-3 border-b border-border py-3 transition-colors hover:border-gold-accent focus-visible:border-gold-accent"
                >
                  <span className="w-5 shrink-0 text-[10.5px] font-semibold tracking-[0.06em] text-gold-accent tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-primary text-[1.3rem] leading-tight transition-colors group-hover/aroma:text-gold-accent-soft group-focus-visible/aroma:text-gold-accent-soft">
                    {aroma.label}
                  </span>
                  <span className="font-primary text-sm font-light text-muted-foreground italic">
                    {aroma.indonesian}
                  </span>
                </Link>
              </li>
            ))}
          </ol>

          {/* Ingredient photo, from 1180px. Decorative: the caption names it. */}
          <figure className="hidden min-[1180px]:block">
            <div className="relative aspect-4/5 overflow-hidden after:absolute after:inset-2 after:border after:border-paper/60">
              <Image
                // A new key restarts the fade-in when the photo changes.
                key={photo.caption}
                src={photo.src}
                alt=""
                fill
                sizes="200px"
                placeholder="blur"
                className="animate-in object-cover duration-500 fade-in motion-reduce:animate-none"
              />
            </div>
            <Typography
              as="figcaption"
              variant="caption"
              className="mt-3 text-muted-foreground"
            >
              <Typography
                as="span"
                variant="subtitle"
                className="mr-1.5 text-foreground"
              >
                {activeAroma?.label ?? "Meja racik"}
              </Typography>
              {activeAroma
                ? (getAromaPhoto(activeAroma.note)?.caption ??
                  activeAroma.indonesian)
                : photo.caption}
            </Typography>
          </figure>
        </div>
      </div>
    </li>
  );
}
