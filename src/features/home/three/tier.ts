export type Tier = "high" | "medium" | "low";

export const DPR: Record<Tier, [number, number]> = {
  high: [1, 1.5],
  medium: [1, 1.5],
  low: [1, 1],
};

export function initialTier(): Tier {
  const memory = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory;
  const cores = navigator.hardwareConcurrency ?? 8;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  if ((memory !== undefined && memory <= 2) || cores <= 2) return "low";
  if (coarse || cores <= 4 || (memory !== undefined && memory <= 4)) {
    return "medium";
  }
  return "high";
}

export function lowerTier(tier: Tier): Tier {
  return tier === "high" ? "medium" : "low";
}
