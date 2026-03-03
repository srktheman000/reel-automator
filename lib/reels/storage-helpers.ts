import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'

type DB = SupabaseClient<Database>

const MEDIA_BUCKET = () => process.env.SUPABASE_STORAGE_BUCKET_MEDIA ?? 'reel-media'

export async function uploadBuffer(
  supabase: DB,
  opts: {
    buffer: Buffer
    path: string
    contentType: string
  }
): Promise<string> {
  const { error } = await supabase.storage
    .from(MEDIA_BUCKET())
    .upload(opts.path, opts.buffer, { contentType: opts.contentType, upsert: true })

  if (error) throw new Error(`Storage upload failed: ${error.message}`)
  return opts.path
}

export async function getSignedUrl(supabase: DB, storagePath: string, expiresIn = 3600): Promise<string> {
  const { data, error } = await supabase.storage
    .from(MEDIA_BUCKET())
    .createSignedUrl(storagePath, expiresIn)

  if (error) throw new Error(`Failed to create signed URL: ${error.message}`)
  return data.signedUrl
}

export async function getSignedUrls(
  supabase: DB,
  paths: string[],
  expiresIn = 3600
): Promise<Record<string, string>> {
  const { data, error } = await supabase.storage
    .from(MEDIA_BUCKET())
    .createSignedUrls(paths, expiresIn)

  if (error) throw new Error(`Failed to create signed URLs: ${error.message}`)

  return Object.fromEntries((data ?? []).map(item => [item.path, item.signedUrl ?? '']))
}
