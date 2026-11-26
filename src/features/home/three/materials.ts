import * as THREE from "three";

import type { Concentration } from "@/features/catalog/types";
import type { LiquidTone } from "@/features/home/hero-scents";

export const BRASS = { color: "#c9a25d", metalness: 1, roughness: 0.32 };
export const GOLD = { color: "#e3c27e", metalness: 1, roughness: 0.12 };
export const LACQUER = "#121110";

export const LIQUID: Record<LiquidTone, string> = {
  oud: "#8a4413",
  amber: "#b8661f",
  honey: "#d99a38",
  straw: "#e6c45f",
  rose: "#d8a184",
};

const SPIRIT = new THREE.Color("#fff6e0");

function blends(hex: string): Record<Concentration, THREE.Color> {
  const base = new THREE.Color(hex);
  return {
    campur: base.clone().lerp(SPIRIT, 0.22),
    murni: base.clone().multiplyScalar(0.74),
  };
}

export const LIQUID_COLOR: Record<
  LiquidTone,
  Record<Concentration, THREE.Color>
> = {
  oud: blends(LIQUID.oud),
  amber: blends(LIQUID.amber),
  honey: blends(LIQUID.honey),
  straw: blends(LIQUID.straw),
  rose: blends(LIQUID.rose),
};
