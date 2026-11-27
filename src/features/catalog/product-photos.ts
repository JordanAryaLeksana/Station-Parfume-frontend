// The poster crops in public/products: <poster>-card.jpg and
// <poster>-detail.jpg, named after the slug of one perfume that uses them.
const POSTERS = new Set([
  "1000-bunga",
  "2000-bunga",
  "abu-pinus",
  "biru-lada",
  "biru-mint",
  "coklat-hazelnut",
  "coklat-kayu",
  "coklat-kopi",
  "coklat-praline",
  "cuddle",
  "dancing-lady",
  "emas-ambar",
  "emas-kasturi",
  "emas-saffron",
  "exclusive-1",
  "exclusive-2",
  "exclusive-3",
  "exclusive-4",
  "hijau-bergamot",
  "hijau-kemangi",
  "hijau-lemon",
  "hijau-melon",
  "hijau-rumput-laut",
  "jingga-aprikot",
  "jingga-markisa",
  "jingga-nanas",
  "kasturi",
  "kuning-jahe",
  "kuning-lemon",
  "kuning-persik",
  "lavender",
  "malaikat-subuh",
  "mawar-keraton",
  "melati-keraton",
  "merah-apel",
  "merah-beri",
  "merah-jeruk-bali",
  "merah-muda-lili",
  "merah-muda-peoni",
  "merah-muda-raspberry",
  "putih-peoni",
  "putih-pir",
  "putih-sedap-malam",
  "putih-teh",
  "sabaya",
  "silver",
  "soft",
  "strawberry",
  "sulthan",
  "ungu-beri",
  "ungu-cendana",
  "ungu-ceri",
  "vanilla",
]);

// Since 20 Nov 2026 every perfume is its own product, but until the owner's
// photo per perfume arrives (from the CDN, as image_url) it shows the poster
// it used to share with its group: Kasturi Kijang and Kasturi Putih both use
// "kasturi". Slugs with the same name as their poster (e.g. "sulthan") are
// not listed.
const POSTER_OF: Partial<Record<string, string>> = {
  "abu-lada": "exclusive-1",
  "biru-nanas": "biru-mint",
  "c2-premiere-man": "exclusive-4",
  "d-g-paris": "kuning-lemon",
  "emas-almond": "exclusive-2",
  greekgodnes: "exclusive-3",
  "hijau-blackcurrant": "coklat-praline",
  "hijau-timun": "coklat-praline",
  "j-lo-c": "putih-teh",
  "jingga-leci": "exclusive-2",
  "jingga-mandarin": "hijau-melon",
  "jingga-melon": "jingga-aprikot",
  "kasturi-kijang": "kasturi",
  "kasturi-putih": "kasturi",
  "kuning-bergamot": "hijau-rumput-laut",
  "kuning-kapulaga": "hijau-kemangi",
  "kuning-mandarin": "abu-pinus",
  "kuning-markisa": "jingga-nanas",
  "merah-muda-apel": "merah-beri",
  "merah-muda-marshmallow": "merah-beri",
  "merah-muda-persik": "jingga-aprikot",
  "merah-praline": "exclusive-1",
  "merah-raspberry": "merah-beri",
  "merah-teratai": "exclusive-4",
  moonlight: "exclusive-3",
  "mykonos-monaco-royal": "exclusive-2",
  "opus-black": "exclusive-3",
  "putih-bedak": "jingga-markisa",
  "putih-freesia": "exclusive-1",
  "putih-kemuning": "kuning-persik",
  "putih-melati": "kuning-jahe",
  "putih-teratai": "hijau-rumput-laut",
  "ungu-anggrek": "emas-kasturi",
  "ungu-blackcurrant": "putih-sedap-malam",
  "vanilla-coconut": "vanilla",
  "vanilla-ice": "vanilla",
  "vanilla-popcorn": "vanilla",
};

export type ProductPhotos = {
  card: string;

  detail: string;
};

export function getProductPhotos(slug: string): ProductPhotos | null {
  const poster = POSTER_OF[slug] ?? slug;
  if (!POSTERS.has(poster)) return null;
  return {
    card: `/products/${poster}-card.jpg`,
    detail: `/products/${poster}-detail.jpg`,
  };
}
