import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, Reel, ReelScene } from '@/lib/supabase/types'

type DB = SupabaseClient<Database>

export async function getReelById(supabase: DB, id: string): Promise<Reel> {
  const { data, error } = await supabase
    .from('reels')
    .select('id, session_id, context_id, template, title, status, total_scenes, duration_sec, metadata, created_at, updated_at')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function getReelWithScenes(
  supabase: DB,
  id: string
): Promise<Reel & { scenes: ReelScene[] }> {
  const [reelResult, scenesResult] = await Promise.all([
    supabase
      .from('reels')
      .select('id, session_id, context_id, template, title, status, total_scenes, duration_sec, metadata, created_at, updated_at')
      .eq('id', id)
      .single(),
    supabase
      .from('reel_scenes')
      .select('id, reel_id, sort_order, type, script_text, caption_text, image_prompt, start_sec, end_sec, image_url, audio_url, image_status, audio_status, created_at, updated_at')
      .eq('reel_id', id)
      .order('sort_order', { ascending: true }),
  ])

  if (reelResult.error) throw reelResult.error
  if (scenesResult.error) throw scenesResult.error

  return { ...reelResult.data, scenes: scenesResult.data ?? [] }
}
