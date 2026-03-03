import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const querySchema = z.object({
  bucket: z.string().min(1),
  path: z.string().min(1),
  content_type: z.string().min(1),
})

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const parsed = querySchema.safeParse(Object.fromEntries(searchParams))

  if (!parsed.success) {
    return NextResponse.json({ error: 'bucket, path, and content_type are required' }, { status: 400 })
  }

  const { bucket, path, content_type } = parsed.data
  const supabase = await createClient()

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUploadUrl(path)

  if (error) {
    console.error('[GET /api/media/upload-url]', error)
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 })
  }

  return NextResponse.json({ data: { upload_url: data.signedUrl, path: data.path } })
}
