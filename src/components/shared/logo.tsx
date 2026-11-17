import Image from "next/image";
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
// brush), "light" on cream or paper (original black and pink).
type LogoProps = {
  variant?: "lockup" | "badge";
  tone?: "dark" | "light";
  // Load right away (for the header, which is visible on first open).
  eager?: boolean;
  className?: string;
};

export default function Logo({
  variant = "lockup",
  tone = "dark",
  eager = false,
  className,
}: LogoProps) {
  const loading = eager ? "eager" : "lazy";

  if (variant === "badge") {
    return (
      <Link
        href="/"
        aria-label="Station Parfume, beranda"
        className={cn("inline-block w-48", className)}
      >
        <Image
          src={tone === "dark" ? logoDark : logoLight}
          alt=""
          loading={loading}
          sizes="(min-width: 980px) 240px, 192px"
          className="h-auto w-full"
        />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      aria-label="Station Parfume, beranda"
      className={cn("inline-flex h-16 items-center gap-[0.6em]", className)}
    >
      <Image
        src={tone === "dark" ? sprigDark : sprigLight}
        alt=""
        loading={loading}
        sizes="64px"
        className="h-full w-auto"
      />
      <Image
        src={tone === "dark" ? wordmarkDark : wordmarkLight}
        alt=""
        loading={loading}
        sizes="160px"
        className="h-[68%] w-auto"
      />
    </Link>
  );
}
