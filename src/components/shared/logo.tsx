import type { ComponentProps } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { cn } from "cn";

import logoDark from "@/assets/brand/logo-dark.png";
import logoLight from "@/assets/brand/logo-light.png";
import sprigDark from "@/assets/brand/sprig-dark.png";
import sprigLight from "@/assets/brand/sprig-light.png";
import wordmarkDark from "@/assets/brand/wordmark-dark.png";
import wordmarkLight from "@/assets/brand/wordmark-light.png";

// The owner's official logo (source: src/assets/brand/logo-original.webp).
// - `lockup`: the sprig + the "STATION PAR FUME" text without the circle. For
//   places with limited height (header), so the text stays readable.
// - `badge`: the full round logo (circle, sprig, text, Pure Nature). For
//   places with room (footer, about page).
// `tone` follows the background: "dark" on black (cream lines, a faint gold
// brush), "light" on cream or paper (original black and pink), "auto" picks
// the one for the current color mode (for surfaces that follow the mode, like
// the phone menu).
// Other props (onClick, aria-label, ...) go to the link, so the logo can sit
// inside <SheetClose asChild>.
type LogoProps = Omit<ComponentProps<typeof Link>, "href" | "children"> & {
  variant?: "lockup" | "badge";
  tone?: "dark" | "light" | "auto";
  // Load right away (for the header, which is visible on first open).
  eager?: boolean;
};

type Tone = "dark" | "light";

const IMAGES: Record<
  Tone,
  { badge: StaticImageData; sprig: StaticImageData; wordmark: StaticImageData }
> = {
  dark: { badge: logoDark, sprig: sprigDark, wordmark: wordmarkDark },
  light: { badge: logoLight, sprig: sprigLight, wordmark: wordmarkLight },
};

export default function Logo({
  variant = "lockup",
  tone = "dark",
  eager = false,
  className,
  ...props
}: LogoProps) {
  const loading = eager ? "eager" : "lazy";
  // With "auto", both versions are drawn and CSS shows the one for the mode.
  const tones: Tone[] = tone === "auto" ? ["light", "dark"] : [tone];
  const showFor = (t: Tone) =>
    tone !== "auto" ? "" : t === "light" ? "dark:hidden" : "hidden dark:block";

  if (variant === "badge") {
    return (
      <Link
        href="/"
        aria-label="Station Parfume, beranda"
        className={cn("inline-block w-48", className)}
        {...props}
      >
        {tones.map((t) => (
          <Image
            key={t}
            src={IMAGES[t].badge}
            alt=""
            loading={loading}
            sizes="(min-width: 980px) 240px, 192px"
            className={cn("h-auto w-full", showFor(t))}
          />
        ))}
      </Link>
    );
  }

  return (
    <Link
      href="/"
      aria-label="Station Parfume, beranda"
      className={cn("inline-flex h-16 items-center gap-[0.6em]", className)}
      {...props}
    >
      {tones.map((t) => [
        <Image
          key={`${t}-sprig`}
          src={IMAGES[t].sprig}
          alt=""
          loading={loading}
          sizes="64px"
          className={cn("h-full w-auto", showFor(t))}
        />,
        <Image
          key={`${t}-wordmark`}
          src={IMAGES[t].wordmark}
          alt=""
          loading={loading}
          sizes="160px"
          className={cn("h-[68%] w-auto", showFor(t))}
        />,
      ])}
    </Link>
  );
}
