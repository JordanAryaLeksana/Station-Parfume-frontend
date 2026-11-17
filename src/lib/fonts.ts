import { Fraunces, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";

export const primaryFont = Fraunces({
  subsets: ["latin"],
  display: "swap",
  // The italic is used for emphasis words and "parfume" in the logo. Without
  // it the browser fakes a slanted italic.
  style: ["normal", "italic"],
  axes: ["SOFT"],
  variable: "--font-primary-loaded",
});

export const secondaryFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-secondary-loaded",
});

export const monoFont = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono-loaded",
});
