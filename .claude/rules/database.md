# Database Rules — AI Reel Creator & Editor

Applies to all Supabase usage: `lib/supabase/`, API routes, and Server Components.

---

## Client Selection

| Context | Client to use |
|---|---|
| Server Component, Route Handler, Server Action | `createClient()` from `lib/supabase/server.ts` |
| Client Component (`"use client"`) | `createBrowserClient()` from `lib/supabase/client.ts` |
| Admin operations (migrations, seed scripts) | `createClient(SERVICE_ROLE)` — server only, never shipped to the browser |

- Always `await createClient()` for the server client — it is async.
- Never import the server client in a `"use client"` file and vice versa.

---

## Type Safety

- `lib/supabase/types.ts` contains the `Database` interface that mirrors the Supabase schema.
- The Supabase client is typed: `createClient<Database>()`. Always use the typed client.
- Derive all row/insert/update types from the `Database` interface — never hand-write duplicate interfaces:

```ts
type Session = Database['public']['Tables']['sessions']['Row']
type MessageInsert = Database['public']['Tables']['messages']['Insert']
```

- After any schema migration, regenerate `lib/supabase/types.ts`:
  ```bash
  npx supabase gen types typescript --project-id <id> > lib/supabase/types.ts
  ```
- Never manually edit `lib/supabase/types.ts` — it is auto-generated.

---

## Query Rules

### Always handle errors explicitly

```ts
const { data, error } = await supabase.from('sessions').select('...')
if (error) {
  console.error('[<context>] Supabase error:', error)
  return NextResponse.json({ error: 'Failed to load sessions' }, { status: 500 })
}
```

- Never use `data!` (non-null assertion) without checking `error` first.
- Use `.single()` only when exactly one row is guaranteed. It throws if 0 or 2+ rows are returned.
- Use `.maybeSingle()` when 0 rows is a valid (non-error) outcome.

### Select only needed columns

```ts
// Good
supabase.from('sessions').select('id, title, updated_at')

// Bad — over-fetches
supabase.from('sessions').select('*')
```

- Exception: use `select('*')` only in internal admin scripts or when all columns are genuinely needed.

### Inserts and updates

```ts
// Insert and return the new row
const { data, error } = await supabase
  .from('sessions')
  .insert({ title: 'My Reel' })
  .select('id, title, created_at')
  .single()
```

- Always chain `.select()` after `.insert()` or `.update()` when you need the resulting row.
- For conditional updates, use `.eq()` + `.is()` / `.not()` filters to target only intended rows (see session title pattern in `api/chat/route.ts`).

### Ordering and pagination

- Always `.order('created_at', { ascending: false })` for time-series data (messages, sessions).
- Always `.limit(n)` on list queries. Default limit for UI lists: 20. Never fetch unbounded lists.
- For infinite scroll or pagination, use `.range(from, to)` — not cursor-based pagination unless explicitly needed.

---

## Schema Conventions

### Table naming
- Snake_case, plural: `sessions`, `messages`, `reels`, `reel_segments`, `media_assets`.

### Column naming
- `id` — UUID primary key with `gen_random_uuid()` default.
- `created_at` — `timestamptz` with `now()` default.
- `updated_at` — `timestamptz` with `now()` default + trigger to auto-update.
- Foreign keys: `<parent_table_singular>_id` (e.g., `session_id`, `reel_id`).
- Boolean flags: `is_<adjective>` (e.g., `is_published`, `is_deleted`).
- Enum-like string columns: use a Postgres `CHECK` constraint or a Postgres enum type.

### Planned tables (follow this schema pattern when adding)

```sql
-- reels
create table reels (
  id           uuid primary key default gen_random_uuid(),
  session_id   uuid references sessions(id) on delete cascade,
  title        text,
  status       text check (status in ('draft', 'processing', 'ready', 'failed')) default 'draft',
  metadata     jsonb default '{}',
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- reel_segments (script sections / timeline cuts)
create table reel_segments (
  id           uuid primary key default gen_random_uuid(),
  reel_id      uuid references reels(id) on delete cascade,
  type         text check (type in ('hook', 'context', 'value', 'cta')),
  content      text,
  start_sec    numeric(6,2),
  end_sec      numeric(6,2),
  sort_order   integer,
  created_at   timestamptz default now()
);

-- media_assets
create table media_assets (
  id           uuid primary key default gen_random_uuid(),
  reel_id      uuid references reels(id) on delete cascade,
  storage_path text not null,
  mime_type    text,
  size_bytes   bigint,
  duration_sec numeric(8,2),
  created_at   timestamptz default now()
);
```

---

## RLS (Row Level Security)

- Enable RLS on **every** table before adding auth.
- Default policy: deny all. Grant access only to the authenticated user's own rows.

```sql
-- Example: users can only see their own sessions
create policy "users_own_sessions"
  on sessions for all
  using (auth.uid() = user_id);
```

- Until auth is implemented, the anon key has broad access. Lock this down before any public deployment.
- Service role bypasses RLS — only use it for trusted server-side admin operations.

---

## Migrations

- All schema changes must be done through Supabase migrations: `supabase migration new <name>`.
- Never alter the live schema through the Supabase dashboard for changes that need to be reproducible.
- After writing a migration, regenerate `lib/supabase/types.ts` immediately.
- Migration files live in `supabase/migrations/` — commit them to git.

---

## Query Helper Pattern

When a Supabase query is reused across 2+ route handlers or components, extract it:

```ts
// lib/supabase/queries/sessions.ts
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/lib/supabase/types'

type DB = SupabaseClient<Database>

export async function getSessionById(supabase: DB, id: string) {
  const { data, error } = await supabase
    .from('sessions')
    .select('id, title, created_at, updated_at')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}
```

- Pass the already-constructed `supabase` client as a parameter — do not call `createClient()` inside query helpers.
- Query helpers throw on error (callers handle it) — do not return `{ data, error }` tuples from helpers.
