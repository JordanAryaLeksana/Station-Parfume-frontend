import Link from "next/link";
import type { ReactNode } from "react";
import { SearchIcon, ShoppingBagIcon, UserIcon } from "lucide-react";
import { cn } from "cn";

import AromaMenu from "@/components/shared/aroma-menu";
import Logo from "@/components/shared/logo";
import MobileMenu from "@/components/shared/mobile-menu";
import { NAV, navLinkClass } from "@/components/shared/nav-items";
import ThemeToggle from "@/components/shared/theme-toggle";

export default function SiteHeader({ className }: { className?: string }) {
  // Koleksi first, then Aroma (which has its own panel), then the rest.
  const [first, ...rest] = NAV;

  return (
    // Deep Ink (#0a0a09), the same neutral black as the utility bar above, so
    // the whole top frame is one black. A faint cream hairline separates the two.
    <header
      className={cn(
        "dark sticky top-0 z-50 border-t border-cream/8 bg-ink-2",
        className,
      )}
    >
      {/* Three columns. On phones the menu button takes the first column; on
          desktop it is hidden, so the logo moves into the first column. */}
      <div className="mx-auto grid h-16 max-w-330 grid-cols-[1fr_auto_1fr] items-center px-5 min-[980px]:h-19.5 min-[980px]:grid-cols-[auto_1fr_auto] min-[980px]:gap-10 min-[980px]:px-10">
        <div className="min-[980px]:hidden">
          <MobileMenu className="-ml-3" />
        </div>

        <Logo
          variant="lockup"
          tone="dark"
          eager
          className="h-11 min-[980px]:h-14"
        />

        <nav
          aria-label="Menu utama"
          className="hidden h-full min-[980px]:block"
        >
          <ul className="flex h-full justify-center gap-6 min-[1180px]:gap-8.5">
            <li className="h-full">
              <Link href={first.href} className={navLinkClass}>
                {first.label}
              </Link>
            </li>
            <AromaMenu />
            {rest.map((item) => (
              <li key={item.href} className="h-full">
                <Link href={item.href} className={navLinkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center justify-end min-[980px]:gap-3 min-[1180px]:gap-6">
          {/* Light/dark mode. On phones it lives in the phone menu. */}
          <ThemeToggle className="hidden hover:text-gold-light min-[980px]:inline-flex" />
          <HeaderAction
            href="/koleksi"
            label="Cari"
            ariaLabel="Cari wangi"
            icon={
              <SearchIcon aria-hidden className="size-4.5" strokeWidth={1.25} />
            }
            className="hidden min-[980px]:inline-flex"
          />
          <HeaderAction
            href="/login"
            label="Akun"
            ariaLabel="Akun"
            icon={
              <UserIcon aria-hidden className="size-4.5" strokeWidth={1.25} />
            }
            className="hidden min-[980px]:inline-flex"
          />
          <HeaderAction
            href="/tas"
            label="Tas"
            ariaLabel="Tas belanja"
            icon={
              <ShoppingBagIcon
                aria-hidden
                className="size-4.5"
                strokeWidth={1.25}
              />
            }
            className="-mr-3 min-[980px]:mr-0"
          />
        </div>
      </div>
      {/* The gold measuring ruler. Full gold, never transparent: see the
          takar utility in globals.css. */}
      <div aria-hidden className="pointer-events-none takar h-2" />
    </header>
  );
}

type HeaderActionProps = {
  href: string;
  // Text next to the icon, shown from 1180px.
  label: string;
  // Name for screen readers. It must contain `label` (WCAG 2.5.3).
  ariaLabel: string;
  icon: ReactNode;
  className?: string;
};

function HeaderAction({
  href,
  label,
  ariaLabel,
  icon,
  className,
}: HeaderActionProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex h-11 min-w-11 items-center justify-center gap-2 text-[11px] font-light tracking-[0.16em] uppercase transition-colors hover:text-gold-light focus-visible:text-gold-light min-[1180px]:text-[11.5px] min-[1180px]:tracking-[0.22em]",
        className,
      )}
    >
      {icon}
      <span className="hidden min-[1180px]:inline">{label}</span>
    </Link>
  );
}
