# Scalability Rules — AI Reel Creator & Editor

Applies to all architectural decisions as the app grows from MVP to a multi-user production platform.

---

## File & Module Boundaries

### Current structure (MVP)
Everything lives flat in `components/`, `app/api/`, `lib/`. Fine for now.

### When to refactor to feature modules
Trigger when ANY of these is true:
- A feature has 3+ route handlers
- A feature has 5+ components
- A feature has its own Supabase tables

Feature module layout:
```
lib/
  reels/
    index.ts           ← public API (re-exports only)
    reel-builder.ts    ← domain logic
    reel-export.ts
    types.ts           ← domain types (not DB types)
    validations.ts     ← Zod schemas

components/
  editor/
    reel-timeline.tsx
    segment-card.tsx
    caption-overlay.tsx
    index.ts           ← barrel export
```

- **Never import from inside a module's internals** (`lib/reels/reel-builder.ts`) from outside that module — always import from `lib/reels` (the barrel).
- Barrel `index.ts` files only re-export — no logic inside them.

---

## API Design for Scale

- Design routes around resources, not actions: `/api/reels` not `/api/createReel`.
- Use consistent response shapes across all endpoints:
  ```ts
  // Success list
  { data: T[], total?: number }

  // Success single
  { data: T }

  // Error
  { error: string, code?: string }
  ```
- Pagination must be present on every list endpoint from day one — add it even if the UI doesn't use it yet.
- Version API routes only if breaking changes are needed: `app/api/v2/<feature>/route.ts`.

---

## Adding Authentication

When auth is added (Supabase Auth), follow this checklist:

1. Add `user_id uuid references auth.users(id)` to all user-owned tables (`sessions`, `reels`, `media_assets`).
2. Enable RLS on every table and write policies (see `database.md`).
3. Create `lib/supabase/auth.ts` with `getAuthUser(supabase)` helper that throws if unauthenticated.
4. Call `getAuthUser` at the top of every route handler that touches user data.
5. Add a Next.js middleware (`middleware.ts`) to protect `/(dashboard)` routes.
6. Do NOT use Supabase client-side auth state directly in Server Components — always use the server client.

---

## Media & File Uploads

When adding video/image upload capability:

- Use Supabase Storage with signed upload URLs — never accept file data directly in a Route Handler body.
- Upload flow:
  1. Client requests a signed upload URL: `POST /api/media/upload-url` → returns `{ uploadUrl, assetId }`
  2. Client uploads directly to Supabase Storage using the signed URL.
  3. Client confirms upload: `POST /api/media/[assetId]/confirm`
  4. Server validates the file exists in storage and updates `media_assets` row status.
- Set a max file size limit in the signed URL request (`maxSizeBytes`).
- Accept only known MIME types: `video/mp4`, `video/quicktime`, `image/jpeg`, `image/png`, `image/webp`.
- Store `storage_path` (not a public URL) in the DB — generate signed read URLs on demand.

---

## Background Jobs & Long-Running Tasks

AI video analysis, export rendering, and batch SEO generation should NOT happen in route handlers:

- Route handler max: 60 seconds (`maxDuration = 60`).
- For tasks > 60 seconds: offload to Vercel Background Functions or a queue (e.g., Upstash QStash).
- Pattern:
  1. Route handler enqueues the job, returns `{ jobId }` immediately with status 202.
  2. Background worker processes the job and updates the DB row status.
  3. Client polls `GET /api/jobs/[jobId]` or subscribes via Supabase Realtime.
- Never use `setTimeout` or `setInterval` in route handlers for async work.

---

## Supabase Realtime (future)

When adding live updates (streaming reel status, collaborative editing):

- Use Supabase Realtime channels from the browser client — not polling.
- Subscribe to table changes with `supabase.channel().on('postgres_changes', ...)`.
- Always unsubscribe in the `useEffect` cleanup: `return () => supabase.removeChannel(channel)`.
- Limit Realtime subscriptions to the data the current user owns — pass the `session_id` or `reel_id` as a filter.

---

## Caching Strategy

- Server Components: use Next.js `fetch` cache (`cache: 'force-cache'` or `revalidate`) for public/static data only.
- Dynamic user data (sessions, messages, reels): always `cache: 'no-store'` — never cache per-user data.
- AI responses: never cache streaming responses.
- For expensive read queries (analytics, aggregations), add a `?cached=true` flag and cache in Supabase or an in-memory store — document the TTL.

---

## Environment & Deployment

- All secrets go in `.env.local` (not committed). `.env.example` documents required keys with placeholder values.
- Separate Supabase projects for `development`, `staging`, and `production` — never point dev at prod.
- Vercel environment variables: set `GOOGLE_GENERATIVE_AI_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` per environment.
- Use `NEXT_PUBLIC_` prefix only for values that are intentionally exposed to the browser.

---

## Code Quality Gates

Before adding any new feature, confirm:
- [ ] New DB tables have RLS policies (or are marked with a `// TODO: add RLS before public launch` comment).
- [ ] New routes have Zod validation.
- [ ] New AI calls use a prompt from `lib/ai/prompts/` (not inline strings).
- [ ] New lists have pagination.
- [ ] No `any` TypeScript types introduced.
- [ ] No raw `select('*')` queries in production routes.
- [ ] `npm run build` passes with zero TypeScript errors before marking a feature done.
