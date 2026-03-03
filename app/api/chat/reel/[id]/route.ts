import { streamText } from 'ai'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { CHAT_MODEL } from '@/lib/ai/models'
import { buildReelChatPrompt } from '@/lib/ai/prompts/reel-chat'
import { createReelEditorTools } from '@/lib/ai/tools/reel-editor-tools'

export const maxDuration = 60

const requestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string().max(2000),
    })
  ).min(1),
  session_id: z.string().uuid(),
})

const idSchema = z.string().uuid()

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: reelId } = await params
  const idParsed = idSchema.safeParse(reelId)

  if (!idParsed.success) {
    return NextResponse.json({ error: 'Invalid reel ID' }, { status: 400 })
  }

  const body = await req.json()
  const parsed = requestSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { messages, session_id } = parsed.data
  const supabase = await createClient()

  // Fetch scene count for system prompt
  const { count } = await supabase
    .from('reel_scenes')
    .select('*', { count: 'exact', head: true })
    .eq('reel_id', idParsed.data)

  const { data: reel } = await supabase
    .from('reels')
    .select('template')
    .eq('id', idParsed.data)
    .single()

  if (!reel) {
    return NextResponse.json({ error: 'Reel not found' }, { status: 404 })
  }

  const tools = createReelEditorTools(supabase, idParsed.data)
  const systemPrompt = buildReelChatPrompt({
    reelId: idParsed.data,
    template: reel.template,
    sceneCount: count ?? 0,
  })

  // Persist user message
  const lastMessage = messages.at(-1)
  if (lastMessage?.role === 'user') {
    await supabase.from('messages').insert({
      session_id,
      role: 'user',
      content: lastMessage.content,
    })
  }

  const result = streamText({
    model: CHAT_MODEL,
    system: systemPrompt,
    messages,
    tools,
    onFinish: async ({ text }) => {
      if (text) {
        await supabase.from('messages').insert({
          session_id,
          role: 'assistant',
          content: text,
        })
      }
    },
  })

  return result.toUIMessageStreamResponse()
}
