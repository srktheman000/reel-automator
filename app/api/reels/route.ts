import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createReelSchema } from '@/lib/validations/reels'

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = createReelSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { session_id, context_id, template, title } = parsed.data
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('reels')
    .insert({ session_id, context_id, template, title: title ?? null })
    .select('id, status, template, created_at')
    .single()

  if (error) {
    console.error('[POST /api/reels]', error)
    return NextResponse.json({ error: 'Failed to create reel' }, { status: 500 })
  }

  return NextResponse.json({ data }, { status: 201 })
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('session_id')

  const supabase = await createClient()

  let query = supabase
    .from('reels')
    .select('id, session_id, template, title, status, total_scenes, duration_sec, created_at, updated_at')
    .order('created_at', { ascending: false })
    .limit(20)

  if (sessionId && z.string().uuid().safeParse(sessionId).success) {
    query = query.eq('session_id', sessionId)
  }

  const { data, error } = await query

  if (error) {
    console.error('[GET /api/reels]', error)
    return NextResponse.json({ error: 'Failed to fetch reels' }, { status: 500 })
  }

  return NextResponse.json({ data: data ?? [] })
}
