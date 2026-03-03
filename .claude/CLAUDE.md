# CLAUDE.md — AI Reel Creator & Editor

Project guidance for Claude Code. All AI-generated code must follow these rules.

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run lint     # ESLint
```

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript 5
- **AI**: Vercel AI SDK v6 (`ai`, `@ai-sdk/react`, `@ai-sdk/google`) → Gemini 2.0 Flash
- **Database**: Supabase (Postgres) via `@supabase/ssr` + `@supabase/supabase-js`
- **UI**: shadcn/ui + Tailwind v4 + Lucide icons + Radix UI primitives
- **Validation**: Zod v4
- **Utilities**: `clsx` + `tailwind-merge` via `cn()` in `lib/utils.ts`

## Architecture

```
app/page.tsx                   ← Server Component shell
  └── components/chat.tsx      ← "use client" — useChat + DefaultChatTransport
        └── POST /api/chat     ← streamText(gemini) + Supabase persistence
              └── REEL_SYSTEM_PROMPT (lib/system-prompt.ts)

lib/supabase/server.ts         ← SSR Supabase client (Server Components / Route Handlers)
lib/supabase/client.ts         ← Browser Supabase client (client components only)
lib/supabase/types.ts          ← Generated Database type (Database interface)
```

### Planned feature modules (scalable structure to follow)

```
app/
  (dashboard)/                 ← Layout group for authenticated workspace
  api/
    chat/route.ts              ← AI streaming
    sessions/route.ts          ← Session CRUD
    sessions/[id]/route.ts     ← Single session + messages
    reels/route.ts             ← Reel asset management (future)
    media/route.ts             ← Upload/processing pipeline (future)

components/
  ui/                          ← shadcn primitives only — never customise here
  editor/                      ← Reel editor domain components
  chat/                        ← Chat/AI interaction components
  layout/                      ← Shell, sidebar, nav

lib/
  supabase/                    ← Supabase clients + DB types
  ai/                          ← Prompt templates, tool definitions, stream helpers
  reels/                       ← Domain logic: reel structure, export, metadata
  hooks/                       ← Shared custom hooks (useReel, useSession, etc.)
  validations/                 ← Zod schemas (co-locate with the route that uses them)
```

## Detailed Rules (always apply)

- [Backend rules](.claude/rules/backend.md)
- [Frontend rules](.claude/rules/frontend.md)
- [Database rules](.claude/rules/database.md)
- [AI pipeline rules](.claude/rules/ai-pipeline.md)
- [Scalability rules](.claude/rules/scalability.md)

## Core Conventions (quick reference)

- **AI SDK only** — `streamText`/`generateText` from `ai`, `google()` from `@ai-sdk/google`. Never add `openai` or `anthropic` packages.
- **shadcn/ui** for all new UI primitives — `npx shadcn add <component>`, output to `components/ui/`.
- `cn()` from `lib/utils.ts` for every conditional class merge — never raw template literals.
- Server Components by default; add `"use client"` only for hooks, event handlers, or browser APIs.
- New API routes: `app/api/<feature>/route.ts` exporting named `GET`/`POST`/`PATCH`/`DELETE`.
- Every POST/PATCH/DELETE route validates the body with a Zod schema before touching any data.
- Never replace `toDataStreamResponse()` with a plain `Response` in streaming routes.
- Never expose raw Supabase errors to the client — log internally, return a safe message.
- Comments only where logic is non-obvious. Never describe what the code does.

## Environment variables

```
GOOGLE_GENERATIVE_AI_API_KEY   # consumed by @ai-sdk/google automatically
VERCEL_AI_KEY                  # Vercel AI gateway key
NEXT_PUBLIC_SUPABASE_URL       # public Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY  # public anon key
SUPABASE_SERVICE_ROLE_KEY      # server-only service role (never in NEXT_PUBLIC_*)
```

Never access `SUPABASE_SERVICE_ROLE_KEY` from client components or `NEXT_PUBLIC_*` files.
