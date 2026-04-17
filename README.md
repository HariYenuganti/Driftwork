<div align="center">

  <h1>Driftwork</h1>

  <p><em>Remote engineering jobs that find you.</em></p>

  <p>
    A curated job board for remote developer roles. Server-rendered list +
    detail, URL-driven search, client-side filters, bookmarks that survive a
    refresh — all on a single Next.js 16 App Router deploy.
  </p>

[![Next.js](https://img.shields.io/badge/Next.js%2016-000000?style=flat&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React%2019-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat&logo=sqlite&logoColor=white)](https://sqlite.org/)
[![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat&logo=zod&logoColor=white)](https://zod.dev/)

</div>

---

## What's interesting here

- **App Router + parallel routes.** The sidebar (search, filters, list) and
  detail pane are separate route segments that render independently. Clicking
  a job navigates to `/jobs/[id]?search=...` — a real, shareable URL with its
  own `<title>` from `generateMetadata` — while the sidebar stays mounted
  and doesn't re-scroll.
- **Server Components for data.** The job list and detail fetches happen on
  the server, hitting Prisma directly. No client cache, no HTTP round-trip,
  no loading spinner for the first paint. Client state (filters, sort,
  pagination, bookmarks) lives in React Contexts.
- **One batched endpoint.** Bookmarks hydrate via a single
  `GET /api/jobs?ids=1,2,3` — one Prisma `findMany` — rather than N parallel
  requests.
- **URL as state.** Search lives in `?search=`, the active job is the route
  segment. Back/forward, refresh, and sharing all work naturally.
- **Typed end-to-end.** Shared TypeScript types (`JobItem`,
  `JobItemExpanded`, `Seniority`) sit in [`lib/type.ts`](lib/type.ts) and are
  imported by both RSC and client code. Zod validates all route-handler
  inputs.

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack, React 19)
- **Data:** Prisma 5 + SQLite (local) — `provider = "postgresql"` for prod
- **State:** React Context (`Filter`, `Bookmarks`, `JobItems`) + URL search
  params
- **Validation:** Zod
- **UI:** Vanilla CSS with design tokens, Radix UI icons, `next/font`
  (Inter + Fraunces), react-hot-toast

## Running it

Driftwork uses **[Prisma Postgres](https://www.prisma.io/postgres)** —
serverless Postgres with built-in connection pooling, provisioned through the
Vercel Marketplace. Once the project is linked to Vercel, one command pulls
the connection string into `.env`.

```bash
npm install
vercel link            # once — connects this repo to your Vercel project
vercel env pull .env   # pulls DATABASE_URL from the Marketplace integration
npm run db:push        # create schema on the DB
npm run db:seed        # populate from prisma/data (50 jobs)
npm run dev            # → http://localhost:3000
```

Try it:

- type `react`, `python`, or a company name — URL updates, list re-fetches
- click a job — real URL `/jobs/[id]?search=...`, sidebar stays mounted
- refresh the detail URL — fully hydrated, same search still in the box
- filter by `senior` + `TypeScript`, check pagination resets
- bookmark a couple jobs, refresh, confirm they survive

## Project layout

```
.
├── app/
│   ├── layout.tsx                  # providers + header + @detail slot
│   ├── page.tsx                    # RSC: fetches list by ?search
│   ├── providers.tsx               # client: Filter + Bookmarks contexts
│   ├── globals.css                 # design tokens + component styles
│   ├── jobs/[id]/page.tsx          # sidebar when on a detail URL
│   ├── @detail/
│   │   ├── default.tsx             # "pick a job" empty state
│   │   ├── loading.tsx             # detail skeleton
│   │   └── jobs/[id]/page.tsx      # RSC: fetches detail + metadata
│   └── api/jobs/
│       ├── route.ts                # GET ?search=... OR ?ids=1,2,3
│       └── [id]/route.ts           # GET single detail
│
├── components/                     # Presentational + client islands
├── context/                        # FilterContext, BookmarksContext, JobItemsContext
├── lib/
│   ├── services/jobService.ts      # Prisma calls (searchJobs, getJobById, getJobsByIds)
│   ├── db.ts                       # PrismaClient singleton + BigInt JSON shim
│   ├── hooks.ts                    # useDebounce, useLocalStorage, useOnClickOutside, etc.
│   ├── type.ts                     # JobItem, JobItemExpanded, Seniority (single source)
│   ├── constants.ts
│   └── utils.ts
└── prisma/
    ├── schema.prisma               # JobItem model
    ├── seed.ts                     # seeds DB from prisma/data/*.json
    └── data/                       # 50 curated jobs + expanded details
```

## API

- `GET /api/jobs?search=<term>` — fuzzy-matches title, company, tags
- `GET /api/jobs?ids=id1,id2,id3` — batched detail fetch (bookmarks hydration)
- `GET /api/jobs/:id` — single job detail
- All responses share the same `{ public, jobItems }` shape as RSC consumers

## Deploy (Vercel + Prisma Postgres)

Frontend, API routes, and database all live on Vercel — one dashboard, one
deploy.

1. **Push to GitHub.**
2. **Import the repo on Vercel** — Next.js is auto-detected.
3. **Provision Prisma Postgres** from the Vercel Marketplace:
   ```bash
   vercel link
   vercel integration add prisma-postgres
   ```
   This provisions a serverless Postgres instance and injects `DATABASE_URL`
   (plus mirrored `POSTGRES_URL` and `PRISMA_DATABASE_URL` aliases) into every
   environment — Production, Preview, and Development.
4. **Bootstrap the schema + seed** once, from local:
   ```bash
   vercel env pull .env
   npx prisma db push
   npm run db:seed
   ```
5. **Redeploy** (or push to `main`). The build picks up `prisma generate` via
   the `postinstall` hook and connects through `DATABASE_URL` at runtime.

After the initial seed, subsequent deploys don't need any manual DB steps —
the schema and data live in Prisma Postgres.

## Notes

- IDs are stored as `TEXT` because the seeded dataset includes values that
  exceed `int8` range. They coerce to `Number` at the API boundary, matching
  `JobItem.id: number`.
- `remote` is randomized at seed time so the filter toggle does something
  meaningful (~80% remote, ~20% hybrid).
- `useLocalStorage` is SSR-safe — the lazy initializer only reads
  `localStorage` on the client, avoiding hydration mismatch.
- The Prisma singleton in [`lib/db.ts`](lib/db.ts) stashes the client on
  `globalThis` to survive Next.js HMR and serverless cold starts without
  exhausting the connection pool.
