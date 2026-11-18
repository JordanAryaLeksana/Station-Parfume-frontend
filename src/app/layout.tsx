import type { Metadata, Viewport } from "next";

import SiteFooter from "@/components/shared/site-footer";
import SiteHeader from "@/components/shared/site-header";
import UtilityBar from "@/components/shared/utility-bar";
import WhatsAppButton from "@/components/shared/whatsapp-button";
import { monoFont, primaryFont, secondaryFont } from "@/lib/fonts";
import { themeScript } from "@/lib/theme";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Station Parfume", template: "%s · Station Parfume" },
  description:
    "Parfum diracik per ml, ukuran 20/30/50 ml, murni atau campur, diracik setelah dipesan di Karawang",
};


export const viewport: Viewport = {
  themeColor: "#0a0a09",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={[
        primaryFont.variable,
        secondaryFont.variable,
        monoFont.variable,
        "h-full antialiased",
      ].join(" ")}
    >
      <head>
        {/* Sets light or dark mode before anything is drawn (no flash). */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <Providers>
          {/* First thing a keyboard user reaches: jump past the menus. */}
          <a
            href="#konten"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-60 focus:bg-gold focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-ink"
          >
            Langsung ke konten
          </a>
          <UtilityBar />
          <SiteHeader />
          <main
            id="konten"
            tabIndex={-1}
            className="flex flex-1 flex-col outline-none"
          >
            {children}
          </main>
          <SiteFooter />
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
