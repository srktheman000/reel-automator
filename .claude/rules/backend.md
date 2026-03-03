# Backend Rules — AI Reel Creator & Editor

Applies to everything under `app/api/` and all Server Components.

---

## API Route Structure

### File naming
- One file per resource: `app/api/<resource>/route.ts`
- Nested resources: `app/api/<resource>/[id]/route.ts`
- Action sub-routes: `app/api/<resource>/[id]/<action>/route.ts`
- Only export named HTTP handlers (`GET`, `POST`, `PATCH`, `DELETE`). No default export.

### Handler skeleton (always follow this pattern)

```ts
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const bodySchema = z.object({ ... })

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const supabase = await createClient()
  // ... business logic ...
}
```

### Rules
- **Always validate** the request body with a Zod schema. No raw `req.json()` usage without validation.
- **Never return raw Supabase errors** to clients — log the full error server-side, return a sanitised message.
- Use `NextResponse.json()` for all non-streaming responses.
- Streaming responses (AI chat) must use `result.toDataStreamResponse()` — do not wrap in `NextResponse`.
- `maxDuration` must be set on any route that calls an AI model: `export const maxDuration = 60`
- Use HTTP status codes correctly: 200 GET success, 201 POST create, 400 bad input, 401 unauth, 404 not found, 500 server error.
- Always `await createClient()` — the Supabase SSR client is async.

---

## Validation

- Define Zod schemas at the top of the route file, not inline in handlers.
- Use `.safeParse()` (not `.parse()`) so you control the error response shape.
- For path params, parse `params.id` through `z.string().uuid()` before any DB call.
- Reuse domain-level schemas from `lib/validations/<domain>.ts` when the same shape is needed in multiple routes.

### Schema co-location rule
- Simple schemas used only in one route → define in that route file.
- Schemas shared by 2+ routes → extract to `lib/validations/<feature>.ts`.

---

## AI Streaming Routes

```ts
export const maxDuration = 60

export async function POST(req: Request) {
  // 1. Validate input
  // 2. Persist user message to Supabase BEFORE streaming
  // 3. Call streamText() with system prompt + messages
  // 4. Persist assistant response in onFinish callback
  // 5. Return result.toDataStreamResponse()
}
```

- Persist the **user message first**, before the stream starts, so it is saved even if the stream fails.
- Persist the **assistant response** inside `onFinish`, not in a separate request.
- Always pass `system:` as the REEL_SYSTEM_PROMPT (or relevant prompt from `lib/ai/`).
- Never hard-code model strings — import the model constant from `lib/ai/models.ts`.

```ts
// lib/ai/models.ts
export const CHAT_MODEL = google('gemini-2.0-flash')
export const ANALYSIS_MODEL = google('gemini-2.0-flash')
```

---

## Error Handling

- Never let unhandled promise rejections crash a route handler — wrap async DB calls in try/catch.
- Log errors with a route prefix: `console.error('[POST /api/sessions]', error)`
- Return structured error JSON: `{ error: string, code?: string }`
- For AI-related failures, distinguish between model errors (502) and validation errors (400).

---

## Security

- Never trust client-supplied `userId` or `sessionId` without verifying ownership against the authenticated user.
- When auth is added, every route must verify the session via `supabase.auth.getUser()` and reject if `user` is null.
- Never put `SUPABASE_SERVICE_ROLE_KEY` in any client-accessible file or `NEXT_PUBLIC_*` variable.
- Rate-limit AI routes (via Vercel middleware or upstash/ratelimit) before going to production.
- Sanitise any user content that is interpolated into prompts — trim to a safe max length (2000 chars).

---

## Adding New Features (checklist)

1. Create `app/api/<feature>/route.ts` with typed Zod schema.
2. Add the DB table to Supabase and update `lib/supabase/types.ts`.
3. Add typed query helpers in `lib/supabase/queries/<feature>.ts` if the query is reused.
4. Add the route to the architecture diagram in `CLAUDE.md`.
5. Never fetch data inside Server Components using raw `fetch` — use the server Supabase client directly.
