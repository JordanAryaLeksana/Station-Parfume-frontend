import { z } from "zod";

// Environment
// Checked once, when this module first loads. A wrong value stops the build or
// the dev server with a message that names the variable. Add new variables
// here and to .env.example.
const schema = z.object({
  // Base URL of the backend API. Unset means requests go to this app's own
  // /api routes.
  NEXT_PUBLIC_API_BASE_URL: z
    .string()
    .regex(
      /^https?:\/\/.*[^/]$/,
      "must be an absolute http(s) URL without a trailing slash",
    )
    .optional(),

  // Optional. Sent to the backend as the X-Client-Code header.
  NEXT_PUBLIC_CLIENT_CODE: z.string().optional(),

  NEXT_PUBLIC_WHATSAPP_NUMBER: z
    .string()
    .regex(
      /^62\d{8,13}$/,
      "must be a number in international format without + or spaces, e.g. 6281234567890.",
    )
    .optional(),
});

// NEXT_PUBLIC_* values are inlined at build time, so each one is read by its
// full name. An empty value counts as unset.
const parsed = schema.safeParse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || undefined,
  NEXT_PUBLIC_CLIENT_CODE: process.env.NEXT_PUBLIC_CLIENT_CODE || undefined,
  NEXT_PUBLIC_WHATSAPP_NUMBER:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || undefined,
});

if (!parsed.success) {
  throw new Error(
    `Invalid environment variables:\n${z.prettifyError(parsed.error)}`,
  );
}

export const env = parsed.data;
