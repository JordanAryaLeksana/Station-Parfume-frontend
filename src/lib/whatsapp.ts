import { env } from "@/lib/env";
export const whatsappUrl = (message?: string): string | null => {
  const number = env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!number) return null;

  const url = `https://wa.me/${number}`;
  return message ? `${url}?text=${encodeURIComponent(message)}` : url;
};
