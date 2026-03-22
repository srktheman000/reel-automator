import { DUMMY_REELS, DUMMY_SCENES } from '@/lib/dummy-data'
import { ReelEditorPage } from '@/components/reel-editor/reel-editor-page'

interface Props {
  params: Promise<{ id: string }>
}

// Build a full dummy reel that matches the ReelEditorPage prop types
function buildDummyReel(id: string) {
  const found = DUMMY_REELS.find(r => r.id === id)

  const base = found ?? {
    id,
    title: 'My New Reel',
    template: 'educational',
    status: 'pending',
    duration_sec: 0,
    session_id: 'session-dummy',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    thumbnail_color: 'from-gray-600 to-gray-900',
  }

  const scenes = base.id === 'reel-001' ? DUMMY_SCENES.map(s => ({
    ...s,
    created_at: new Date().toISOString(),
    image_prompt: null as string | null,
    image_generation_id: null as string | null,
    audio_generation_id: null as string | null,
    tts_voice: null as string | null,
  })) : []

  // Cast to unknown first to bridge dummy → DB type gap
  return {
    ...base,
    context_id: null as string | null,
    job_id: null as string | null,
    error_message: null as string | null,
    total_scenes: scenes.length,
    metadata: {} as Record<string, unknown>,
    scenes,
  } as unknown as Parameters<typeof ReelEditorPage>[0]['initialReel']
}

export default async function ReelPage({ params }: Props) {
  const { id } = await params
  const reel = buildDummyReel(id)

  return (
    <ReelEditorPage
      initialReel={reel}
      signedImageUrls={{}}
      signedAudioUrls={{}}
    />
  )
}
