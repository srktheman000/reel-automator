import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { updateSceneSchema } from '@/lib/validations/reels'

const idSchema = z.string().uuid()

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; sceneId: string }> }
) {
  const { id, sceneId } = await params
  const idParsed = idSchema.safeParse(id)
  const sceneIdParsed = idSchema.safeParse(sceneId)

  if (!idParsed.success || !sceneIdParsed.success) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  const body = await req.json()
  const parsed = updateSceneSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reel_scenes')
    .update(parsed.data)
    .eq('id', sceneIdParsed.data)
    .eq('reel_id', idParsed.data)
    .select('id, updated_at')
    .single()

  if (error) {
    console.error('[PATCH /api/reels/[id]/scenes/[sceneId]]', error)
    return NextResponse.json({ error: 'Failed to update scene' }, { status: 500 })
  }

  return NextResponse.json({ data })
}
