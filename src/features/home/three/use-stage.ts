import React from "react";

import { initialTier, lowerTier, type Tier } from "./tier";

let webgl: boolean | null = null;

function detectWebgl(): boolean {
  if (webgl !== null) return webgl;
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  if (connection?.saveData) {
    webgl = false;
    return webgl;
  }
  try {
    webgl = Boolean(document.createElement("canvas").getContext("webgl2"));
  } catch {
    webgl = false;
  }
  return webgl;
}

const noSubscription = () => () => {};

export function useWebgl(): boolean | null {
  return React.useSyncExternalStore(noSubscription, detectWebgl, () => null);
}

function subscribeTheme(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

export function useNight(): boolean {
  return React.useSyncExternalStore(
    subscribeTheme,
    () => document.documentElement.classList.contains("dark"),
    () => false,
  );
}

function subscribeMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

export function useReducedMotion(): boolean {
  return React.useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

let tier: Tier | null = null;
const tierListeners = new Set<() => void>();

function readTier(): Tier {
  tier ??= initialTier();
  return tier;
}

function subscribeTier(callback: () => void) {
  tierListeners.add(callback);
  return () => {
    tierListeners.delete(callback);
  };
}

export function lowerSharedTier() {
  const next = lowerTier(readTier());
  if (next === tier) return;
  tier = next;
  for (const listener of tierListeners) listener();
}

export function useTier(): Tier {
  return React.useSyncExternalStore(subscribeTier, readTier, () => "medium");
}

type Idle = (callback: () => void) => number;

function whenIdle(callback: () => void): () => void {
  const idle = (window as Window & { requestIdleCallback?: Idle })
    .requestIdleCallback;
  if (idle) {
    const handle = idle(callback);
    return () => window.cancelIdleCallback(handle);
  }
  const handle = window.setTimeout(callback, 1);
  return () => window.clearTimeout(handle);
}

function afterLoad(callback: () => void): () => void {
  let cancel = () => {};
  const start = () => {
    cancel = whenIdle(callback);
  };
  if (document.readyState === "complete") {
    start();
    return () => cancel();
  }
  window.addEventListener("load", start, { once: true });
  return () => {
    window.removeEventListener("load", start);
    cancel();
  };
}

export function useStageActivity(
  ref: React.RefObject<HTMLElement | null>,
  eager = false,
) {
  const [near, setNear] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [pageVisible, setPageVisible] = React.useState(true);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let cancel = eager ? afterLoad(() => setNear(true)) : () => {};
    const approach = new IntersectionObserver(
      ([entry]) => {
        if (eager || !entry?.isIntersecting) return;
        approach.disconnect();
        cancel = whenIdle(() => setNear(true));
      },
      { rootMargin: "100% 0px" },
    );
    const sight = new IntersectionObserver(([entry]) =>
      setVisible(entry?.isIntersecting ?? false),
    );
    approach.observe(element);
    sight.observe(element);
    const onVisibility = () =>
      setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      approach.disconnect();
      sight.disconnect();
      cancel();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [ref, eager]);

  return { near, active: visible && pageVisible };
}
