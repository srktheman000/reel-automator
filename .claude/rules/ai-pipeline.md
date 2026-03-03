# AI Pipeline Rules — AI Reel Creator & Editor

Applies to all AI/LLM integrations: `lib/ai/`, `app/api/chat/`, and future AI feature routes.

---

## Model & SDK

- **SDK**: Vercel AI SDK (`ai` package) + `@ai-sdk/google`. No other AI SDKs.
- **Primary model**: `google('gemini-2.0-flash')` — fast, cost-effective for interactive chat.
- **Analysis model**: same — upgrade to `gemini-2.0-pro` only for batch, non-realtime tasks.
- Never hard-code model strings in route handlers. Use constants from `lib/ai/models.ts`:

```ts
// lib/ai/models.ts
import { google } from '@ai-sdk/google'

export const CHAT_MODEL    = google('gemini-2.0-flash')
export const ANALYSIS_MODEL = google('gemini-2.0-flash')
```

---

## Streaming Rules

- All user-facing AI calls must stream. Use `streamText()` + `.toDataStreamResponse()`.
- Non-user-facing (background analysis, batch processing) may use `generateText()`.
- Always set `export const maxDuration = 60` on streaming route handlers.
- Never buffer the full response before sending — always stream incrementally.
- The client must consume the stream via `useChat` with `DefaultChatTransport`, not raw `fetch` with stream parsing.

---

## System Prompts

- All system prompts live in `lib/ai/prompts/` — never inline in route handlers.
- One file per task type: `reel-chat.ts`, `script-generation.ts`, `hashtag-seo.ts`, `edit-instructions.ts`.
- Export prompts as `const PROMPT_NAME = \`...\`` (template literal, not function unless dynamic).
- When the prompt needs dynamic context (creator niche, platform, tone), use a builder function:

```ts
// lib/ai/prompts/script-generation.ts
export function buildScriptPrompt(opts: {
  platform: 'youtube-shorts' | 'instagram-reels' | 'tiktok'
  tone: 'educational' | 'entertainment' | 'motivational' | 'commercial'
  durationSec: number
}): string {
  return `You are a script writer for ${opts.platform} ...`
}
```

- Prompt files must not import from `app/` or `components/` — they are pure string builders.
- Review prompts whenever the reel structure or AI capabilities change — they are a core product asset.

---

## AI Tools (Structured Output)

When the AI needs to return structured data (reel blueprint, timestamped edit instructions, hashtag list), use Vercel AI SDK tools instead of parsing raw markdown:

```ts
import { streamText, tool } from 'ai'
import { z } from 'zod'

const result = streamText({
  model: CHAT_MODEL,
  system: REEL_SYSTEM_PROMPT,
  messages,
  tools: {
    generateReelBlueprint: tool({
      description: 'Generate a structured reel blueprint with timing and sections',
      parameters: z.object({
        hook:    z.string(),
        context: z.string(),
        value:   z.string(),
        cta:     z.string(),
        totalSec: z.number().max(90),
        sections: z.array(z.object({
          type: z.enum(['hook', 'context', 'value', 'cta']),
          startSec: z.number(),
          endSec: z.number(),
          notes: z.string(),
        })),
      }),
      execute: async (blueprint) => {
        // Persist to reel_segments table
        return { saved: true, blueprintId: '...' }
      },
    }),
  },
})
```

- Tool schemas must use Zod (already a project dependency).
- Tool `execute` functions handle DB persistence — keep them async and wrap in try/catch.
- Tools that need Supabase access receive the client via closure (create it before calling `streamText`).
- Never pass unsanitised user input directly into tool parameters — validate via Zod in the tool schema.

---

## Reel-Specific AI Tasks

The AI assistant has four core capabilities. Each should be a separate tool or prompt builder:

| Capability | Route | Prompt file |
|---|---|---|
| Script & caption writing | `/api/chat` | `lib/ai/prompts/reel-chat.ts` |
| Edit instructions (timestamped) | `/api/chat` (tool) | `lib/ai/prompts/reel-chat.ts` |
| Hashtag & SEO generation | `/api/reels/[id]/seo` | `lib/ai/prompts/hashtag-seo.ts` |
| Reel structure planning (blueprint) | `/api/chat` (tool) | `lib/ai/prompts/reel-chat.ts` |

- For the chat endpoint, all four capabilities are handled in one system prompt (`REEL_SYSTEM_PROMPT`) with tool definitions.
- For dedicated single-task endpoints (batch SEO generation, auto-blueprint), extract into separate routes with focused prompts.

---

## Context Window Management

- The messages array sent to the model must be trimmed to avoid exceeding the context window.
- For sessions with many messages, send only the last N messages:

```ts
const MAX_HISTORY = 20
const trimmedMessages = messages.slice(-MAX_HISTORY)
```

- The system prompt is not counted in `messages` — always pass it as the `system:` field.
- For very long scripts or reel blueprints, chunk the content across multiple turns — do not send >8000 tokens of user content in a single message.

---

## Content Safety & Prompt Injection

- Trim user messages to a maximum of 2000 characters before inserting into the messages array.
- Never interpolate user text directly into the system prompt string — user content goes in the `messages` array only.
- The system prompt must include the constraint: "You do not answer questions unrelated to content creation, video production, or social media strategy."
- Log any AI call that errors with model-provided error details for debugging (never surface to the client).

---

## Cost Control

- Log token usage in development: `onFinish: ({ usage }) => console.log('[AI usage]', usage)`.
- For batch operations (processing many reels), add rate limiting and queue jobs rather than calling the model in parallel.
- Never call the model inside a loop without explicit batching/throttling logic.
- When adding new AI features, estimate token usage and document it in the route file.

---

## Testing AI Features

- AI route handlers must be testable without hitting the real model — accept a `model` parameter in the handler function (dependency injection), defaulting to `CHAT_MODEL`.
- For integration tests, use the Vercel AI SDK mock provider:
  ```ts
  import { MockLanguageModelV1 } from 'ai/test'
  ```
- Prompt changes must be reviewed manually against at least 5 representative user inputs before merging.
