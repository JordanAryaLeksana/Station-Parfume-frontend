# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Local buyers in Karawang and nearby areas.** They order online, and the order is shipped to them by courier.
- **Online buyers across Indonesia.** They don't know the shop yet and come in through search, social media, or WhatsApp.
- **Existing Shopee customers.** We invite them to buy directly on this website.

Their job: find a scent they like, choose its size and blend, pay, and receive the perfume.

Not measured yet: which devices visitors use. Treat phones as the main screen (mobile-first), since most visitors come from Shopee and WhatsApp.

## Product Purpose

This is the online shop of Station Parfume, a perfume-blending atelier ("atelier racik") in Karawang. The buyer:

1. Chooses a scent.
2. Chooses a size (20, 30, or 50 ml).
3. Chooses a blend: **murni** (pure perfume oil, "bibit") or **campur** (oil mixed with perfume solvent).
4. Pays through DOKU.

Station Parfume then blends the perfume and ships it.

This website is also a requirement for the payment gateway (DOKU) to approve the shop, so the info and legal pages are mandatory.

Success means:

- Buyers can find a scent and understand the per-ml price.
- Buyers can finish paying without having to chat first.
- Shopee customers start buying through the website.

## Positioning

- **Blended after the order is placed.** Nothing comes from old stock in a warehouse.
- **Transparent per-ml pricing.** Price = rate per ml × size + bottle Rp5.000,00. Prices start at Rp35.000,00.
- **Free choice.** The buyer picks the size and the blend: murni (bibit) or campur (parfum).
- **Internal fact:** many scents are inspired by famous perfumes (the `inspired_by` column in the backend). This is **never** written or shown on the website, not as text, comparisons, or brand names.

## Operating Context

- **Online only.** There is no physical store for buyers to visit. Perfumes are blended in Karawang.
- **Backend.** A separate Go API (the `Station-parfume-backend` repo). Its contract is in `api/openapi.yaml` in that repo, and at `http://localhost:8080/docs` while the backend is running.
- **Payment.** DOKU Checkout (QRIS, virtual account, e-wallet). The buyer returns to the website, and the payment result comes from polling the order status.
- **Shipping.** The backend always sends a shipping fee of Rp0. The admin confirms the shipping cost over WhatsApp after the order is created.
- **WhatsApp** is the main channel for questions to the blender.
- **Admin panel** comes later. It is not part of this website yet.

## Capabilities and Constraints

**Catalog**

- 53 active perfume products and 84 scents (variants).
- 13 aroma families (`note`): amber, aromatic, balsamic, citrus, creamy, floral, fresh, fruity, musk, oud, powdery, sweet, woody.
- Two grades: regular and exclusive.
- General (non-perfume) products: car perfume, souvenirs, spray bottles.

**Variants and pricing**

- One product photo can contain 2–4 variants (22 products are like this). On the website, each of these is one product with variant options.
- Variant = scent × size × blend. The price per variant comes from the API.

**Accounts**

- The backend requires buyers to log in before using the bag (cart). Login is by email/password or Google.

**Language**

- Indonesian, currency Rupiah.
- Key terms:
  - "racik" (to blend)
  - "murni (bibit)" (pure perfume oil)
  - "campur (parfum)" (oil mixed with solvent)
  - "tas" (the bag; don't use "keranjang", the usual word for cart)
  - "nota racik" (the blend receipt)

**Not decided yet (must be settled before launch)**

- Product names that contain designer brands. The owner will rename them.
- Removing `inspired_by` from the backend's public responses.
- Product posters that still read "STATION PERFUME" need updating to the official spelling.
- A new bottle label (proposal) or the current pink sticker.
- Contact details: WhatsApp number, email, opening hours.

## Brand Commitments

- **Name.** **Station Parfume** (final spelling, confirmed by the owner and matching the logo). Older posters and bottle stickers still read "Station Perfume"; that is the old spelling, not to be copied.
- **Founded 2010.** The logo carries "EST 2010". The website may say, for example, "Meracik sejak 2010".
- **Tagline.** "Pure Nature" (on the logo) may be used as a slogan.
- **Logo.** The official logo is the owner's (`src/assets/brand/logo-original.webp`): a black sprig, the text "STATION / PAR / FUME" with "EST 2010", a thin circle, "PURE NATURE", and a pink brush stroke. Don't redraw it or swap in another font; the website uses versions cut from this file (see DESIGN.md).
- **Voice.** Warm and polite, and addresses the buyer as "kamu". Explains blending terms simply.
- **Visual direction.** The owner chose it through prototype v5, then approved a light and a dark mode (Gading and Noir) on 2026-11-18 (see DESIGN.md).
- **No other brands.** Never show another perfume brand (name, logo, or bottle) on the website.

## Evidence on Hand

- **Owner's product posters.** Stored in `~/Documents/gambar-parfum`, outside this repo.
  - All posters use one bottle composition; only the background color and the product name change.
  - Some posters contain another brand's text or bottle (for example Black Opium) and must not be used as they are.
  - The 4 new Exclusive photos are not in that folder yet.
- **Logo.** The original file is `src/assets/brand/logo-original.webp`, with light and dark versions in the same folder.
- **Catalog data.** `seed/wangian.csv` in the backend repo.
- **Not available yet:** testimonials, reviews, sales figures, certifications, or press coverage. Do not make any of them up.

## Product Principles

1. **Buyers can always work out the price.** Show the per-ml formula and the nota racik, with no hidden costs. Shipping is explained separately.
2. **Honest product.** Only true photos, names, and claims. Never mention another brand.
3. **Blending is the story.** Every page reinforces that the perfume is blended after the order is placed.
4. **Quick from a phone.** WhatsApp is always one tap away.
5. **Plain Indonesian**, easy for a first-time online shopper to understand.

## Accessibility & Inclusion

- Target WCAG 2.2 AA:
  - Text contrast at least 4.5:1.
  - Focus is always visible.
  - Every flow works with a keyboard.
- Light and dark mode (Gading and Noir). The first visit follows the device setting (`prefers-color-scheme`), and the buyer's own choice is remembered. Both modes meet the contrast targets.
- Respect `prefers-reduced-motion`. Animations stop, and 3D is replaced by a still image.
- Don't depend on WebGL. Every 3D element has a fallback view.
