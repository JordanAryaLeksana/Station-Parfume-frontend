import { MessageCircleMoreIcon } from "lucide-react";
import { cn } from "cn";

import { whatsappUrl } from "@/lib/whatsapp";

type WhatsAppButtonProps = {
  // The text that opens in WhatsApp. Product pages can pass their own, e.g.
  // "Halo, saya mau tanya soal wangi Kasturi".
  message?: string;
  className?: string;
};

// The floating gold WhatsApp button in the bottom right corner. One of the
// functional circles allowed by DESIGN.md (Shapes).
// Renders nothing when NEXT_PUBLIC_WHATSAPP_NUMBER is not set.
export default function WhatsAppButton({
  message = "Halo Station Parfume, saya mau tanya soal parfum.",
  className,
}: WhatsAppButtonProps) {
  const href = whatsappUrl(message);
  if (!href) return null;

  return (
    // A plain <a>, not next/link: wa.me is another website.
    // rel="noopener noreferrer" stops the new tab from reaching this page
    // through window.opener.
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Tanya peracik lewat WhatsApp (buka di tab baru)"
      className={cn(
        // z-40: below the header and the sheets (z-50), so an open phone
        // menu covers it.
        "fixed right-5 bottom-5 z-40 grid size-15 place-items-center rounded-full bg-gold text-ink shadow-[0_16px_30px_-12px_rgb(0_0_0/0.7)]",
        "transition-transform duration-400 ease-atelier hover:scale-105 motion-reduce:transition-none",
        "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold",
        "min-[980px]:right-6 min-[980px]:bottom-6",
        className,
      )}
    >
      <MessageCircleMoreIcon aria-hidden className="size-6" strokeWidth={1.7} />
    </a>
  );
}
