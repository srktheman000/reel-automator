import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const idSchema = z.string().uuid()

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const parsed = idSchema.safeParse(id)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid reel ID' }, { status: 400 })
  }

  const supabase = await createClient()

  const [reelResult, jobResult, scenesResult] = await Promise.all([
    supabase
      .from('reels')
      .select('status')
      .eq('id', parsed.data)
      .single(),
    supabase
      .from('generation_jobs')
      .select('status, total_steps, done_steps, error_message')
      .eq('reel_id', parsed.data)
      .maybeSingle(),
    supabase
      .from('reel_scenes')
      .select('id, image_status, audio_status')
      .eq('reel_id', parsed.data)
      .order('sort_order', { ascending: true }),
  ])

  if (reelResult.error) {
    console.error('[GET /api/reels/[id]/status]', reelResult.error)
    return NextResponse.json({ error: 'Reel not found' }, { status: 404 })
  }

  return NextResponse.json({
    data: {
      reel_status: reelResult.data.status,
      job_status: jobResult.data?.status ?? null,
      total_steps: jobResult.data?.total_steps ?? 0,
      done_steps: jobResult.data?.done_steps ?? 0,
      error_message: jobResult.data?.error_message ?? null,
      scenes: scenesResult.data ?? [],
    },
  })
}
