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

Driftwork uses **Postgres** (Vercel Postgres / Neon). For local dev, create a
Neon dev branch at [neon.tech](https://neon.tech) — free tier supports
branching, so prod data stays untouched.

```bash
npm install
cp .env.example .env
# paste your Neon dev branch URLs into .env
npm run db:push       # create schema on your DB
npm run db:seed       # populate from prisma/data
npm run dev           # → http://localhost:3000
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

## Deploy (Vercel + Vercel Postgres)

Frontend, API routes, and database all live on Vercel — one dashboard, one
deploy.

1. **Push to GitHub.**
2. **Import the repo on Vercel** — Next.js is auto-detected.
3. **Storage → Create Database → Postgres** (powered by Neon). Pick a region
   near your Vercel deployment region. Vercel auto-injects these environment
   variables into every preview + production build:
   - `POSTGRES_PRISMA_URL` (pooled, runtime queries)
   - `POSTGRES_URL_NON_POOLING` (direct, migrations + seed)
4. **Bootstrap the schema + seed** once, from local:
   ```bash
   vercel env pull .env.production.local       # pulls the injected URLs
   npx prisma db push --schema=./prisma/schema.prisma
   npm run db:seed
   ```
5. **Redeploy** on Vercel — the build picks up `prisma generate` via the
   `postinstall` hook, connects through the pooled URL at runtime, and
   serves `/`, `/jobs/[id]`, `/api/jobs` from the edge.

After the initial seed, subsequent deploys don't need any manual DB steps —
the schema and data already live in Neon.

### Dev workflow with branches
Neon supports per-branch DBs on the free tier. Create a separate branch for
local dev so your prod data stays clean:

```bash
neonctl branches create --name dev
neonctl connection-string dev --pooled  # → paste into .env as POSTGRES_PRISMA_URL
neonctl connection-string dev           # → paste into .env as POSTGRES_URL_NON_POOLING
```

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
