import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { synthesizeSpeech } from '@/lib/reels/tts-client'
import { uploadBuffer } from '@/lib/reels/storage-helpers'

export const maxDuration = 60

const bodySchema = z.object({
  scene_id: z.string().uuid(),
  reel_id: z.string().uuid(),
  text: z.string().min(1).max(500),
  voice_name: z.string().optional(),
  speaking_rate: z.number().min(0.5).max(2.0).optional(),
})

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = bodySchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { scene_id, reel_id, text, voice_name, speaking_rate } = parsed.data

  let audioBuffer: Buffer
  try {
    audioBuffer = await synthesizeSpeech({ text, voiceName: voice_name, speakingRate: speaking_rate })
  } catch (err) {
    console.error('[POST /api/tts] TTS error', err)
    return NextResponse.json({ error: 'Text-to-speech generation failed' }, { status: 502 })
  }

  const supabase = await createClient()
  const storagePath = `${reel_id}/scenes/${scene_id}/audio.mp3`

  try {
    await uploadBuffer(supabase, { buffer: audioBuffer, path: storagePath, contentType: 'audio/mpeg' })
  } catch (err) {
    console.error('[POST /api/tts] Storage upload error', err)
    return NextResponse.json({ error: 'Failed to save audio file' }, { status: 500 })
  }

  const { error } = await supabase
    .from('reel_scenes')
    .update({ audio_url: storagePath, audio_status: 'ready' })
    .eq('id', scene_id)
    .eq('reel_id', reel_id)

  if (error) {
    console.error('[POST /api/tts] DB update error', error)
    return NextResponse.json({ error: 'Failed to record audio URL' }, { status: 500 })
  }

  return NextResponse.json({ data: { audio_url: storagePath } })
}
