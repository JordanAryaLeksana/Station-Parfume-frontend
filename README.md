# Station Parfume · Frontend

Built by Jordan, aiming to make my mom happy.

This is the online shop of **Station Parfume**, a perfume blending atelier in Karawang. Buyers pick a scent, a size (20, 30, or 50 ml), and a blend: _murni_ (pure perfume oil) or _campur_ (perfume oil mixed with solvent). Each bottle is blended after the order is paid.

- Product context: [`PRODUCT.md`](PRODUCT.md)
- Visual design system: [`DESIGN.md`](DESIGN.md), with token and component data in `.impeccable/design.json`
- The backend is a separate Go API in the `Station-parfume-backend` repository. Its contract is `api/openapi.yaml` in that repository, also served at `http://localhost:8080/docs` while the backend runs.

## Stack

- Next.js 16 (App Router, Turbopack) and React 19
- TypeScript, Tailwind CSS 4, shadcn/ui
- TanStack Query for server state, Axios for HTTP
- React Hook Form and Zod for forms
- Zustand for client state
- Storybook for the component guide

## Requirements

- Node.js 22.18 or newer
- npm
- The Station Parfume backend running locally (see that repository for database setup)

## Getting started

1. Start the backend first (its default address is `http://localhost:8080`). In the backend folder:

   ```bash
   docker compose up -d                  # PostgreSQL on 5433, Redis on 6380
   go run ./cmd/migrate up && go run ./seed
   go run .                              # the API; keep it running
   ```

   The seed is an upsert, so running it again is safe. In the backend `.env`, `CORS_ALLOWED_ORIGINS` must list the address this app runs on, e.g. `http://localhost:3000,http://localhost:3001` (Next.js moves to 3001 when 3000 is taken). The catalog pages fetch on the server and don't need CORS, but the bag and sign-in do.

2. Install dependencies and create the local env file:

   ```bash
   npm install
   cp .env.example .env.local
   ```

3. Fill in `.env.local` (see Environment below), then start the dev server:

   ```bash
   npm run dev
   ```

Open `http://localhost:3000` (or the port `npm run dev` prints). `npm run storybook` opens the guide to the components and patterns.

## Environment

| Variable                      | Purpose                                                                                                                          |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL`    | Base URL of the backend API, without a trailing slash, e.g. `http://localhost:8080/api/v1`                                       |
| `NEXT_PUBLIC_CLIENT_CODE`     | Keep empty. The Station Parfume backend does not allow the `X-Client-Code` header in CORS, so setting it breaks every request    |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | The shop's WhatsApp number in international format without `+` or spaces, e.g. `6281234567890`. Empty hides the WhatsApp buttons |

Variables are checked in `src/lib/env.ts`. A wrong value stops the build with a message that names the variable. Restart `npm run dev` after changing `.env.local`.

## Scripts

| Command                   | What it does                                            |
| ------------------------- | ------------------------------------------------------- |
| `npm run dev`             | Start the dev server                                    |
| `npm run build`           | Production build                                        |
| `npm run lint`            | ESLint                                                  |
| `npm run typecheck`       | Generate route types, then run TypeScript               |
| `npm run format`          | Format with Prettier                                    |
| `npm run format:check`    | Check formatting                                        |
| `npm run test:auth`       | Check sign in against a mock backend (stop `dev` first) |
| `npm run storybook`       | Open the component guide on port 6006                   |
| `npm run build-storybook` | Build the guide into `storybook-static`                 |

CI runs every check and both builds on every push to `main` and on pull requests (`.github/workflows/ci.yml`).

## Structure

```
src/app                 routes, layouts, and page composition
src/features/<feature>  feature logic and components (auth, catalog, ...)
src/components/ui       UI primitives (shadcn/ui), each with its stories
src/components/shared   shared UI compositions, each with its stories
src/lib                 shared infrastructure (Axios, query client, env, fonts, WhatsApp link)
docs                    guides shown in Storybook, with their live examples
.storybook              Storybook configuration
.impeccable             design system data used by the impeccable skill
scripts/auth-check      mock backend and checks behind `npm run test:auth`
scripts/product-photos  cuts the owner's product posters into the images in public/products
public/products         product photos: <slug>-card.jpg and <slug>-detail.jpg
```

## Roadmap

The storefront is built in six stages:

1. **Foundation**: identity, fonts and colors, light and dark modes, PRODUCT.md and DESIGN.md, and the site shell (header, footer, WhatsApp button). _Done._
2. **Catalog**: home page, `/koleksi` with filters (aroma, grade, category, search), and `/produk/[slug]` with scent, size, and blend choices. _In progress._
3. **Account and bag**: sign in and sign up, and the bag. Buyers sign in before using the bag.
4. **Checkout and orders**: shipping address, DOKU payment, `/pesanan`, and payment status. Shipping cost is confirmed over WhatsApp.
5. **Info pages and SEO**: about, contact, FAQ, shipping, returns, terms, and privacy pages, plus the sitemap and metadata.
6. **3D hero**: the Station bottle in Three.js, with a still-image fallback.

## Component guide

`npm run storybook` opens Storybook. It has two parts:

- **Guides** (`docs/*.mdx`): how to build a form, fetch data, share client state, and use the signed-in user. Live examples are in `docs/*.stories.tsx`.
- **Components**: one page per component in `src/components`, built from the `<name>.stories.tsx` file next to it.

A new component gets a stories file; copy `src/components/ui/button.stories.tsx`. Stories cover components that render from their props. Components that call the backend are checked in the running app, because Storybook has no backend.

Storybook runs on Vite, not on Next.js. It loads Tailwind through `@tailwindcss/vite` (`.storybook/main.ts`) and the fonts and global styles through `.storybook/preview.ts`, so both follow `src/lib/fonts.ts` and `src/app/globals.css`.

## Product photos

The backend has no product images yet, so the site uses images cut from the owner's posters, in `public/products`:

- `<slug>-card.jpg`: square, the title and the bottles on the tray. Used on product cards and as the first gallery image.
- `<slug>-detail.jpg`: square close-up of the bottles. Used for the card hover and in the gallery.

`src/features/catalog/product-photos.ts` lists which products have photos. The others (the general products for now) show a placeholder.

The cut deliberately stops above the poster's coloured name band and stays in the middle. On about half of the posters the edges and the band show another brand's bottle and an "Inspired by ..." caption, and other brands must never appear on the site. The raw posters are not kept in this repository (`src/assets/gambar-parfum/` is ignored by git for the same reason).

When the owner sends new posters, cut them again (needs Python 3 with Pillow):

```bash
python3 -I scripts/product-photos/make.py ../Station-parfume-backend/seed/wangian.csv ~/Documents/gambar-parfum public/products
```

Then check the images and update the slug list in `product-photos.ts` from the script's output. Once photos are uploaded through the admin panel, the API returns `image_url`, and the site should prefer it over these files.

## Data fetching

Each feature keeps its server communication in `src/features/<feature>/api.ts`. Every endpoint has a request function, query options (for queries), and a hook. Pages and components use the hook and do not import TanStack Query themselves.

The Data Fetching guide in Storybook (`docs/data-fetching.mdx`) shows a query and a mutation in full. `src/features/auth/api.ts` is the same pattern in running code.

## Sign in

- The browser never stores tokens. Both tokens live in an httpOnly cookie managed by `src/app/api/auth/[action]/route.ts`; the browser keeps a copy of the access token in memory only.
- `apiClient` attaches the access token and renews it once when the backend answers 401.
- Email and password sign in and OAuth 2.0 (Google, run by the backend) are supported.
- `src/proxy.ts` decides which pages need a session.

Everything specific to the backend is in the "Backend Contract" section of `src/features/auth/session.ts`, mirrored in `scripts/auth-check/mock-backend.mjs`.

What the backend has to provide (all already supported by the Station Parfume backend):

- This app's origin allowed in CORS (`FRONTEND_URL` or `CORS_ALLOWED_ORIGINS`), with the `Authorization` and `Content-Type` headers.
- This server trusted as a proxy (`TRUSTED_PROXIES`), so the `X-Forwarded-For` header it passes on is used for rate limits.
- Its Google OAuth flow redirecting to `FRONTEND_URL/oauth-success`.

Deploy this app behind a reverse proxy that sets `X-Forwarded-For`. Exposed directly, a client could send a fake address in that header.

## Working with coding agents

- `AGENTS.md` holds the project rules. `PRODUCT.md` and `DESIGN.md` are the source of truth for product and visual decisions.
- `.agents/skills` holds the skills, linked into `.claude/skills` for Claude Code: `feature-development`, `new-project`, `impeccable` (design), and `playwright-cli` (browser checks).
- `.mcp.json` and `.codex/config.toml` configure the MCP servers: Next.js DevTools, shadcn, and Context7.
- `playwright-cli` is a global tool: `npm install -g @playwright/cli`.
