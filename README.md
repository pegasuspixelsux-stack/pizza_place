# Bianco Pizzeria

A restaurant marketing site with an editable menu, built with Next.js (App
Router) and Tailwind CSS. Visitors see the hero, menu, and hours/contact
info; staff can edit all of it from a password-protected `/admin` dashboard.

## Stack

- **Next.js 16** (App Router, Server Actions, Server Components)
- **Tailwind CSS v4**
- **Content storage**: `data/menu.json` locally, [Vercel Blob](https://vercel.com/docs/vercel-blob) in production (see [Persistent storage](#persistent-storage))
- **Auth**: a minimal credential-based session (signed cookie via [`jose`](https://github.com/panva/jose), password hashed with `bcryptjs`) — no external accounts required

## Getting started

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

1. Pick an admin username and set `ADMIN_USERNAME`.
2. Generate a password hash and set `ADMIN_PASSWORD_HASH`:
   ```bash
   npm run hash-password -- "your-password-here"
   ```
3. Generate a session secret and set `SESSION_SECRET`:
   ```bash
   openssl rand -base64 32
   ```
4. Leave `BLOB_READ_WRITE_TOKEN` empty for local development — see below.

Then run the dev server:

```bash
npm run dev
```

- Public site: [http://localhost:3000](http://localhost:3000)
- Admin dashboard: [http://localhost:3000/admin](http://localhost:3000/admin)

## How content editing works

Everything shown on the homepage (hero copy + image, the four menu
categories, footer/hours/contact info) lives in one JSON document, typed in
`lib/types.ts`. The admin dashboard at `/admin` edits that document through
Server Actions in `app/admin/actions.ts`, which validate input with
[Zod](https://zod.dev) before saving.

### Persistent storage

The deployed Vercel filesystem is **read-only and ephemeral** at runtime, so
writing straight to `data/menu.json` (as this project does locally) would
silently lose every edit on the next deploy or cold start. `lib/data.ts`
handles this automatically:

| Environment | Reads / writes |
| --- | --- |
| Local dev (no `BLOB_READ_WRITE_TOKEN`) | `data/menu.json` on disk — edits show up as real file changes you can commit |
| Deployed on Vercel (`BLOB_READ_WRITE_TOKEN` set) | A JSON object in [Vercel Blob](https://vercel.com/docs/vercel-blob), overwritten on every save |

Uploaded hero images follow the same rule: locally they're written to
`public/uploads/` (git-ignored, dev only); in production they're uploaded to
Blob and served from its CDN URL.

`data/menu.json` doubles as the **seed content** — it's what a fresh
deployment shows before the first admin save (or forever, if you never
provision Blob and don't need persistence beyond a single server).

## Deploying to Vercel

1. Push this repository to GitHub and [import it on Vercel](https://vercel.com/new).
2. In the project's **Settings → Environment Variables**, add:
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD_HASH`
   - `SESSION_SECRET`
3. Provision persistent storage so admin edits survive deploys: in the
   project's **Storage** tab, create a **Blob** store (or run
   `vercel integration add blob` with the [Vercel CLI](https://vercel.com/docs/cli)).
   This automatically sets `BLOB_READ_WRITE_TOKEN` for you.
4. Deploy. Pull the same env vars locally with `vercel env pull .env.local`
   if you want your local dev server to read/write the same production data.

Until step 3 is done, the site still works — it just falls back to the
`data/menu.json` bundled in the deployment and any admin edits won't persist
between deploys.

## Project structure

```
app/
  page.tsx                 Public homepage (hero, menu, footer)
  components/               Public-facing UI components
  admin/
    login/                  Public login page + Server Action
    (dashboard)/            Protected dashboard route (layout verifies session)
    actions.ts              Server Actions for hero/menu/footer CRUD
    components/             Dashboard editor components
data/menu.json              Seed content / local-dev data store
lib/
  types.ts                  Shared content types
  data.ts                   Read/write abstraction (Blob or local file)
  auth/                     Session, credentials, and the auth Data Access Layer
proxy.ts                    Redirects unauthenticated visitors away from /admin
```

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Blob](https://vercel.com/docs/vercel-blob)
