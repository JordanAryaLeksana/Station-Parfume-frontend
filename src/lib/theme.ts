export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

// Runs in the browser as text (themeScript), before React. It must not use
// anything from outside its own body, so the key comes in as a parameter.
function initTheme(storageKey: string): void {
  let saved: string | null = null;
  try {
    saved = window.localStorage.getItem(storageKey);
  } catch {
    // Storage blocked (e.g. private mode): use the device setting. No log
    // here, because this runs on every page load.
  }

  const dark =
    saved === "light" || saved === "dark"
      ? saved === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;

  document.documentElement.classList.toggle("dark", dark);
}

export const themeScript = `(${initTheme.toString()})(${JSON.stringify(THEME_STORAGE_KEY)})`;

export function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    if (error instanceof DOMException) {
      console.warn(`Mode tidak tersimpan (${error.name}): ${error.message}`);
    } else {
      console.warn("Mode tidak tersimpan:", error);
    }
  }
}
