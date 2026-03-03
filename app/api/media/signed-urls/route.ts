import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { getSignedUrls } from '@/lib/reels/storage-helpers'

const bodySchema = z.object({
  paths: z.array(z.string()).min(1).max(50),
})

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = bodySchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'paths array is required' }, { status: 400 })
  }

  const supabase = await createClient()

  try {
    const urls = await getSignedUrls(supabase, parsed.data.paths)
    return NextResponse.json({ data: urls })
  } catch (err) {
    console.error('[POST /api/media/signed-urls]', err)
    return NextResponse.json({ error: 'Failed to generate signed URLs' }, { status: 500 })
  }
}
