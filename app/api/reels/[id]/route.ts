import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { getReelWithScenes } from '@/lib/supabase/queries/reels'
import { updateReelSchema } from '@/lib/validations/reels'

const idSchema = z.string().uuid()

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const parsed = idSchema.safeParse(id)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid reel ID' }, { status: 400 })
  }

  const supabase = await createClient()

  try {
    const reel = await getReelWithScenes(supabase, parsed.data)
    return NextResponse.json({ data: reel })
  } catch (err) {
    console.error('[GET /api/reels/[id]]', err)
    return NextResponse.json({ error: 'Reel not found' }, { status: 404 })
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const idParsed = idSchema.safeParse(id)

  if (!idParsed.success) {
    return NextResponse.json({ error: 'Invalid reel ID' }, { status: 400 })
  }

  const body = await req.json()
  const parsed = updateReelSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reels')
    .update(parsed.data)
    .eq('id', idParsed.data)
    .select('id, title, updated_at')
    .single()

  if (error) {
    console.error('[PATCH /api/reels/[id]]', error)
    return NextResponse.json({ error: 'Failed to update reel' }, { status: 500 })
  }

  return NextResponse.json({ data })
}
