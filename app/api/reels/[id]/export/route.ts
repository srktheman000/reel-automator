import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

export const maxDuration = 60

const paramsSchema = z.object({ id: z.string().uuid() })

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const rawParams = await params
  const parsed = paramsSchema.safeParse(rawParams)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid reel ID' }, { status: 400 })
  }

  const { id } = parsed.data
  const supabase = await createClient()

  const { data: reel, error } = await supabase
    .from('reels')
    .select('id, status, title, template')
    .eq('id', id)
    .single()

  if (error || !reel) {
    return NextResponse.json({ error: 'Reel not found' }, { status: 404 })
  }

  if (reel.status !== 'ready') {
    return NextResponse.json({ error: 'Reel is not ready for export' }, { status: 400 })
  }

  // Server-side rendering requires @remotion/renderer + @remotion/bundler.
  // For now, return a clear error message. To enable MP4 export, run:
  //   npm install @remotion/bundler @remotion/renderer
  // and implement the render pipeline in this route.
  return NextResponse.json(
    {
      error:
        'Server-side rendering is not configured. Use the in-browser preview to record your reel, or set up @remotion/renderer for server-side MP4 export.',
    },
    { status: 501 }
  )
}
