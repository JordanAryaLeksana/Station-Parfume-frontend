import type { Metadata } from "next";

import { monoFont, primaryFont, secondaryFont } from "@/lib/fonts";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Station Parfume", template: "%s · Station Parfume" },
  description:
    "Parfum diracik per ml, ukuran 20/30/50 ml, murni atau campur, diracik setelah dipesan di Karawang",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={[
        primaryFont.variable,
        secondaryFont.variable,
        monoFont.variable,
        "h-full antialiased",
      ].join(" ")}
    >
      <body className="flex min-h-full flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
