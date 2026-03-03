import { streamText } from 'ai'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { REEL_SYSTEM_PROMPT } from '@/lib/ai/prompts/reel-chat'
import { CHAT_MODEL } from '@/lib/ai/models'

export const maxDuration = 60

const requestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })
  ),
  sessionId: z.string().uuid(),
})

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = requestSchema.safeParse(body)

  if (!parsed.success) {
    return new Response('Invalid request', { status: 400 })
  }

  const { messages, sessionId } = parsed.data
  const supabase = await createClient()

  // Persist the incoming user message before streaming begins
  const lastMessage = messages.at(-1)
  if (lastMessage?.role === 'user') {
    await supabase.from('messages').insert({
      session_id: sessionId,
      role: 'user',
      content: lastMessage.content,
    })

    // Set session title from the first user message
    await supabase
      .from('sessions')
      .update({ title: lastMessage.content.slice(0, 80) })
      .eq('id', sessionId)
      .is('title', null)
  }

  const result = streamText({
    model: CHAT_MODEL,
    system: REEL_SYSTEM_PROMPT,
    messages,
    onFinish: async ({ text }) => {
      await supabase.from('messages').insert({
        session_id: sessionId,
        role: 'assistant',
        content: text,
      })
    },
  })

  return result.toUIMessageStreamResponse()
}
