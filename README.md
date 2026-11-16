# Next.js Boilerplate

A starting point for frontend projects that talk to a separate backend API. Data fetching, forms, client state, and sign in are already wired up, and a Storybook guide shows how to use each of them.

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

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open the address `npm run dev` prints. `npm run storybook` opens the guide to the components and patterns.

Sign in needs a real backend, so set `NEXT_PUBLIC_API_BASE_URL` first. Without it, requests go to this app's own `/api` routes.

## Environment

| Variable                   | Purpose                                                     |
| -------------------------- | ----------------------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL of the backend API, without a trailing slash       |
| `NEXT_PUBLIC_CLIENT_CODE`  | Optional. Sent to the backend as the `X-Client-Code` header |

Variables are checked in `src/lib/env.ts`. A wrong value stops the build with a message that names the variable.

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
src/features/<feature>  feature logic and components
src/components/ui       UI primitives (shadcn/ui), each with its stories
src/components/shared   shared UI compositions, each with its stories
src/lib                 shared infrastructure (Axios, query client, env, fonts)
docs                    guides shown in Storybook, with their live examples
.storybook              Storybook configuration
scripts/auth-check      mock backend and checks behind `npm run test:auth`
```

## Component guide

`npm run storybook` opens Storybook. It has two parts:

- **Guides** (`docs/*.mdx`): how to build a form, fetch data, share client state, and use the signed-in user. Live examples are in `docs/*.stories.tsx`.
- **Components**: one page per component in `src/components`, built from the `<name>.stories.tsx` file next to it.

A new component gets a stories file; copy `src/components/ui/button.stories.tsx`. Stories cover components that render from their props. Components that call the backend are checked in the running app, because Storybook has no backend.

Storybook runs on Vite, not on Next.js. It loads Tailwind through `@tailwindcss/vite` (`.storybook/main.ts`) and the fonts and global styles through `.storybook/preview.ts`, so both follow `src/lib/fonts.ts` and `src/app/globals.css`.

## Data fetching

Each feature keeps its server communication in `src/features/<feature>/api.ts`. Every endpoint has a request function, query options (for queries), and a hook. Pages and components use the hook and do not import TanStack Query themselves.

The Data Fetching guide in Storybook (`docs/data-fetching.mdx`) shows a query and a mutation in full. `src/features/auth/api.ts` is the same pattern in running code. Once a project has its own features, those are the examples to copy.

## Sign in

- The browser never stores tokens. Both tokens live in an httpOnly cookie managed by `src/app/api/auth/[action]/route.ts`; the browser keeps a copy of the access token in memory only.
- `apiClient` attaches the access token and renews it once when the backend answers 401.
- Email and password sign in and OAuth 2.0 (Google, run by the backend) are supported.
- `src/proxy.ts` decides which pages need a session.

Everything specific to one backend is in the "Backend Contract" section of `src/features/auth/session.ts`. To use another backend, change that section and mirror it in `scripts/auth-check/mock-backend.mjs`.

What the backend has to provide:

- This app's origin allowed in CORS, with the `Authorization` and `Content-Type` headers.
- This server trusted as a proxy, so the `X-Forwarded-For` header it passes on is used for rate limits.
- Its OAuth redirect pointing at `/oauth-success`.

Deploy this app behind a reverse proxy that sets `X-Forwarded-For`. Exposed directly, a client could send a fake address in that header.

## Starting a project from this boilerplate

The `new-project` skill (`.agents/skills/new-project`) lists the steps: rename, connect the backend, choose protected pages, and set the design direction.

## Working with coding agents

- `AGENTS.md` holds the project rules.
- `.agents/skills` holds the skills, linked into `.claude/skills` for Claude Code: `feature-development`, `new-project`, `impeccable` (design), and `playwright-cli` (browser checks).
- `.mcp.json` and `.codex/config.toml` configure the MCP servers: Next.js DevTools, shadcn, and Context7.
- `playwright-cli` is a global tool: `npm install -g @playwright/cli`.
