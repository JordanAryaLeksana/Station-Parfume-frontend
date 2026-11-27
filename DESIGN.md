---
name: Station Parfume
description: Atelier racik parfum dari Karawang, setiap botol diracik setelah dipesan.
colors:
  ink: "#141110"
  ink-deep: "#0a0a09"
  ink-raised: "#171513"
  night: "#0f0e0d"
  gold: "#c8a15a"
  gold-light: "#e2c58e"
  gold-dark: "#7e5c24"
  cream: "#f2ebdd"
  cream-deep: "#e9dfcc"
  paper: "#faf6ee"
  white: "#ffffff"
  text-on-ink: "#f4eee3"
  muted-on-ink: "#aaa49a"
  muted-on-paper: "#5e5448"
  danger: "#a23b2e"
  danger-on-ink: "#e58b7b"
typography:
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(3rem, 6.4vw, 6.125rem)"
    fontWeight: 330
    lineHeight: 1.02
    letterSpacing: "-0.014em"
    fontVariation: "'SOFT' 100"
  headline:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(2.375rem, 4.3vw, 4rem)"
    fontWeight: 330
    lineHeight: 1.02
    letterSpacing: "-0.014em"
    fontVariation: "'SOFT' 100"
  title:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "1.6875rem"
    fontWeight: 400
    lineHeight: 1.1
    fontVariation: "'SOFT' 100"
  body:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.22em"
  nav:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "0.71875rem"
    fontWeight: 300
    lineHeight: 1
    letterSpacing: "0.22em"
rounded:
  none: "0px"
  pill: "999px"
spacing:
  gutter: "40px"
  gutter-mobile: "20px"
  grid-gap: "24px"
  section: "130px"
  section-mobile: "86px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 28px"
    height: "54px"
  button-primary-on-ink:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 28px"
    height: "54px"
  button-ghost:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 28px"
    height: "54px"
  chip:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 17px"
    height: "40px"
  chip-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    rounded: "{rounded.none}"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0 14px"
    height: "48px"
  product-card-mat:
    backgroundColor: "{colors.cream}"
    rounded: "{rounded.none}"
    padding: "12px 12px 32px"
  nota-racik:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "22px 26px"
  whatsapp-float:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    size: "60px"
---

# Design System: Station Parfume

## Overview

**Creative North Star: "Meja Racik Malam"**

Station Parfume looks like a perfumer's workbench at night: a dark room, warm gold light, and the bottle and scent ingredients at the center. The black sections are the room. The gold is a lamp lighting what matters: a perfume name, a price, the next step. The cream sections are the blend receipt and the open notebook, where the buyer reads and makes choices.

The mood is calm and luxurious. There is plenty of empty space, thin lines, slow motion, and few elements on each screen. Luxury here comes from restraint and precision, not ornament. Every motif comes from the blending process: ml measuring ticks ("garis takar", a ruler of tick marks), numbered scents, the nota racik (blend receipt), and gold flakes. One local touch is used sparingly: the kawung batik pattern on the WhatsApp band.

This direction replaced four earlier prototypes the owner rejected:

- v1 (ivory/ink with Cormorant)
- v2 (espresso and brass with Bodoni and arched frames)
- v3 (a copy of Creed with Cinzel)
- v4 (warm cream, terracotta, and sage)

The owner did not want the arches, did not want an outright copy of another brand, and found the pastel-warm palette not elegant enough.

**Key Characteristics:**

- Two color modes, Gading (light) and Noir (dark), inside a black frame that stays black in both. Gold is the only accent.
- Fraunces with the soft axis for headings, Plus Jakarta Sans (designed in Jakarta) for text.
- Every corner is sharp. Lines are thin and turn gold on dark sections.
- Depth comes from the layers of color, not from shadows.
- Motion is slow and calm.
- The owner's real photos are displayed matted like framed prints.

## Colors

A palette of night black, lamp gold, and paper cream. Gold is rare and meaningful.

### Two Modes

The site has a light mode, **Gading**, and a dark mode, **Noir**. On the first visit it follows the buyer's device setting (`prefers-color-scheme`). The sun/moon toggle in the header and in the phone menu switches it, and the choice is remembered.

- **Gading (light):** ivory surfaces (paper), black text, Paper Muted secondary text, and Aged Gold for numbers, italic accents, and active lines. The primary button is Night Ink.
- **Noir (dark):** deep neutral black (Night #0f0e0d for pages, Deep Ink #0a0a09 for menus, Raised Ink #171513 for cards), bright Night Text, Night Muted secondary text, Prada Gold for numbers and lines, and Lamp Gold for italic accents. The primary button is Prada Gold.
- **Black frame:** the utility bar, header, and footer stay black in both modes (class `dark`). Menus and page content follow the mode. The home hero follows the mode too: its 3D station is a day atelier in Gading and a night atelier in Noir. A panel that hangs from the black header (the aroma menu) uses `theme-page` to follow the mode again.
- **In code:** use the mode tokens instead of fixed colors, so a component works in both modes: `bg-background`, `bg-popover`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `text-gold-accent` (numbers, labels, lines), and `text-gold-accent-soft` (italic accents, hover).

### Primary

- **Prada Gold** (gold): the only accent. Use it for the primary button on dark sections, active states, measuring ticks, prices on dark backgrounds, and the WhatsApp button.
- **Lamp Gold** (gold-light): gold for small text and italic accents on black backgrounds.
- **Aged Gold** (gold-dark): the only gold allowed for text and lines on light backgrounds (5.1:1 on cream). It is also the focus ring color on light sections.

### Neutral

- **Night Ink** (ink): the main background of dark sections, the text on light sections, and the primary button on light sections.
- **Night** (night): the page background in Noir.
- **Deep Ink** (ink-deep): the darkest layer, used for the utility bar, the footer, the Murni/Campur section, and the menus in Noir.
- **Raised Ink** (ink-raised): surfaces that sit above black in Noir, such as cards and toasts. It is a neutral dark grey, not brown.
- **Paper Cream** (paper): the background of light pages such as the product page, checkout, and orders.
- **Cream** (cream): reading sections on the home page, product photo mats, and selected-state backgrounds on light sections.
- **Deep Cream** (cream-deep): secondary surfaces on light sections.
- **Night Text** (text-on-ink) and **Night Muted** (muted-on-ink): main and secondary text on black (16.7:1 and 8.0:1). Both are neutral, not brown-grey.
- **Paper Muted** (muted-on-paper): secondary text on light backgrounds (6.9:1 on paper).
- **Danger** (danger, danger-on-ink): error messages on light and dark sections. Never use red for decoration.

### Named Rules

**The Single Lamp Rule.** Gold is the only accent color. Gold must not fill a large area except the WhatsApp band. On any one screen it is used for at most one primary button and a few small details.

**The Black Frame Rule.** The utility bar, header, and footer are always black in both modes. Everything else follows the mode, including the home hero, whose 3D station has a day and a night version.

**The Clean Black Rule.** Dark surfaces are neutral black, never brown-tinted, and secondary text on black is a neutral warm grey (#aaa49a), never brown-grey. The first menu build used a brown raised surface (#1f1a16) and brown-grey text, and the owner found it muddy ("butek"). The same happened to the header: a reddish black (#141110, hue 15°) between neutral blacks, with gold ticks at 45% that turned olive brown (#655231). Keep every black in the frame the same neutral Deep Ink, and keep gold at full strength.

**The Gold-on-Paper Rule.** Plain gold (#c8a15a) must never be used for text on cream or paper, because its contrast is only 2.0:1. Text on a light background always uses Aged Gold (the gold-accent tokens do this automatically). Thin decorative lines, such as the top rule of the aroma menu, may use plain gold.

**The Aroma Color Rule.** The 13 aroma-family colors (pastel aura) appear only as dimmed glows inside the aroma panel and as small swatch dots. They are never used for buttons, text, or section backgrounds.

## Typography

**Display Font:** Fraunces (with Georgia, serif), soft axis SOFT 100
**Body Font:** Plus Jakarta Sans (with system-ui, sans-serif)
**Label/Mono Font:** Plus Jakarta Sans in uppercase with wide letter spacing (no mono)

**Character:** Fraunces brings a soft, warm, handcrafted elegance, and its italic carries the brand's emphasis words. Plus Jakarta Sans is clean and modern, and its origin in Jakarta matches the local character.

### Hierarchy

Each role is a `variant` of the `Typography` component (`src/components/shared/typography.tsx`), which sets the font, size, weight, line height and tracking together, for example `<Typography as="h1" variant="headline">`. Colors are passed through `className`.

- **Display** (`display`; 330, clamp 48–98px, 1.02): the home hero headline only.
- **Headline** (`headline`; 330, clamp 38–64px, 1.02): page and section headings, and the product name on the product page.
- **Statement** (`statement`; light, clamp 24–40px, 1.28): the editorial sentence of step 06 of the home journey only. Its key phrases are gold italics.
- **Title** (`title`; 400, 27px, 1.1; 19px and 1.15 below 980px): product names on cards, smaller headings, and the nota title (in italic).
- **Subtitle** (`subtitle`; 400, 20px, 1.25): blend names, aroma names in the menus, and small serif headings.
- **Body** (`body`; 400, 15px, 1.65, at most 70ch): descriptions, forms, and nota text.
- **Caption** (`caption`; 400, 13px, 1.45): breadcrumbs, product details, price breakdowns, photo captions, and other small supporting text.
- **Label** (`label`; 600, 11px, letter spacing 0.22em, uppercase): small labels, column titles, group legends, atelier numbers, and "Stok habis". Button and chip text uses the same look through its component.
- **Navigation** (`nav`; 300, 11.5px, letter spacing 0.22em, uppercase; 11px and 0.16em below 1180px so it fits): the header menu (`navLinkClass` builds on it), Cari/Akun/Tas, the utility bar, and the small links in the phone menu. Light and widely spaced, so the black frame feels calm and premium rather than heavy. The owner found the first 600 weight too thick and 12.5px too large.
- **Price** (`price`; 600, 15px, tabular) and **Large price** (`price-lg`; 600, 36px, 1, tabular): prices on cards and lists, and the price on the product page.
- **Accent** (`accent`; Fraunces 300 italic, the size of the text around it): one soft italic word inside other text, such as the Indonesian aroma name or "Exclusive".

**The One Source Rule.** Every block of text in the shop (headings, paragraphs, labels, prices, captions) goes through `Typography` with one of these roles. Don't write font sizes, weights or tracking by hand. A role's size may be overridden with `className` only where a space is too tight for it, and the override is noted in a comment. Text inside buttons, chips, inputs and menu links is styled by those components.

### Named Rules

**The One Italic Rule.** At most one italic word or phrase in each heading, set in gold (gold-light on black, gold-dark on cream), for example "Wangimu, _diracik_ setelah kamu memilih." Never italicize a whole heading.

**The Tabular Price Rule.** Every price and nota number uses tabular numerals, so animated price changes don't shift.

**The Price Format Rule.** Prices are written the Indonesian way, with no space after "Rp", a dot between thousands and ",00" at the end: Rp35.000,00. Always format them with `formatRupiah` (`src/lib/format.ts`), never by hand.

## Layout

- **Container:** maximum 1320px, with a 40px gutter (20px below 980px).
- **Section spacing:** 130px vertically (86px on mobile).
- **Product grid:** 4 columns on desktop, 3 at ≤1180px, 2 on mobile, with a 24px gap. Next to the filter sidebar on /koleksi there is room for one column less: 3 columns from 1180px and 2 below, so the cards stay about 290px wide.
- **Catalog page (/koleksi):**
  - From 980px, the filter sidebar (14–15.5rem) sits on the left of the products. It is sticky 112px from the top, just under the sticky header (87px), and scrolls on its own when taller than the screen.
  - Above the products is one row with the search box and the result count. The active-filter chips sit under it.
  - Below 980px the sidebar is hidden, and a "Filter" button opens the same panel instead (see Catalog Filters).
- **Product page:** two columns, 7 to 5 (gallery and buy panel), with the related products full width below. The gallery is sticky on desktop when the screen is at least 768px tall, and stacks above the panel on mobile. See Product Page.
- **Section headers:** the heading on the left and a short description or filters on the right, aligned to the bottom edge.
- **Breakpoints:** 980px (mobile layout) and 1180px (compact navigation).

## Elevation & Depth

Flat and layered. Depth comes from the black frame against the page, menus that sit one step deeper (Deep Ink in Noir, ivory in Gading), and thin gold lines. At rest there are no permanent shadows. A shadow appears only as a response: a product card lifts about 6px on hover with a soft shadow, and the toast and mega menu use a diffuse shadow so they read as floating.

### Shadow Vocabulary

- **Hover lift** (`box-shadow: 0 30px 50px -28px rgba(0,0,0,0.6)`): product cards on hover, together with `translateY(-6px)`.
- **Floating panel** (`box-shadow: 0 40px 60px -30px rgba(0,0,0,0.6)`): the aroma mega menu, toasts, and the cart panel.

### Named Rules

**The Flat-at-Rest Rule.** Surfaces are flat when idle. Shadows only answer an interaction (hover) or a floating element.

## Shapes

All corners are sharp (0px) on buttons, inputs, chips, cards, photos, and panels. The only circles are functional: the floating WhatsApp button, aroma swatch dots, the round previous/next buttons in the hero, and the price badge in the bag.

Recurring motifs:

- **Measuring ticks** (garis takar): a ruler of thin gold ticks, a short tick every 12px (45% of the height) and a long tick every 60px (full height). Always full gold, never transparent: transparent gold over black turns olive brown. It sits under the header and at the bottom edge of the hero.
- **Matted photos:** a 12px mat around each product photo, 32px at the bottom, where the atelier number (and the Exclusive label) sits like the edition line under a print.
- **Torn receipt edge:** a scalloped edge at the top and bottom of the nota racik.

## Components

### Buttons

- **Shape:** sharp (0px), 54px tall, 0 28px padding, uppercase label text.
- **Primary:** Night Ink with cream text on light sections, Prada Gold with ink text on dark sections.
- **Hover / Focus:** a slow shimmer of light sweeps across the button (about 1s) and the arrow shifts 5px. Focus is a ring in the section's ring color.
- **Ghost:** transparent with a thin 1px line in the text color, which turns gold on hover.

### Chips

- **Style:** a thin outline, 40px tall, uppercase label text.
- **State:** selected chips use a solid fill (Night Ink on light, gold on dark).
- **Choice boxes** (product page): the same idea for the variant choices, as a hidden radio and a box (`CHOICE` in `purchase-parts.tsx`): a thin line on the card surface, solid in the mode's primary color when picked, a focus ring when reached by keyboard. Their text is caption or subtitle in normal case, not label text. See Product Page.
- **Active-filter chip** (/koleksi): 36px tall, a thin outline on the card surface, the label in uppercase label text and an × icon. A search chip keeps the buyer's own words in normal case: “bunga” ×.

### Catalog Filters

The filters on /koleksi (`src/features/catalog/components/`), shaped after the shop sidebars buyers know (e.g. rumahparfum.com) without their clutter.

- **Groups:**
  - **Abjad:** 26 letter boxes in 7 columns.
  - **Aroma:** 13 rows, each with its swatch dot, the English name and the Indonesian name in italic.
  - **Grade**, **Jenis** (Parfum / Mobil & souvenir), and **Ketersediaan** ("Hanya yang tersedia").

  Each group is a `<fieldset>` with a `<legend>` in label style, under a thin rule. Price and size are not filters: every perfume comes in 20/30/50 ml, and every Regular perfume starts at the same price.

- **Choices:**
  - Each choice is a sharp square checkbox: a thin line on the card surface, filled with Night Ink in Gading and gold in Noir when checked, with a check mark.
  - The count sits on the right in tabular numerals. It shows how many products that choice would show, with the other groups applied.
  - A choice with 0 is faded and disabled, unless it is checked.
  - Rows are 36px on desktop and 44px on phones.
  - Letter boxes show their count as a tooltip and to screen readers.
- **Applying:**
  - A change applies at once, without an "apply" button. Every filter lives in the URL (`?letter=b&note=floral…`), so a result can be shared and Back undoes it.
  - Inside a group any choice may match; every group must match.
- **A–Z:** a name is filed under its first letter, skipping digits and symbols, so "1000 Bunga" goes under B.
- **Search:** the box searches while typing, 300ms after the last key, without adding a history entry for every letter. Enter also works. The search keeps the other filters.
- **Phone panel:**
  - Below 980px a "Filter" button (with the number of active filters) opens the same panel from the right; the site menu opens from the left.
  - The choices scroll under a fixed header ("Filter", ×) and a fixed footer: "Hapus semua" (keeps the search) and the primary "Lihat N produk", which closes the panel.
  - The panel stays open while filters change.
- **Empty result:** "Belum ada wangi yang _cocok_." The way out depends on the cause:
  - search plus filters: "Cari “…” tanpa filter"
  - filters only: "Hapus semua filter"
  - search only: "Lihat semua koleksi"

  "Tanya peracik" (WhatsApp) is always there too. After a search, the line explains that every scent carries the shop's own name ("Kalau “…” parfum favoritmu, tanya peracik kami…"), and the WhatsApp button becomes "Tanya yang mirip", with the search words already in the message, because buyers often search for another brand's perfume.

### Cards / Containers

- **Product card** (`src/features/catalog/components/product-card.tsx`):
  - **Mat:** the square photo sits in a mat, white with a thin line in Gading and cream in Noir. The mat is light in both modes, so text on it uses fixed dark colors (Aged Gold, Night Ink).
  - **Mat's bottom margin** (the edition line under a print; never above the name, because a label above a heading is an eyebrow, which is banned):
    - right: the atelier number "No. 158" in Aged Gold
    - left, Exclusive perfumes only: "Exclusive" in italic Fraunces (13px, Night Ink), like a pencil inscription under a print. A small Aged Gold diamond sits before it when the row has room (container query, at least 136px wide), so it is hidden on a 360px phone. At 320px the number drops to a second line inside the margin.
    - The label is `aria-hidden`. The name link carries a visually hidden ", Exclusive" instead, so a Regular and an Exclusive perfume with the same name have different link names for screen readers.
  - **Below the mat:**
    - the name in title style (19px on phones, 27px from 980px)
    - the aroma families, plus "· N varian" if a product ever holds more than one scent (since 20 Nov 2026 every perfume is its own product)
    - "Mulai" with the lowest price, or just the price when there is one
    - "Stok habis" in label style when nothing can be bought
  - **No photo yet:** the photo is replaced by a cream tile with the category name in italic over a measuring-tick ruler.
  - **Hover and keyboard focus:** the photo cross-fades to the close-up of the bottles, the mat lifts, and the name turns gold. Keyboard focus also draws a ring around the whole card.
  - **No add-to-bag button:** a perfume needs its scent, size, and blend chosen first, so the whole card links to the product page.
- **Shadow strategy:** see Elevation & Depth.
- **Border:** thin lines only. Never a thick colored border on one side.

### Product Page

The page of one product (`src/app/produk/[slug]/page.tsx`, parts in `src/features/catalog/components/`). Top to bottom on a phone; on desktop the gallery is the left column and everything from the name to the info is the right.

- **Breadcrumb** (caption): Koleksi / the main aroma family (or "Mobil & souvenir") / the product name, which truncates.
- **Gallery** (`product-gallery.tsx`):
  - The photo matted like on the card (white in Gading, cream in Noir, a deeper bottom margin).
  - Up to three photos: the bottles, the close-up of the bottles, and the ingredient photo of the main aroma (or the second when the main has none). The atelier photo is left out, because it repeats the posters.
  - Thumbnails sit in a column on the left from 980px and in a row of four below the photo on phones. They are buttons with `aria-pressed` and a name such as "Foto 2 dari 3: Close-up botol".
  - With a mouse, hovering the photo zooms it about 1.9× and follows the pointer. There is no zoom on touch.
  - No photo yet: the cream tile with the name in italic over a measuring-tick ruler, like the card.
- **Name** (headline, `h1`), then one row: "Exclusive" (accent, 15px, with the Aged Gold diamond), "No. 162" (label, gold) and the aroma families (label, muted).
- **Buy panel, perfume** (`product-purchase.tsx`):
  - **Price** (`price-lg`, gold, announced politely when it changes) and under it the formula in caption: "Rp2.000,00 per ml × 30 ml + botol Rp5.000,00".
  - **Ukuran:** three choice boxes in a row, each with a small bottle drawing that grows with the size and the size in caption.
  - **Racikan:** two cards, each with the blend name and its alias in subtitle (Campur _parfum_, Murni _bibit_), a one-line description, and the rate per ml at the bottom.
  - Each group starts with its label on the left and the chosen value in gold italic subtitle on the right ("UKURAN ··· 30 ml"). The visible line is `aria-hidden`; a hidden legend names the group.
  - **Nota racik**, then the action row.
- **Buy panel, general product** (`general-purchase.tsx`): no size, blend or nota.
  - **Price** (`price-lg`, gold; in the text color with "Stok habis" in label text beside it when sold out, as on the card).
  - **Pilihan** (only when there is more than one variant and each has a label, e.g. the twelve car perfume scents): wrapping choice boxes, 40px tall, with the label in semibold caption. A box shows its own price only when the prices differ, and "habis" in italic only when some labels are in stock and others are not; when everything is sold out a hidden "(stok habis)" is read out instead.
  - The panel opens on the first label in stock. One order line takes at most 20 and never more than the stock left (`available`); switching to a label with less stock brings the quantity down.
- **Action row** (`purchase-parts.tsx`, shared by both panels):
  - **Quantity stepper:** − n +, 54px tall, 44px-wide buttons that switch off at 1 and at the maximum (and both when sold out).
  - **Bag button:** the primary button filling the rest of the row, "Masukkan ke tas · Rp…" with the total for the quantity. Until the bag exists (stage 3) it leads a guest to log in, carrying the chosen variant and quantity (`/login?next=…&add=…&qty=…`). Sold out or not available, it is a switched-off button that says so ("Stok habis").
  - **WhatsApp link** under the row, with the message already typed: "Tanya peracik soal wangi ini di WhatsApp" for a perfume, "Tanya soal produk ini" for a general product, or "Tanya stok" when sold out ("apakah … tersedia lagi?"). Hidden when the shop number isn't set.
  - **Assurances:** three small promises with line icons above a thin rule: "Diracik" (perfume) or "Dikemas" (general product) "setelah pembayaran diterima", "Dikirim dari Karawang", "Pembayaran aman lewat DOKU".
- **Info** (`product-info.tsx`): native `<details>` rows under thin rules, the summary in label text with a + that turns into ×. "Tentang wangi ini" is open on load; "Murni atau campur?" (perfume only) and "Pengiriman & pembayaran" are closed. The shipping text stays neutral until the ongkir scheme is decided (PRODUCT.md).
- **Related products** (`related-product.tsx`): "Kamu mungkin juga _suka_." (headline) above a thin rule, a body line that names the aromas used, and four cards in the product grid. Perfumes come from the main aroma, topped up from the second aroma when it has fewer than four; general products show other general products. Never the product itself, never a product twice, and the section is left out when nothing is found.

### Home Page

The home page (`src/app/page.tsx`, parts in `src/features/home/components/`) follows its own concept, **"Stasiun isi ulang"**: Station Parfume is the station where your bottle is filled per ml. It is informative first, like a real shop: prices, categories, how to order and answers are on the page itself. It uses signage instead of decoration, and only the home page uses this vocabulary:

- black boards with a thin full-gold frame and a gold title bar (label text)
- dotted leader rows like the nota racik, tabular figures
- numbered stations on a gold rail, with diamond markers
- "Jalur 01…" lanes with a "→"

No illustrations, glows, particles, marquees or scroll reveals. Motion is only functional: nota rows flash when a value changes, and the station that was changed last fills gold. The exception is the 3D station (see Stasiun Racik 3D): one world that tells the whole order as you scroll the journey, plus the aroma carousel.

Every number comes from the API. If the catalog can't be loaded, a section falls back to its words (the board says prices are on each perfume's page; the stations explain themselves without the simulator) or is left out.

Top to bottom:

- **Journey** (follows the mode; `journey.tsx` is the static hero, `journey-live.tsx` the steps, `journey-stage.tsx` the sticky 3D layer). One section from the hero to delivery, so the owner's story reads as one piece: the same bottle is chosen, measured, filled, paid for, packed and driven away.
  - **Hero:** "Parfum racik _per ml_." (display, "per ml" on one line), a lede, the primary "Lihat semua wangi" and the line button "Tanya di WhatsApp". The text column is at most min(36rem, 44vw) from 980px. The hero copy is static, so it is in the first HTML and is the page's largest paint.
  - **Scent card** (`hero-scent-card.tsx`): a slim bar at the bottom right of the first screen from 980px, under the stage on phones. It moves to the next featured perfume every 8 seconds and stops while hovered or focused, while a step is being used, and once the hero is scrolled away. It shares its perfume with step 01.
  - **Steps** (an `ol` on a gold rail, one panel about a screen tall each, `li[data-story]`):
    - 01 Pilih wangi: the section heading "Begini cara pesan di _stasiun_ kami." (h2, `#stations-title`), then the picker (photo, number, name, aromas, ← →).
    - 02 Takar ukuran: choice boxes with each size's price, and "Besar botol di stasiun sebanding dengan isinya."
    - 03 Pilih racikan: campur/murni boxes with the rate per ml, then the `NotaRacik`, "Lihat {perfume} →" and the note that size and blend are chosen again there.
    - 04 Bayar: QRIS, virtual account or e-wallet (DOKU), the 24-hour payment window.
    - 05 Kami racik & kemas: blended after payment, closed, packed in a sealed box.
    - 06 Dikirim: the statement "Dikemas, lalu dikirim dari _Karawang_ ke seluruh Indonesia." and "Cari yang mirip parfum favoritmu? Tanya di WhatsApp →" (left out without a shop number).
  - **3D layer:** a sticky stage behind the steps, full height on the right from 980px (a background-colored gradient on the left keeps the text readable and fades out in step 06 so the van can cross the whole width) and the top 42svh on phones, under the header, with the steps scrolling up beneath it. See Stasiun Racik 3D.
  - It replaced a separate hero, an icon strip, a size shelf in the price section, the stations simulator and a delivery strip: five scenes in five worlds that the owner found jerky and disconnected.
- **Prices** ("Harga dihitung _terbuka_.", `home-prices.tsx`): the formula in words on the left (rate per ml × size + bottle; the exact price is on each perfume's page) and the **price board** (`price-board.tsx`) on the right, or below on phones:
  - the per-ml rates per grade (Regular and Exclusive, campur and murni, as ranges) and the bottle price
  - a table of the cheapest bottle per size and blend
  - the formula line

  The rates are worked out in `priceBoard()` (`src/features/home/showcase.ts`) from each perfume's lowest price (20 ml campur) and highest price (50 ml murni) minus the bottle. Results that are not whole numbers, or where campur would cost more than murni, are skipped.

- **Lanes** ("Pilih _jalurmu_.", `home-lanes.tsx`):
  - Six tiles: Parfum Regular, Exclusive, parfum mobil, souvenir pernikahan, reed diffuser, and botol, bibit & kantong. Each shows its count or detail and its lowest price (`lanes()`).
  - Regular and souvenir span two columns. The whole tile links (stretched link); the souvenir tile also has a WhatsApp link for bulk orders.
  - Tiles with a photo show it. A tile without one shows its price large on a cream band until the owner's photo arrives (`HOME_PHOTOS`, `src/features/home/photos.ts`).
- **Pilihan _peracik_**: the eight starters in the product grid, noting that card prices are the smallest size (20 ml campur), and "Lihat semua N wangi".
- **Aroma panel** (`#aroma`): see Aroma Panel.
- **FAQ** ("Yang sering _ditanyakan_.", `home-faq.tsx`): the product page's `<details>` rows (`InfoSection`) for:
  - murni vs campur
  - how prices are worked out (with a live example)
  - when it is blended and shipped
  - finding a similar scent
  - payment and the 24-hour window
  - shipping costs (neutral until the scheme is decided)
  - souvenirs and bulk orders (with the souvenir price)
  - whether there is a shop to visit (online only)
- **Story** ("Meracik sejak _2010_.", muted band): a matted photo (the owner's blending-table photo when it arrives), one paragraph, four facts as large gold figures (2010, 13 aroma families, 3 sizes, 2 blends) and the signature.
- **WhatsApp band** ("Cari yang mirip parfum _favoritmu_?"):
  - The gold band with the kawung pattern and ink text, saying every scent carries the shop's own name.
  - Three numbered steps: name your favourite perfume, the blender matches its character, you get the number and link.
  - An ink button "Tanya yang mirip" with gold-light text opens WhatsApp in a new tab with "…yang mirip dengan: " already typed. The site never names another brand; the buyer names it in their own message.
  - Left out when the shop number isn't set.

### Inputs / Fields

- **Style:** a white background with a thin border (input token), sharp, 48px tall for comfortable tapping.
- **Focus:** the border and ring change to the ring color (gold-dark on light).
- **Error / Disabled:** a Danger-colored message under the field. Disabled fields are faded but still readable.

### Logo

The owner's official logo (`src/assets/brand/logo-original.webp`): a sprig, the text "STATION / PAR / FUME" with "EST 2010", a thin circle, "PURE NATURE", and a pink brush stroke. The website uses versions cut from this file, never a redrawing or a substitute typeface.

- **Lockup** (sprig + text, no circle): in the header and anywhere with limited height (about 64px), so the text stays readable.
- **Badge** (the full round logo): in the footer, the about page, and other roomy spots, at 160px or wider.
- **On black:** sprig, text, and circle in cream; the pink brush becomes a faint gold (about 30%).
- **On light:** the original colors, black with the pink brush.
- Don't put the logo on a busy photo, recolor it outside these two tones, or stretch it.

### Navigation

- **Header:** sticky and solid Deep Ink (#0a0a09) in both modes, the same neutral black as the utility bar, with a faint cream hairline between them. No transparency (it turns grey over a light page) and no warm or reddish black (it clashes with the gold). The logo lockup is on the left, uppercase navigation in the middle, and Cari/Akun/Tas plus the sun/moon mode toggle on the right, with a gold bag badge. A measuring-tick ruler sits under it.
- **Utility bar:** Deep Ink, with three short messages that rotate gently.
- **Aroma mega menu:** follows the mode (ivory in Gading, Deep Ink in Noir) under a crisp gold top rule. Three columns: a heading with one italic word, a short line, and "Lihat semua koleksi"; the 13 families as a numbered list (01–13 in gold, the name in Fraunces, the Indonesian name in italics) read top to bottom in three columns; and an ingredient photo in a thin inset frame that changes with the highlighted family (the atelier photo for families without one). No swatch dots here.
- **Mobile:** the navigation becomes a single menu button; the logo and the bag stay visible. The phone menu slides in from the left and follows the mode: the logo, numbered links (01–04) in large Fraunces, the aroma list in two columns (name and italic Indonesian name), then the WhatsApp button (the primary button: black in Gading, gold in Noir), small links, and the mode toggle.

### Nota Racik (signature)

The price breakdown on the product page looks like a white receipt with scalloped edges (`nota-racik.tsx`). It shows the italic title "Nota racik" and the atelier number, then dotted rows in body text: scent, blend, rate × ml, bottle, "Jumlah × n" (from two bottles), and the total in bold. Rows whose value changed flash gold briefly (not under reduced motion). Perfumes only: a general product has nothing blended, so no nota.

### Aroma Panel (signature)

On the left, the list of 13 aroma families. On the right, a black panel framed by a thin gold line, with a still, soft glow in the family's color, the large family name with its Indonesian name in italics, example scents, and an ingredient photo on a hanging tag.

On the home page the panel opens with the **aroma carousel** (`aroma-carousel.tsx`, the page's second canvas): the 13 tubes of the station on a round lacquer base, numbered like the list. Choosing a family turns the carousel the short way until its tube is in front, lifts it a little and lights it, while the others dim. The canvas is transparent, so the glow shows through. From 980px the photo tag hangs at the top right beside the carousel; on phones it stays at the bottom. Without WebGL the panel is as before.

### Stasiun Racik 3D (signature)

**One world, one story** (`src/features/home/three/`, React Three Fiber). A curved perfume organ in black lacquer and brass: 13 glass tubes of bibit, one per aroma family and numbered 01–13, with liquids from straw to oud. A brass manifold and gooseneck spout stand over a square glass bottle with a gold ball cap (the owner's real shape) on a black turntable, with a meter that counts ml and rupiah. In the same room: a rack with the 20, 30 and 50 ml bottles, a packing spot, a brass rail, and the black van with the official sprig and wordmark. The bottle label carries the sprig, the number, the name, the size and the blend.

- **The story** (`journey-scene.tsx`, a single value `s` from 0 to 6 taken from which step is in the middle of the screen; every motion is a continuous function of `s`, so scrolling back plays it backwards):
  - 0 hero: the featured perfume fills on its own loop (cap lifts, the family's tube glows, the meter counts to its 30 ml campur price).
  - 1: the camera moves to the tubes; the chosen family's tube rises and glows gold; the bottle drains for the new order.
  - 2: the size rack slides in; changing the size sends the bottle back to its slot and brings the chosen one to the turntable.
  - 3: scrolling pours: the stream, the level, and the meter's ml and rupiah rise together and stop on the variant's price, the nota total. Murni is a deeper liquid than campur.
  - 4: the meter is stamped "LUNAS" and the cap goes back on.
  - 5: a tray rides in on the rail, the bottle steps in, the cover lowers and a gold seal appears.
  - 6: the van arrives, its side door slides open, the same box rides the rail into it, the door closes and the van drives off to the left.
- **Smoothness:** scroll only sets a target; `s` follows it with a critically damped spring each frame, so a jerky scroll still moves smoothly. The camera rides one spline through seven shots (with holds while a step is read), at a constant lens, with the hero's off-centre framing on desktop. Wheels turn by the distance travelled and the van's nose dips with its acceleration.
- **Day and night:** Gading is a seamless cream studio in soft daylight; Noir a dark studio with a warm lamp and the organ's back panel lit from within. Switching modes fades between them.
- **Business rules:** text, prices and buttons stay HTML; the canvas is decorative (`aria-hidden`). The scene loads after the page has loaded, when the browser is idle; it is built in a React transition in small slices, its shaders are compiled off the main thread before it fades in, and it draws only while on screen with the tab visible. There are two canvases on the page: the journey and the aroma carousel.
- **Measured** (production build, headless Chrome, whole page scrolled): no long task and no frame over 17 ms at normal CPU; no long task and two frames of 33 ms with the CPU slowed 4×.
- **Quality:** one shared level steps down on slower devices (pixel ratio up to 1.5, glass, shadow resolution, bloom), first from the device, then from the measured frame rate. Moving objects use soft blob shadows; still ones a contact shadow drawn once.
- **Fallbacks:** under reduced motion `s` snaps to each step's finished state, without transitions. Without WebGL2, or with Save-Data, the atelier photo is shown and no three.js is loaded; all steps still work.
- **Assets:** labels, plates, the meter, the stamp and the van's livery are drawn on canvases in the site's fonts and from the official logo files. Nothing loads from a CDN.
- **Not everything is 3D:** product cards, lanes and the story stay photographs, because the owner's real photos earn more trust than models.

## Do's and Don'ts

### Do:

- **Do** keep the black frame (utility bar, header, footer) in both modes, build everything else with the mode tokens so it works in Gading and Noir, and let gold be the only accent.
- **Do** use gold-dark for gold text on light surfaces (`text-gold-accent` does this in Gading).
- **Do** display the owner's product photos matted, as the square crops in `public/products` (made by `scripts/product-photos/make.py`). They keep the "STATION PERFUME" title and the bottles and stop above the name banner, which can carry another brand's text; the product name is set in the site's own type below the photo.
- **Do** keep all corners at 0px, except the functional circles listed in Shapes.
- **Do** use slow, calm motion: reveals take about 1.1s with an ease-out curve, and every animation stops under `prefers-reduced-motion`.

### Don't:

- **Don't** use arched frames or arch shapes. The owner rejected them in v2.
- **Don't** copy another brand's look, logo, or copy (the owner rejected the Creed-like v3).
- **Don't** use pastel or terracotta-and-sage palettes as the main colors. The owner said v4 was not elegant.
- **Don't** show another perfume brand's name, logo, or bottle anywhere in the UI.
- **Don't** use plain gold (#c8a15a) for text on cream or paper.
- **Don't** put a small uppercase label (eyebrow/kicker) above a heading. Prototype v5 had these, but the impeccable craft floor bans them: the heading carries itself.
- **Don't** tint dark surfaces brown or use brown-grey text on black.
- **Don't** hard-code light or dark colors in a component that should follow the mode.
- **Don't** redraw the logo, set "Station Parfume" in another typeface as a replacement logo, or use the old spelling "Station Perfume".
