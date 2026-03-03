'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SceneList } from './scene-list'
import { RemotionPreview } from './remotion-preview'
import { GenerationProgress } from './generation-progress'
import { ExportButton } from './export-button'
import { ChatEditorWidget } from '@/components/chat-editor/chat-editor-widget'
import { useReel } from '@/lib/hooks/use-reel'
import { Zap } from 'lucide-react'
import type { Reel, ReelScene } from '@/lib/supabase/types'
import type { TemplateId } from '@/lib/ai/prompts/reel-chat'


interface ReelEditorPageProps {
  initialReel: Reel & { scenes: ReelScene[] }
  signedImageUrls: Record<string, string>
  signedAudioUrls: Record<string, string>
}

export function ReelEditorPage({ initialReel, signedImageUrls: initImageUrls, signedAudioUrls: initAudioUrls }: ReelEditorPageProps) {
  const { reel, refreshReel } = useReel(initialReel)
  const [selectedSceneId, setSelectedSceneId] = useState<string | undefined>(reel.scenes[0]?.id)
  const [imageUrls, setImageUrls] = useState(initImageUrls)
  const [audioUrls, setAudioUrls] = useState(initAudioUrls)
  const [generating, setGenerating] = useState(
    reel.status === 'generating-blueprint' || reel.status === 'generating-assets'
  )

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      await fetch(`/api/reels/${reel.id}/generate`, { method: 'POST' })
    } catch {
      setGenerating(false)
    }
  }

  const handleGenerationComplete = useCallback(async () => {
    setGenerating(false)
    await refreshReel()
    // Re-fetch signed URLs after generation completes
    try {
      const res = await fetch(`/api/reels/${reel.id}`)
      const json = await res.json()
      const scenes: ReelScene[] = json.data?.scenes ?? []
      const imagePaths = scenes.map((s: ReelScene) => s.image_url).filter(Boolean) as string[]
      const audioPaths = scenes.map((s: ReelScene) => s.audio_url).filter(Boolean) as string[]

      // Refresh signed URLs
      const [imgRes, audRes] = await Promise.all([
        imagePaths.length > 0
          ? fetch(`/api/media/signed-urls`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paths: imagePaths }) })
          : null,
        audioPaths.length > 0
          ? fetch(`/api/media/signed-urls`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paths: audioPaths }) })
          : null,
      ])

      if (imgRes?.ok) setImageUrls(await imgRes.json().then(j => j.data ?? {}))
      if (audRes?.ok) setAudioUrls(await audRes.json().then(j => j.data ?? {}))
    } catch {
      // ignore refresh errors
    }
  }, [reel.id, refreshReel])

  const isReady = reel.status === 'ready'
  const totalDurationSec = Number(reel.duration_sec ?? 60)

  return (
    <div className="flex flex-col h-screen">
      {/* Top nav */}
      <header className="flex items-center justify-between px-6 py-3 border-b bg-background shrink-0">
        <div>
          <h1 className="font-semibold text-sm">{reel.title ?? 'Untitled Reel'}</h1>
          <p className="text-xs text-muted-foreground capitalize">{reel.template} template</p>
        </div>
        <div className="flex items-center gap-3">
          {reel.status === 'pending' && (
            <Button onClick={handleGenerate} disabled={generating} className="gap-2" size="sm">
              <Zap className="w-3.5 h-3.5" />
              Generate Reel
            </Button>
          )}
          {isReady && (
            <ExportButton
              reelId={reel.id}
              reelTitle={reel.title}
            />
          )}
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Scene list */}
        <aside className="w-64 border-r flex flex-col shrink-0">
          <div className="px-4 py-3 border-b">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Scenes ({reel.scenes.length})
            </p>
          </div>
          <div className="flex-1 overflow-hidden">
            <SceneList
              scenes={reel.scenes}
              signedImageUrls={imageUrls}
              selectedSceneId={selectedSceneId}
              onSelectScene={setSelectedSceneId}
            />
          </div>
        </aside>

        <Separator orientation="vertical" />

        {/* Center: Preview */}
        <main className="flex-1 flex flex-col items-center justify-start p-6 gap-6 overflow-y-auto">
          {generating && (
            <div className="w-full max-w-md">
              <GenerationProgress reelId={reel.id} onComplete={handleGenerationComplete} />
            </div>
          )}

          {isReady && reel.scenes.length > 0 ? (
            <div className="w-full max-w-md">
              <RemotionPreview
                template={reel.template as TemplateId}
                scenes={reel.scenes}
                signedImageUrls={imageUrls}
                signedAudioUrls={audioUrls}
                totalDurationSec={totalDurationSec}
              />
            </div>
          ) : !generating && (
            <div className="flex flex-col items-center justify-center h-64 text-center gap-3 text-muted-foreground">
              <Zap className="w-10 h-10 opacity-20" />
              <p className="text-sm">Click "Generate Reel" to create your scenes</p>
            </div>
          )}
        </main>
      </div>

      {/* Floating chat editor */}
      <ChatEditorWidget
        reelId={reel.id}
        sessionId={reel.session_id}
        onEditsApplied={refreshReel}
      />
    </div>
  )
}
