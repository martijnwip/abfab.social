# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Tijdgeest (tijdgeestleest.nl) — Modern leesgenootschap / boekenclub webapp. One book a month, read together in small sessions. Dutch-language app; UI copy, DB column names, and commit messages are in Dutch.

## Stack

- **Framework**: Next.js 16 (App Router), in `website/` — the Next.js app is the repo root for development purposes
- **Deployment**: Vercel
- **Database**: Supabase (Postgres + Auth + Storage), accessed via `@supabase/ssr` / `@supabase/supabase-js`
- **AI**: Anthropic SDK (`@anthropic-ai/sdk`), model `claude-sonnet-4-6` — generates book-club scenarios and questions server-side
- **Email**: Resend, transactional emails with hand-written inline-styled HTML templates
- **Components**: Radix Primitives (`@radix-ui/react-*`) wrapped in `website/components/ui/`
- **Styling**: Tailwind CSS v4 — brand tokens (colors, fonts, tracking) defined in `website/app/globals.css` via `@theme`
- **Language**: TypeScript

Book cover images are served from Supabase Storage (bucket `covers`) or hotlinked from `images.unsplash.com` / `covers.openlibrary.org`; allowed remote image hosts are whitelisted in `website/next.config.ts`.

## Development

```bash
cd website
npm run dev      # dev server (Turbopack)
npm run build    # production build
npm run start    # serve production build
npm run lint     # eslint
```

There is no test suite configured in this repo.

Supabase (from repo root, `supabase/` directory):
```bash
supabase db push        # apply migrations in supabase/migrations/
supabase db reset       # reset local DB and re-run seed.sql
```

## Architecture

### Next.js 16 breaking changes

This repo pins Next.js 16, which has API/convention changes from what training data assumes. Before writing routing or middleware-adjacent code, check `website/node_modules/next/dist/docs/` for the current API (see `website/AGENTS.md`).

Notably: **`website/proxy.ts` replaces `middleware.ts`** — the exported function is named `proxy`, not `middleware`, but otherwise follows the familiar matcher/`NextResponse` pattern. It refreshes the Supabase session on every request and redirects auth-callback codes that land on `/` to `/auth/callback`.

### Supabase client layering

Three separate client constructors in `website/lib/supabase/`, each for a distinct context — always use the one matching where the code runs:
- `client.ts` — `createBrowserClient`, for Client Components
- `server.ts` — `createServerClient` reading/writing cookies via `next/headers`, for Server Components and Server Actions (RLS-scoped to the current user)
- `service.ts` — `createServiceClient` with the service-role key, bypasses RLS. Used in admin Server Actions (e.g. `website/app/admin/actions.ts`) and in API routes that need to read/write across users (e.g. `website/app/api/works/scenario/route.ts`).

### Auth and access control

Supabase Auth (`members` table extends `auth.users` with `role` and `status` columns). Admin access is gated per-layout, not by proxy: `website/app/admin/layout.tsx` fetches the current user's `members` row and redirects to `/` unless `role === "admin" && status === "approved"`. There is no centralized route-based auth middleware for admin — any new admin route must live under `app/admin/` to inherit this layout guard.

### Domain model

Core Supabase tables (see `supabase/migrations/` for full history): `members`, `works` (books), `book_sessions` (a scheduled reading-club evening for a work), `session_signups`, `user_book_ratings`, `nominations` (member-submitted book suggestions, with `status`: pending/approved/rejected), `tags`, `work_interests`, `work_sources`, `scenario_share_tokens` (public share links for a generated scenario, resolved via `app/s/[token]`).

Route groups mirror this: `app/leeslijst/` (reading list / works), `app/agenda/` (scheduled sessions), `app/voorstel/[id]/` (public proposal page for a nomination-in-progress), `app/on-request/` (member nomination form), `app/admin/**` (management UI for works, sessions, nominations, tags, members).

### AI-generated content

`app/admin/works/[id]/edit/` and its API routes (`app/api/works/scenario`, `app/api/works/book-questions`, `app/api/session/prepare`) call the Anthropic API with long, structured Dutch system prompts to generate book-club discussion questions and full session scenarios, returned as JSON matching a typed schema (see `ScenarioData` in `app/api/works/scenario/route.ts`) and persisted onto `works`/`book_sessions`. When editing these prompts, preserve the JSON-only output contract — response parsing strips markdown fences and extracts the outermost `{...}` before `JSON.parse`.

### Email

`website/app/admin/actions.ts` sends transactional email via Resend with inline-styled HTML built by hand (no template engine/MDX). Preview at `app/admin/email-preview/route.ts`. Follow the existing brand-token colors (`#1a160f`, `#f5f0e8`, `#c1440e`) and layout structure when adding new email templates, since Radix/Tailwind classes don't apply in email HTML.

### Design system reference

`app/design/` is a live style guide (colors, type, components, form controls) rendered in-app — check it before introducing new UI patterns, since Radix primitives are already wrapped in `components/ui/`.
