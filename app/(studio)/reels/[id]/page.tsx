import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getReelWithScenes } from '@/lib/supabase/queries/reels'
import { getSignedUrls } from '@/lib/reels/storage-helpers'
import { ReelEditorPage } from '@/components/reel-editor/reel-editor-page'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ReelPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  let reel
  try {
    reel = await getReelWithScenes(supabase, id)
  } catch {
    notFound()
  }

  const imagePaths = reel.scenes.map(s => s.image_url).filter(Boolean) as string[]
  const audioPaths = reel.scenes.map(s => s.audio_url).filter(Boolean) as string[]

  const [signedImageUrls, signedAudioUrls] = await Promise.all([
    imagePaths.length > 0 ? getSignedUrls(supabase, imagePaths).catch(() => ({})) : Promise.resolve({}),
    audioPaths.length > 0 ? getSignedUrls(supabase, audioPaths).catch(() => ({})) : Promise.resolve({}),
  ])

  return (
    <ReelEditorPage
      initialReel={reel}
      signedImageUrls={signedImageUrls}
      signedAudioUrls={signedAudioUrls}
    />
  )
}
