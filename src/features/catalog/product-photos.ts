const WITH_PHOTO = new Set([
  "1000-bunga",
  "2000-bunga",
  "aigner",
  "angelina-jolie",
  "annasui",
  "avril-lavigne",
  "bacarat",
  "black-opium",
  "burberies",
  "bvlgari",
  "cuddle",
  "d-g",
  "dancing-lady",
  "davidoff",
  "dior-sauvage",
  "escada",
  "exclusive-1",
  "exclusive-2",
  "exclusive-3",
  "exclusive-4",
  "giorgio",
  "harajuku-love",
  "incanto",
  "j-lo",
  "jaguar",
  "jessica",
  "joyrose",
  "kasturi",
  "kenzo",
  "lavender",
  "lovely",
  "maher-zein",
  "malaikat-subuh",
  "manchester-city",
  "mawar-keraton",
  "melati-keraton",
  "midnight-fantasy",
  "miss-dior-blooming",
  "olla-ramlan",
  "one-direction",
  "paris-hilton",
  "pink-chiffon",
  "sabaya",
  "selena-gomes",
  "silver",
  "so-sexy",
  "soft",
  "strawberry",
  "sulthan",
  "taylor-swift",
  "vanilla",
  "victoria",
  "zara",
]);

export type ProductPhotos = {
  card: string;

  detail: string;
};

export function getProductPhotos(slug: string): ProductPhotos | null {
  if (!WITH_PHOTO.has(slug)) return null;
  return {
    card: `/products/${slug}-card.jpg`,
    detail: `/products/${slug}-detail.jpg`,
  };
}
