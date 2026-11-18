// Needs clicks and reads <html>, so it is a Client Component.
"use client";

import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { cn } from "cn";

import { applyTheme } from "@/lib/theme";

// The sun/moon button that switches light mode (Gading) and dark mode (Noir).
// The mode lives in one place: the `dark` class on <html>. This button only
// reads that class and changes it, so two buttons (header and phone menu)
// always agree.

// React calls this once. The MutationObserver tells React whenever the class
// on <html> changes: from this button, the other one, or the theme script.
// These three functions sit outside the component so they stay the same
// between renders; otherwise React would subscribe again on every render.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

// The current value in the browser.
const getSnapshot = () => document.documentElement.classList.contains("dark");

// The value while rendering on the server, which doesn't know the mode.
// React then switches to the real value right after the page loads.
const getServerSnapshot = () => false;

export default function ThemeToggle({ className }: { className?: string }) {
  const isDark = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return (
    <button
      type="button"
      // A fixed label plus aria-pressed: screen readers say "Mode gelap,
      // toggle button, pressed" or "not pressed".
      aria-label="Mode gelap"
      aria-pressed={isDark}
      onClick={() => applyTheme(isDark ? "light" : "dark")}
      className={cn(
        "inline-flex size-11 items-center justify-center transition-colors",
        className,
      )}
    >
      {isDark ? (
        <SunIcon aria-hidden className="size-4.5" strokeWidth={1.25} />
      ) : (
        <MoonIcon aria-hidden className="size-4.5" strokeWidth={1.25} />
      )}
    </button>
  );
}
