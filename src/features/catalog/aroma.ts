export type Aroma = {
  note: string;
  label: string;
  indonesian: string;
  description: string;
  colors: {
    glow: string;
    deep: string;
    light: string;
  };
};

export const AROMAS = [
  {
    note: "sweet",
    label: "Sweet",
    indonesian: "manis",
    description: "Hangat dan manis, seperti gula aren, karamel, dan vanila.",
    colors: { glow: "#f2c49e", deep: "#e09377", light: "#faeada" },
  },
  {
    note: "woody",
    label: "Woody",
    indonesian: "kayu",
    description:
      "Kayu yang hangat dan kering. Tenang, dewasa, dan awet di kulit.",
    colors: { glow: "#cfa171", deep: "#8b5e3c", light: "#eedcc4" },
  },
  {
    note: "fresh",
    label: "Fresh",
    indonesian: "segar",
    description: "Bersih seperti udara pagi. Enak dipakai setiap hari.",
    colors: { glow: "#bcd8cd", deep: "#7fa79c", light: "#eef4ec" },
  },
  {
    note: "musk",
    label: "Musk",
    indonesian: "kasturi",
    description:
      "Lembut seperti kulit yang baru mandi. Melekat dekat, tidak berlebihan.",
    colors: { glow: "#e6d6c6", deep: "#b19a86", light: "#f6f0e8" },
  },
  {
    note: "aromatic",
    label: "Aromatic",
    indonesian: "herbal",
    description: "Daun dan rempah segar. Rapi, bersih, dan menyegarkan.",
    colors: { glow: "#bac49e", deep: "#7a8466", light: "#eef0e1" },
  },
  {
    note: "floral",
    label: "Floral",
    indonesian: "bunga",
    description:
      "Melati, mawar, dan kamboja. Lembut, anggun, dan mudah disukai.",
    colors: { glow: "#f2cdbf", deep: "#de998e", light: "#fbefe7" },
  },
  {
    note: "fruity",
    label: "Fruity",
    indonesian: "buah",
    description: "Buah-buahan yang ceria dan segar.",
    colors: { glow: "#cdb2d3", deep: "#8b79af", light: "#f3e9f0" },
  },
  {
    note: "powdery",
    label: "Powdery",
    indonesian: "bedak",
    description: "Halus seperti bedak. Bersih dan menenangkan.",
    colors: { glow: "#ead5de", deep: "#c6a2b3", light: "#f8f1f3" },
  },
  {
    note: "oud",
    label: "Oud",
    indonesian: "gaharu",
    description:
      "Gaharu yang dalam dan sedikit berasap. Wangi Timur yang mewah.",
    colors: { glow: "#c08a5e", deep: "#6a4129", light: "#e3c6a4" },
  },
  {
    note: "citrus",
    label: "Citrus",
    indonesian: "jeruk",
    description: "Kulit jeruk yang cerah dan menyegarkan.",
    colors: { glow: "#f6d68a", deep: "#e89e4b", light: "#fcf2d9" },
  },
  {
    note: "amber",
    label: "Amber",
    indonesian: "ambar",
    description: "Hangat, sedikit manis, dan menyelimuti.",
    colors: { glow: "#e8ae63", deep: "#a8642f", light: "#f6e0bc" },
  },
  {
    note: "balsamic",
    label: "Balsamic",
    indonesian: "resin",
    description: "Resin dan dupa yang pekat dan hangat.",
    colors: { glow: "#bc8760", deep: "#6e4129", light: "#eacfae" },
  },
  {
    note: "creamy",
    label: "Creamy",
    indonesian: "lembut",
    description: "Lembut seperti santan dan vanila.",
    colors: { glow: "#eeddc4", deep: "#d1b18a", light: "#faf4ea" },
  },
] as const satisfies readonly Aroma[];

export type AromaNote = (typeof AROMAS)[number]["note"];

export function isAromaNote(value: string): value is AromaNote {
  return AROMAS.some((aroma) => aroma.note === value);
}

export function getAroma(note: AromaNote) {
  return AROMAS.find((aroma) => aroma.note === note)!;
}
export function aromaSwatch(aroma: Aroma): string {
  const { light, glow, deep } = aroma.colors;
  return `radial-gradient(circle at 34% 30%, ${light} 0 18%, ${glow} 52%, ${deep})`;
}
