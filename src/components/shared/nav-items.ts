import { typographyStyles } from "@/components/shared/typography";

// Main menu links, shared by the desktop header (site-header.tsx) and the
// phone menu (mobile-menu.tsx), so the two menus always match.
// "Aroma" is not in this list: it opens the aroma panel (aroma-menu.tsx).
export const NAV = [
  { label: "Koleksi", href: "/koleksi" },
  { label: "Exclusive", href: "/koleksi?grade=exclusive" },
  { label: "Mobil & souvenir", href: "/koleksi?kind=general" },
  { label: "Cerita", href: "/tentang" },
] as const;

// Look of a top-level desktop menu item: the Navigation type role from
// typography.tsx (light, widely spaced uppercase, a little tighter below
// 1180px so it fits) and a gold underline that grows from the middle on
// hover, keyboard focus, or while its panel is open (aria-expanded). Used by
// the links in site-header.tsx and the Aroma button in aroma-menu.tsx.
// `h-full` makes the item as tall as the header, so the whole strip responds
// to the mouse.
export const navLinkClass = `${typographyStyles.variants.nav} relative flex h-full items-center gap-1.5 whitespace-nowrap outline-none transition-colors hover:text-gold-light focus-visible:text-gold-light aria-expanded:text-gold-light after:absolute after:inset-x-1/2 after:bottom-6 after:h-px after:bg-gold after:transition-[left,right] after:duration-400 after:ease-atelier hover:after:inset-x-0 focus-visible:after:inset-x-0 focus-visible:after:h-0.5 aria-expanded:after:inset-x-0 motion-reduce:after:transition-none`;

// Extra links for the bottom of the phone menu. On desktop they are in the
// header icons and the utility bar.
export const NAV_EXTRA = [
  { label: "Akun", href: "/login" },
  { label: "Lacak pesanan", href: "/pesanan" },
  { label: "Bantuan", href: "/faq" },
] as const;
