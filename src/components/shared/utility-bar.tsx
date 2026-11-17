"use client";

import Link from "next/link";
import React from "react";
import { cn } from "cn";
const DEFAULT_MESSAGES = [
  "Diracik setelah kamu memesan",
  "Ukuran 20, 30, atau 50 ml · mulai Rp35.000",
  "Bayar via QRIS, virtual account, atau e-wallet",
];

type UtilityBarProps = {
  messages?: string[];
  interval?: number;
  className?: string;
};

export default function UtilityBar({
  messages = DEFAULT_MESSAGES,
  interval = 4200,
  className,
}: UtilityBarProps) {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    if (reduceMotion || paused || messages.length < 2) return;

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % messages.length)
    }, interval)


    return () => window.clearInterval(id)
  }, [paused, interval, messages.length])

  const message = messages[index % messages.length] ?? "";
  return (
    <div
      className={cn(
        "bg-ink-2 text-[10px] font-medium tracking-[0.08em] text-cream/75 uppercase min-[980px]:text-[11px] min-[980px]:tracking-[0.16em]",
        className,
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="mx-auto flex h-9 max-w-[330] items-center justify-between gap-5 px-5 min-[980px]:px-10">
        <p className="hidden min-w-[55] min-[980px]:block">
          Pure Nature · Sejak 2010
        </p>

        <div className="flex-1 overflow-hidden text-center text-gold-light">
          <span
            key={index}
            aria-hidden="true"
            className="block animate-in truncate duration-700 fade-in slide-in-from-bottom-1 motion-reduce:animate-none"
          >
            {message}
          </span>
          <ul className="sr-only">
            {messages.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <nav
          aria-label="Bantuan cepat"
          className="hidden min-w-[55] justify-end gap-6 min-[980px]:flex"
        >
          <Link
            href="/pesanan"
            className="transition-colors hover:text-gold-light focus-visible:text-gold-light"
          >
            Lacak pesanan
          </Link>
          <Link
            href="/faq"
            className="transition-colors hover:text-gold-light focus-visible:text-gold-light"
          >
            Bantuan
          </Link>
        </nav>
      </div>
    </div>
  );
}
