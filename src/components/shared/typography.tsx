import type * as React from "react";

import { cn } from "cn";

// The type roles of DESIGN.md (Typography), one variant each. A role sets
// the family, size, weight, line height and tracking together, so every
// block of text in the shop uses one of these instead of writing font sizes
// by hand. Colors are not part of a role: pass them through className.
const roles = {
  // The home hero headline only.
  display:
    "font-primary text-[clamp(3rem,7.6vw,6.125rem)] leading-[1.02] font-[330]",
  // Page and section headings, and the product name on its page.
  headline:
    "font-primary text-[clamp(2.375rem,4.3vw,4rem)] leading-[1.02] font-[330]",
  // Product names on cards, smaller headings. 19px on phones, 27px from 980px.
  title:
    "font-primary text-[1.1875rem] leading-[1.15] font-normal min-[980px]:text-[1.6875rem] min-[980px]:leading-[1.1]",
  // Blend names, aroma names in the menus, small serif headings.
  subtitle: "font-primary text-xl leading-tight font-normal",
  // Descriptions, forms and nota text. Paragraphs stay under 70 characters.
  body: "max-w-[70ch] font-secondary text-[15px] leading-[1.65] font-normal",
  // Small supporting text: breadcrumbs, details, price breakdowns, captions.
  caption: "font-secondary text-[13px] leading-[1.45] font-normal",
  // Small labels, column titles, atelier numbers, "Stok habis".
  label: "font-secondary text-[11px] font-semibold tracking-[0.22em] uppercase",
  // The black frame's menus and utility bar (a little tighter below 1180px).
  nav: "font-secondary text-[11px] font-light tracking-[0.16em] uppercase min-[1180px]:text-[11.5px] min-[1180px]:tracking-[0.22em]",
  // Prices in lists and on cards.
  price: "font-secondary text-[15px] font-semibold tabular-nums",
  // The price on the product page.
  "price-lg":
    "font-secondary text-[2.25rem] leading-none font-semibold tabular-nums",
  // A small italic serif word inside other text: the Indonesian aroma name,
  // "Exclusive". It keeps the size of the text around it.
  accent: "font-primary font-light italic",
} as const;

// The first variants of the starter kit, still used by the old home, login
// and dashboard pages until those are rebuilt. Only these take `size`.
const legacy = {
  heading: "font-primary",
  paragraph: "font-secondary",
} as const;

export const typographyStyles = {
  variants: { ...roles, ...legacy },
  sizes: {
    "7xl": "text-[clamp(2.75rem,5vw,4rem)] leading-[1.05] tracking-tight",
    "6xl": "text-[clamp(2.25rem,4vw,3rem)] leading-[1.1] tracking-tight",
    "5xl": "text-[clamp(2rem,3vw,2.625rem)] leading-[1.15]",
    "4xl": "text-4xl leading-tight",
    "3xl": "text-3xl leading-tight",
    "2xl": "text-2xl leading-snug",
    xl: "text-xl leading-snug",
    lg: "text-lg leading-relaxed",
    base: "text-base leading-relaxed",
    sm: "text-sm leading-normal",
    xs: "text-xs leading-normal",
  },
} as const;

export type TypographyRole = keyof typeof roles;
type TypographyVariant = keyof typeof typographyStyles.variants;
type TypographySize = keyof typeof typographyStyles.sizes;

export type TypographyProps<T extends React.ElementType = "p"> = {
  as?: T;
  variant?: TypographyVariant;
  // For the starter variants (heading, paragraph) only; a role has its size.
  size?: TypographySize;
  className?: string;
  children: React.ReactNode;
} & Omit<
  React.ComponentPropsWithoutRef<T>,
  "as" | "variant" | "size" | "className" | "children"
>;

function isLegacy(variant: TypographyVariant): variant is keyof typeof legacy {
  return variant in legacy;
}

export default function Typography<T extends React.ElementType = "p">({
  as,
  variant = "paragraph",
  size = "base",
  className,
  children,
  ...props
}: TypographyProps<T>) {
  const Component = as || "p";

  return (
    <Component
      {...props}
      className={cn(
        typographyStyles.variants[variant],
        isLegacy(variant) && typographyStyles.sizes[size],
        className,
      )}
    >
      {children}
    </Component>
  );
}
