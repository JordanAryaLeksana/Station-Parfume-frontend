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
- **"Mirip apa?" goes through WhatsApp.** A buyer looking for a scent like a famous perfume names it in their own WhatsApp message, and the blender answers with the atelier number and a link. The site explains this without naming any brand: on the home page ("Cari yang mirip parfum favoritmu?") and when a search finds nothing. `inspired_by` stays internal, as the blender's lookup.

## Operating Context

- **Online only.** There is no physical store for buyers to visit. Perfumes are blended in Karawang.
- **Backend.** A separate Go API (the `Station-parfume-backend` repo). Its contract is in `api/openapi.yaml` in that repo, and at `http://localhost:8080/docs` while the backend is running.
- **Payment.** DOKU Checkout (QRIS, virtual account, e-wallet). The buyer returns to the website, and the payment result comes from polling the order status.
- **Shipping.** Today the backend sends a shipping fee of Rp0 ("ditanggung toko"), and the admin confirms the delivery over WhatsApp after the order is created. The plan is for the buyer to pay the shipping fee, but the scheme is **on hold** for the owner (since 19 Nov 2026) and must be decided before stage 4 (checkout). DOKU charges the order total that is fixed when the payment is created, so the fee has to be known before the buyer pays. The leading option is a per-province rate table that the owner fills in once.
- **WhatsApp** is the main channel for questions to the blender.
- **Admin panel** comes later. It is not part of this website yet.

## Capabilities and Constraints

**Catalog**

- 84 active perfumes, one product each (since 20 Nov 2026; before, a product was one photo with 2–4 scents).
- 13 aroma families (`note`): amber, aromatic, balsamic, citrus, creamy, floral, fresh, fruity, musk, oud, powdery, sweet, woody.
- Two grades, set per perfume: 73 regular and 11 exclusive. A Regular and an Exclusive perfume may share a name; they are two different perfumes.
- General (non-perfume) products: car perfume, souvenirs, spray bottles, Arabian oils. Some come in several labels (e.g. the twelve car perfume scents, or "1pcs" / "12-60pcs"), the rest in one.

**Variants and pricing**

- A perfume variant = size × blend (one scent per product since 20 Nov 2026), so a perfume with three sizes and two blends has six variants. The buyer picks the size and the blend, and the page shows the per-ml formula and the nota racik.
- A general product variant = a label (or none). The buyer picks the label when there are several, with its own price when the prices differ.
- The price and the stock of every variant come from the API. `available` is the stock left, or null when stock isn't counted. One order line takes at most 20, and never more than the stock.

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

- Product names that contain designer brands. The owner will rename them. An audit on 25 Nov 2026 found 64 of 97 names with another brand's, perfume's, or celebrity's name (misspellings included), and 6 more to check.
- Scent descriptions. All 84 perfumes have an empty description, so the page falls back to the aroma family texts. Without brand names, buyers recognise a scent by its character, so each perfume needs a short description from the blender (what it smells like, the main ingredients, when to wear it). The seed CSV has no description column yet.
- Removing `inspired_by` from the backend's public responses.
- Product posters that still read "STATION PERFUME" need updating to the official spelling.
- A new bottle label (proposal) or the current pink sticker.
- Contact details: WhatsApp number, email, opening hours.
- How long blending and shipping take after payment. The home FAQ says to ask on WhatsApp until then.
- The minimum order and lead time for souvenir pernikahan (the "12-60pcs" label). The home page sends buyers to WhatsApp for now.

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
  - Some posters contain another brand's text or bottle and must not be used as they are.
  - The 4 new Exclusive photos are not in that folder yet.
- **Logo.** The original file is `src/assets/brand/logo-original.webp`, with light and dark versions in the same folder.
- **Catalog data.** `seed/wangian.csv` in the backend repo.
- **Not available yet:** testimonials, reviews, sales figures, certifications, or press coverage. Do not make any of them up.
- **Photos requested from the owner (25 Nov 2026).** The home page has places waiting for real photos (`src/features/home/photos.ts`). Phone photos are fine, in good daylight:
  - the blending table with bottles and bibit, landscape 3:2, at least 2000px wide (story)
  - measuring or pouring bibit, portrait 4:5 (station 03)
  - a labelled bottle and the packaging, 4:5 (station 04)
  - souvenir pernikahan, parfum mobil, reed diffuser, one each, 4:5 (lane tiles)
- **Bottle sizes to confirm with the owner (26 Nov 2026).** The size rack in step 02 of the home journey draws the 20, 30 and 50 ml bottles in proportion to what they hold (the same square bottle scaled), so it shows no centimetres. To make it exact: the height, width and depth of each bottle in cm, and whether all three sizes share the square shape with the gold ball cap.

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
